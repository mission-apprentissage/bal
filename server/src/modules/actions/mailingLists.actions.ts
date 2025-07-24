import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { internal } from "@hapi/boom";
import * as Sentry from "@sentry/node";
import { stringify } from "csv-stringify";
import { addJob, IJobsSimple } from "job-processor";
import { Filter, FindCursor, FindOptions, ObjectId, Sort } from "mongodb";
import { getMailingOutputColumns, MAILING_LIST_COMPUTED_COLUMNS } from "shared/constants/mailingList";
import { extensions } from "shared/helpers/zodHelpers/zodPrimitives";
import { IDocument, IMailingListDocument, IUploadDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { IMailingList, IMailingListWithDocumentAndOwner } from "shared/models/mailingList.model";
import { z } from "zod";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import { getTrainingLinks, TrainingLink, TrainingLinkData } from "../../common/apis/lba";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { sleep } from "../../common/utils/asyncUtils";
import { uploadToStorage } from "../../common/utils/ovhUtils";
import { DEFAULT_DELIMITER } from "../../common/utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import {
  createMailingListDocument,
  deleteDocumentById,
  findDocument,
  findDocuments,
  importDocumentContent,
  updateDocument,
} from "./documents.actions";

const MAILING_LIST_BATCH_SIZE = 1_000;

export const MAILING_LIST_DOCUMENT_PREFIX = "mailing-list";

export const createMailingList = async (data: Omit<IMailingList, "_id" | "status" | "created_at" | "updated_at">) => {
  const now = new Date();
  const mailingList: IMailingList = {
    ...data,
    _id: new ObjectId(),
    updated_at: now,
    created_at: now,
  };

  await getDbCollection("mailingLists").insertOne(mailingList);

  return addJob({
    name: "generate:mailing-list",
    payload: {
      mailing_list_id: mailingList._id.toString(),
    },
    queued: true,
  });
};

export const findMailingList = async (filter: Filter<IMailingList>) => {
  return getDbCollection("mailingLists").findOne<IMailingList>(filter);
};

export const findMailingLists = async (filter: Filter<IMailingList>, options?: FindOptions<IMailingList>) => {
  return getDbCollection("mailingLists").find(filter, options).toArray();
};

export const findMailingListWithDocument = async (filter: Filter<IMailingList> | null) => {
  const pipeline = [
    {
      $sort: { created_at: -1 },
    },
    {
      $lookup: {
        from: "users",
        as: "owner",
        let: {
          added_by: "$added_by",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  {
                    $toString: "$$ROOT._id",
                  },
                  "$$added_by",
                ],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "documents",
        as: "document",
        let: {
          document_id: "$document_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  {
                    $toString: "$$ROOT._id",
                  },
                  "$$document_id",
                ],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$document",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  return getDbCollection("mailingLists")
    .aggregate<IMailingListWithDocumentAndOwner>(filter === null ? pipeline : [{ $match: filter }, ...pipeline])
    .toArray();
};

export const updateMailingList = async (filter: Filter<IMailingList>, data: Partial<IMailingList>) => {
  return getDbCollection("mailingLists").updateOne(filter, {
    $set: { ...data, updated_at: new Date() },
  });
};

/**
 * ACTIONS
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface IPayload {
  mailing_list_id: string;
}

export const onMailingListJobExited = async (job: IJobsSimple) => {
  let status: IMailingListDocument["job_status"] = "pending";
  switch (job.status) {
    case "errored":
      status = "error";
      break;
    case "finished":
      status = "done";
      break;
    case "pending":
      status = "pending";
      break;
    case "paused":
      status = "paused";
      break;
    case "running":
      status = "processing";
      break;
  }

  await updateDocument(
    { job_id: job._id.toString() },
    {
      $set: {
        job_status: status,
      },
    }
  );
};

export const handleMailingListJob = async (job: IJobsSimple, payload: IPayload, signal: AbortSignal) => {
  try {
    const mailingList = await findMailingList({
      _id: new ObjectId(payload.mailing_list_id),
    });
    if (!mailingList) throw new Error("Mailing list not found");
    const result = await processMailingList(job, mailingList, signal);

    return result;
  } catch (error) {
    logger.error(error);
    const mailingList = await findMailingList({
      _id: new ObjectId(payload.mailing_list_id),
    });
    const outputDocumentId = mailingList?.document_id ?? null;
    if (outputDocumentId) {
      await updateDocument({ _id: new ObjectId(outputDocumentId) }, { $set: { job_status: "error" } });
    }
    throw error;
  }
};

async function findOrCreateMailingListDocument(
  mailingList: IMailingList,
  sourceDocuments: IUploadDocument[]
): Promise<IMailingListDocument> {
  if (mailingList.document_id) {
    const outputDocument = await findDocument<IMailingListDocument>({ _id: new ObjectId(mailingList.document_id) });

    if (!outputDocument) {
      throw internal("Unable to resume generate:mailing-list: output document not found");
    }
    return outputDocument;
  }

  const outputDocument = await createMailingListDocument(mailingList, sourceDocuments);

  await updateMailingList(
    { _id: mailingList._id },
    {
      document_id: outputDocument._id.toString(),
    }
  );

  return outputDocument;
}

export const processMailingList = async (job: IJobsSimple, mailingList: IMailingList, signal: AbortSignal) => {
  const sourceDocuments = await findDocuments<IUploadDocument>({
    type_document: mailingList.source,
    kind: "upload",
  });

  const outputDocument = await findOrCreateMailingListDocument(mailingList, sourceDocuments);

  await updateDocument({ _id: outputDocument._id }, { $set: { job_id: job._id.toString(), job_status: "processing" } });

  let skip =
    mailingList.document_id == null
      ? 0
      : // TODO: issue count input != count output
        await getDbCollection("documentContents").countDocuments({ document_id: mailingList.document_id });
  let hasMore = true;
  let processed = skip;

  const updateProgress = setInterval(async () => {
    await updateDocument({ _id: outputDocument._id }, { $set: { process_progress: processed } });
  }, 5_000);

  while (hasMore) {
    if (signal.aborted) {
      clearInterval(updateProgress);
      await updateDocument(
        { _id: outputDocument._id },
        { $set: { job_status: "paused", process_progress: processed } }
      );
      throw signal.reason;
    }

    const wishes = await getDbCollection("documentContents")
      .find({ type_document: mailingList.source }, { sort: { _id: 1 } })
      .limit(MAILING_LIST_BATCH_SIZE)
      .skip(skip)
      .toArray();

    const output = await formatOutput(mailingList, wishes);

    await Sentry.startSpan(
      {
        name: "Process mailing list batch",
        op: "queue:task",
        forceTransaction: true,
      },
      async () => {
        Sentry.getCurrentScope().setExtras({ mailingList, skip });
        await importDocumentContent(outputDocument, output);
      }
    );

    processed += wishes.length;

    // Check if there are more documents to retrieve
    if (wishes.length === MAILING_LIST_BATCH_SIZE) {
      skip += MAILING_LIST_BATCH_SIZE;
    } else {
      hasMore = false;
      // wait 5 seconds to make sure ovh has time to process the file before download
      await sleep(5000);
      clearInterval(updateProgress);
      await updateDocument({ _id: outputDocument._id }, { $set: { process_progress: processed, job_status: "done" } });

      logger.info("All documents retrieved");
    }
  }
};

const zCsvDatum = z.record(z.string().optional());

type ICsvDatum = z.infer<typeof zCsvDatum>;

const formatOutput = async (mailingList: IMailingList, documentContents: IDocumentContent[]): Promise<ICsvDatum[]> => {
  const computedData = await getComputeColumnsData(mailingList, documentContents);

  const outputColumns = getMailingOutputColumns(mailingList);

  const rowsArrays = await Promise.all(
    documentContents.map(async (documentContent) => {
      const { email, secondary_email } = mailingList;
      const content = zCsvDatum.parse(documentContent.content);
      const primaryEmail = content[email] ?? null;
      const secondaryEmail = secondary_email ? (content[secondary_email] ?? null) : null;

      const emails: Set<string> = new Set();

      for (const email of [primaryEmail, secondaryEmail]) {
        if (email) {
          try {
            const emailNormalized = extensions.email.parse(email);

            const blacklisted = await getDbCollection("lba.emailblacklists").findOne({
              email: emailNormalized,
            });

            // Only add if the email passes validation and isn't blacklisted
            if (!blacklisted) {
              emails.add(emailNormalized);
            }
          } catch (error) {
            logger.error(`Failed to normalize email ${email}`, error);
          }
        }
      }

      return Array.from(emails).map((email: string) => {
        const docComputedData = computedData.get(documentContent._id.toString()) ?? {};
        const outputRow: Record<string, string> = {
          email,
        };

        for (const { column, output: outputColumnName } of outputColumns) {
          if (outputColumnName !== "email") {
            // avoid overriding email column
            // Priority: email > computedData > content
            outputRow[outputColumnName] = outputRow[column] ?? docComputedData[column] ?? content[column] ?? "";
          }
        }

        return outputRow;
      });
    })
  );

  return rowsArrays.flat();
};

async function getComputeColumnsData(
  mailingList: IMailingList,
  documentContents: IDocumentContent[]
): Promise<Map<string, ICsvDatum>> {
  const names = new Set(mailingList.output_columns.map((c) => c.column));

  const computedData = await Promise.all([
    names.has(MAILING_LIST_COMPUTED_COLUMNS.WEBHOOK_LBA.key)
      ? getLbaComputeData(mailingList, documentContents)
      : new Map(),
    names.has(MAILING_LIST_COMPUTED_COLUMNS.BOUNCER.key)
      ? getBouncerComputeData(mailingList, documentContents)
      : new Map(),
  ]);

  const result: Map<string, ICsvDatum> = new Map();

  documentContents.forEach((doc) => {
    const id = doc._id.toString();
    const d = computedData.reduce<ICsvDatum>((acc, extraData) => {
      if (extraData.has(doc._id.toString())) {
        Object.assign(acc, extraData.get(doc._id.toString()));
      }

      return acc;
    }, {});

    result.set(id, d);
  });

  return result;
}

const getLbaComputeData = async (
  mailingList: IMailingList,
  documentContents: IDocumentContent[]
): Promise<Map<string, ICsvDatum>> => {
  const {
    training_columns: {
      cle_ministere_educatif,
      cfd,
      rncp,
      mef,
      uai_lieu_formation,
      uai_formateur,
      uai_formateur_responsable,
      code_postal,
      code_insee,
    },
  } = mailingList;

  const payload: TrainingLinkData[] = documentContents.map((documentContent) => {
    const content = documentContent.content as Record<string, string>;

    const query: TrainingLinkData = {
      id: documentContent._id.toString(),
      cle_ministere_educatif: null,
      mef: null,
      cfd: null,
      rncp: null,
      code_postal: null,
      uai_lieu_formation: null,
      uai_formateur: null,
      uai_formateur_responsable: null,
      code_insee: null,
      siret_lieu_formation: null,
      siret_formateur: null,
      siret_formateur_responsable: null,
    };

    if (!content) {
      return query;
    }

    if (cle_ministere_educatif) {
      query.cle_ministere_educatif = content[cle_ministere_educatif] ?? null;
    }
    if (mef) {
      query.mef = content[mef]?.substring(0, 10) ?? null;
    }
    if (cfd) {
      query.cfd = content[cfd] ?? null;
    }
    if (rncp) {
      query.rncp = content[rncp] ?? null;
    }
    if (code_postal) {
      query.code_postal = content[code_postal] ?? null;
    }
    if (uai_lieu_formation) {
      query.uai_lieu_formation = content[uai_lieu_formation] ?? null;
    }
    if (uai_formateur) {
      query.uai_formateur = content[uai_formateur] ?? null;
    }
    if (uai_formateur_responsable) {
      query.uai_formateur_responsable = content[uai_formateur_responsable] ?? null;
    }
    if (code_insee) {
      query.code_insee = content[code_insee] ?? null;
    }

    return query;
  });

  const trainingLinks: TrainingLink[] = await getTrainingLinks(payload).catch((error) => {
    logger.error(error);
    Sentry.captureException(error, { extra: { payload } });
    return [];
  });

  logger.info(trainingLinks);

  return trainingLinks.reduce<Map<string, ICsvDatum>>((acc, trainingLink) => {
    acc.set(trainingLink.id, { ...trainingLink });

    return acc;
  }, new Map());
};

const getBouncerComputeData = async (
  mailingList: IMailingList,
  documentContents: IDocumentContent[]
): Promise<Map<string, ICsvDatum>> => {
  const emailColumn = mailingList.output_columns.find((c) => c.output === "email")?.column;

  if (!emailColumn) {
    return new Map();
  }

  const documentIdToEmail = new Map<string, string>();
  for (const documentContent of documentContents) {
    const email = documentContent.content?.[emailColumn]?.toString() ?? "";
    documentIdToEmail.set(documentContent._id.toString(), email);
  }

  const pingResults = await verifyEmails(Array.from(documentIdToEmail.values()));

  const pingResultsMap = new Map<string, ICsvDatum>();
  for (let i = 0; i < pingResults.length; i++) {
    const { email, ping } = pingResults[i];
    pingResultsMap.set(email, {
      bounce_status: ping.status,
      bounce_message: ping.message,
      bounce_response_code: ping.responseCode ?? "",
      bounce_response_message: ping.responseMessage ?? "",
    });
  }

  const result = new Map<string, ICsvDatum>();
  for (const documentContent of documentContents) {
    const id = documentContent._id.toString();
    const email = documentIdToEmail.get(id)!;
    const pingResult = pingResultsMap.get(email) ?? {
      bounce_status: "unknown",
      bounce_message: "Email not found in bouncer",
      bounce_response_code: "",
      bounce_response_message: "",
    };
    result.set(id, pingResult);
  }

  return result;
};

async function* getLine(mailingList: IMailingList, cursor: FindCursor<IDocumentContent>) {
  let currentLine: (Record<string, unknown> & { wishes: unknown[] }) | null = null;
  for await (const { content } of cursor) {
    if (!content) continue;
    const identifiersOutput = mailingList.output_columns
      .filter((c) => mailingList.identifier_columns.includes(c.column))
      .map((c) => c.output);
    const identifiers = ["email", ...identifiersOutput];

    if (currentLine !== null) {
      const areIdentifiersEqual = identifiers.every((column) => content[column] === currentLine?.[column]);

      if (!areIdentifiersEqual) {
        yield currentLine;
        currentLine = null;
      }
    }

    if (currentLine === null) {
      currentLine = {
        wishes: [],
      };

      for (const identifier of identifiers) {
        currentLine[identifier] = content[identifier];
      }
    }

    const notIdentifiers = getMailingOutputColumns(mailingList)
      .filter((c) => !identifiers.includes(c.output))
      .map((c) => c.output);

    const rest: Record<string, unknown> = {};

    for (const key of Object.keys(content)) {
      if (notIdentifiers.includes(key)) {
        rest[key] = content[key];
      }
    }

    currentLine.wishes.push(rest);
  }

  if (currentLine !== null) yield currentLine;
}

export const createMailingListFile = async (mailingList: IMailingList, document: IDocument) => {
  const identifierColumns = mailingList.output_columns
    .filter((c) => mailingList.identifier_columns.includes(c.column))
    .map((c) => c.output);

  const sort: Sort = {
    "content.email": 1,
  };

  for (const column of identifierColumns) {
    sort[`content.${column}`] = 1;
  }

  // For perfomance reason, we don't use additional identifierColumns
  // Hence, this will be a upper bound
  const wishesPerEmail = await getDbCollection("documentContents")
    .aggregate([
      {
        $match: {
          document_id: document._id.toString(),
          "content.email": { $exists: true },
        },
      },
      {
        $group: { _id: "$content.email", count: { $sum: 1 } },
      },
      { $group: { _id: null, count: { $max: "$count" } } },
    ])
    .toArray();

  const maxWishArraySize = wishesPerEmail[0]?.count ?? 1;

  const documentContentsCursor = getDbCollection("documentContents").find(
    {
      document_id: document._id.toString(),
      "content.email": {
        $ne: "",
        $regex: EMAIL_REGEX,
      },
    },
    {
      projection: { _id: 0, content: 1 },
      sort,
    }
  );

  const parser = stringify({
    header: true,
    delimiter: DEFAULT_DELIMITER,
    bom: true,
  });

  let progress = 0;

  await pipeline(
    getLine(mailingList, documentContentsCursor),
    new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform(line, _encoding, callback) {
        if (progress % 100 === 0) console.log(progress);
        progress++;
        const outputColumns = getMailingOutputColumns(mailingList);
        const arrayKeys = outputColumns.filter((c) => !c.simple).map((c) => c.output);

        const flat: Record<string, string> = {
          email: line.email,
        };

        const simpleKeys = outputColumns.filter((c) => c.simple).map((c) => c.output);

        for (const key of simpleKeys) {
          flat[key] = line?.[key] ?? line.wishes[0]?.[key] ?? "";
        }

        for (let i = 0; i < maxWishArraySize; i++) {
          for (const key of arrayKeys) {
            flat[`${key}_${i + 1}`] = line.wishes[i]?.[key] ?? "";
          }
        }

        callback(null, flat);
      },
    }),
    parser,
    crypto.isCipherAvailable() ? crypto.cipher(document.hash_secret) : noop(),
    await uploadToStorage(document.chemin_fichier, {
      contentType: "text/csv",
    })
  );

  // await deleteDocumentContent({
  //   document_id: document._id.toString(),
  // });
};

export const deleteMailingList = async (mailingList: IMailingList) => {
  if (mailingList?.document_id) {
    await deleteDocumentById(new ObjectId(mailingList.document_id));
  }

  await getDbCollection("mailingLists").deleteOne({ _id: mailingList._id });
};

import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { stringify } from "csv-stringify";
import { Filter, FindCursor, FindOptions, ObjectId, Sort } from "mongodb";
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { IMailingList, MAILING_LIST_MAX_ITERATION, MAILING_LIST_STATUS } from "shared/models/mailingList.model";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
  TrainingLink,
  TrainingLinkData,
} from "../../common/apis/lba";
import { sleep } from "../../common/utils/asyncUtils";
import { uploadToStorage } from "../../common/utils/ovhUtils";
import { addJob } from "../jobs/jobs_actions";
import { noop } from "../server/utils/upload.utils";
import { createEmptyDocument, deleteDocumentById, findDocument, importDocumentContent } from "./documents.actions";
import { findJob, updateJob } from "./job.actions";

/**
 * CRUD
 */

export const MAILING_LIST_DOCUMENT_PREFIX = "mailing-list";
export const MAILING_LIST_WEBHOOK_LBA = "WEBHOOK_LBA";

export const createMailingList = async (data: Omit<IMailingList, "_id" | "status">) => {
  const now = new Date();
  const { insertedId: mailingListId } = await getDbCollection("mailingLists").insertOne({
    ...data,
    status: MAILING_LIST_STATUS.PROCESSING,
    updated_at: now,
    created_at: now,
  });

  return addJob({
    name: "generate:mailing-list",
    payload: {
      mailing_list_id: mailingListId.toString(),
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

export const handleMailingListJob = async (payload: IPayload) => {
  try {
    return processMailingList(payload);
  } catch (error) {
    logger.error(error);
    await updateMailingList({ _id: new ObjectId(payload.mailing_list_id) }, { status: MAILING_LIST_STATUS.ERROR });
    throw error;
  }
};

export const processMailingList = async (payload: IPayload) => {
  const mailingList = await findMailingList({
    _id: new ObjectId(payload.mailing_list_id),
  });

  if (!mailingList) throw new Error("Mailing list not found");

  const job = await findJob({
    "payload.mailing_list_id": mailingList._id.toString(),
  });

  if (!job) throw new Error("Job not found");

  const document = await findDocument({
    type_document: mailingList.source,
  });

  if (!document) throw new Error("Document not found");

  // create output document
  const outputDocument = await createEmptyDocument({
    type_document: `${MAILING_LIST_DOCUMENT_PREFIX}-${mailingList.source}`,
    filename: `${MAILING_LIST_DOCUMENT_PREFIX}-${mailingList.source}-${new ObjectId()}.csv`,
  });

  if (!outputDocument) throw new Error("Output document not found");

  await updateMailingList({ _id: mailingList._id }, { document_id: outputDocument._id.toString() });

  const batchSize = LIMIT_TRAINING_LINKS_PER_REQUEST;
  let skip = 0;
  let hasMore = true;
  let processed = 0;

  while (hasMore) {
    const wishes = await getDbCollection("documentContents")
      .find({
        document_id: document._id.toString(),
      })
      .limit(batchSize)
      .skip(skip)
      .toArray();

    const output = await formatOutput(mailingList, wishes);

    await importDocumentContent(outputDocument, output, (line) => line);

    processed += wishes.length;

    await updateJob(job._id, {
      "payload.processed": document.lines_count ? (processed / document.lines_count) * 100 : 0,
      "payload.processed_count": processed,
    });
    // Check if there are more documents to retrieve
    if (wishes.length === batchSize) {
      skip += batchSize;
    } else {
      hasMore = false;
      // wait 5 seconds to make sure ovh has time to process the file before download
      await sleep(5000);
      await updateMailingList({ _id: mailingList._id }, { status: MAILING_LIST_STATUS.DONE });

      logger.info("All documents retrieved");
    }
  }
};

const formatOutput = async (mailingList: IMailingList, documentContents: IDocumentContent[]) => {
  const toDuplicate: unknown[] = [];
  let data = documentContents;
  let outputColumns = mailingList.output_columns;
  const needsLbaData = outputColumns.map((c) => c.column).includes(MAILING_LIST_WEBHOOK_LBA);

  if (needsLbaData) {
    data = await mergeLbaData(data);
  }

  outputColumns = getOutputColumnsWithLba(mailingList);

  const rows = data.map((documentContent) => {
    const { email, secondary_email } = mailingList;

    const primaryEmail = documentContent?.content?.[email] as string;
    const secondaryEmail = secondary_email && (documentContent?.content?.[secondary_email] as string);
    // filtrer les emails invalides et doublons
    const emails = [...new Set([primaryEmail, secondaryEmail])].filter((e) => EMAIL_REGEX.test(e ?? ""));

    const outputRow: Record<string, string> = {
      email: emails?.[0] ?? "",
    };

    for (const outputColumn of outputColumns) {
      // avoid overriding email column
      if (outputColumn.output === "email") continue;

      const outputColumnName = outputColumn.output;
      const outputColumnValue = documentContent?.content?.[outputColumn.column] ?? "";
      outputRow[outputColumnName] = outputColumnValue as string;
    }

    if (emails.length === 2) {
      toDuplicate.push({ ...outputRow, email: emails[1] });
    }

    return outputRow;
  });

  return [...rows, ...toDuplicate];
};

const mergeLbaData = async (documentContents: IDocumentContent[]) => {
  const payload: TrainingLinkData[] = documentContents.map((documentContent) => {
    const content = documentContent.content as Record<string, string>;

    return {
      id: documentContent._id.toString(),
      cle_ministere_educatif: content?.cle_ministere_educatif ?? "",
      mef: content?.code_mef?.substring(0, 10) ?? "",
      cfd: content?.cfd ?? "", // pas présent dans le fichier
      rncp: content?.rncp ?? "", // pas présent dans le fichier
      code_postal: content?.code_postal ?? "",
      uai: content?.code_uai_etab_accueil ?? "",
      uai_lieu_formation: content?.uai_lieu_formation ?? content?.organisme_uai ?? "",
      uai_formateur: content?.uai_formateur ?? content?.organisme_uai ?? "",
      uai_formateur_responsable: content?.uai_formateur_responsable ?? content?.organisme_uai ?? "",
      code_insee: content?.code_insee ?? "",
    };
  });

  let trainingLinks: TrainingLink[] = [];

  try {
    trainingLinks = await getTrainingLinks(payload);
  } catch (error) {
    logger.error(error);
  }

  return documentContents.map((dc) => {
    const trainingLink = trainingLinks.find((tl) => tl.id === dc._id.toString());

    const content = { ...dc.content, ...trainingLink };

    return { ...dc, content };
  });
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

    const notIdentifiers = getOutputColumnsWithLba(mailingList)
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

const getOutputColumnsWithLba = (mailingList: IMailingList) => {
  const outputColumns = mailingList.output_columns;
  const needsLbaData = outputColumns.find((c) => c.column === MAILING_LIST_WEBHOOK_LBA);

  if (!needsLbaData) return outputColumns;

  return [
    ...outputColumns,
    // LBA columns
    { column: "lien_lba", output: "lien_lba", grouped: true },
    { column: "lien_prdv", output: "lien_prdv", grouped: true },
    // remove WEBHOOK_LBA column
  ].filter((c) => c.column !== MAILING_LIST_WEBHOOK_LBA);
};

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

  const documentContents = await getDbCollection("documentContents").find(
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
    delimiter: ";",
    bom: true,
  });

  let progress = 0;

  await pipeline(
    getLine(mailingList, documentContents),
    new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform(line, _encoding, callback) {
        if (progress % 100 === 0) console.log(progress);
        progress++;
        const outputColumns = getOutputColumnsWithLba(mailingList);
        const keys = outputColumns.filter((c) => c.grouped).map((c) => c.output);

        const flat: Record<string, string> = {
          email: line.email,
        };

        const ungrouped = outputColumns.filter((c) => !c.grouped).map((c) => c.output);

        for (const key of ungrouped) {
          flat[key] = line?.[key] ?? line.wishes[0]?.[key] ?? "";
        }

        for (let i = 0; i < MAILING_LIST_MAX_ITERATION; i++) {
          for (const key of keys) {
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

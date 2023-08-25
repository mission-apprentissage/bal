import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { stringify } from "csv-stringify";
import { Filter, FindCursor, FindOptions, ObjectId, Sort } from "mongodb";
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import {
  IMailingList,
  MAILING_LIST_STATUS,
} from "shared/models/mailingList.model";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import { LIMIT_TRAINING_LINKS_PER_REQUEST } from "../../common/apis/lba";
import { uploadToStorage } from "../../common/utils/ovhUtils";
import { addJob } from "../jobs/jobs_actions";
import { noop } from "../server/utils/upload.utils";
import {
  createEmptyDocument,
  deleteDocumentById,
  findDocument,
  importDocumentContent,
} from "./documents.actions";
import { findJob, updateJob } from "./job.actions";

/**
 * CRUD
 */

export const MAILING_LIST_DOCUMENT_PREFIX = "mailing-list";

export const createMailingList = async (
  data: Omit<IMailingList, "_id" | "status">
) => {
  const now = new Date();
  const { insertedId: mailingListId } = await getDbCollection(
    "mailingLists"
  ).insertOne({
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
  });
};

export const findMailingList = async (filter: Filter<IMailingList>) => {
  return getDbCollection("mailingLists").findOne<IMailingList>(filter);
};

export const findMailingLists = async (
  filter: Filter<IMailingList>,
  options?: FindOptions<IMailingList>
) => {
  return getDbCollection("mailingLists").find(filter, options).toArray();
};

export const updateMailingList = async (
  filter: Filter<IMailingList>,
  data: Partial<IMailingList>
) => {
  return getDbCollection("mailingLists").updateOne(filter, {
    $set: { ...data, updated_at: new Date() },
  });
};

/**
 * ACTIONS
 */

const EMAIL_REGEX =
  /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\.[-_0-9a-zA-Z]+)*|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/;

interface IPayload {
  mailing_list_id: string;
}

export const processMailingList = async (payload: IPayload) => {
  const mailingList = await findMailingList({
    _id: new ObjectId(payload.mailing_list_id),
  });

  if (!mailingList) throw new Error("Mailing list not found");

  return handleSourceVoeuxAffelnetParcoursup(mailingList);
};

const handleSourceVoeuxAffelnetParcoursup = async (
  mailingList: IMailingList
) => {
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
    filename: `${MAILING_LIST_DOCUMENT_PREFIX}-${
      mailingList.source
    }-${new ObjectId()}.csv`,
  });

  if (!outputDocument) throw new Error("Output document not found");

  await updateMailingList(
    { _id: mailingList._id },
    { document_id: outputDocument._id.toString() }
  );

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

    if (!wishes.length) {
      hasMore = false;
      continue;
    }

    const output = await formatOutput(mailingList, wishes);

    // const data: TrainingLinkData[] = wishes.map((w) => ({
    //   id: w._id.toString(),
    //   cle_ministere_educatif: w.content?.cle_ministere_educatif ?? "",
    //   mef: w.content?.code_mef ?? "",
    //   code_postal: w.content?.code_postal ?? "",
    //   uai: w.content?.code_uai_etab_accueil ?? "",
    //   cfd: w.content?.cfd ?? "", // pas présent dans le fichier
    //   rncp: w.content?.rncp ?? "", // pas présent dans le fichier
    // }));

    // const trainingLinks = (await getTrainingLinks(data)) as TrainingLink[];

    // const toDuplicate: (TrainingLink & WishContent & { email?: string })[] = [];
    // const trainingLinksWithWishes = trainingLinks
    //   .map((tl) => {
    //     const wish = wishes.find((w) => w._id.toString() === tl.id);
    //     const {
    //       mail_responsable_1,
    //       mail_responsable_2,
    //       nom_eleve,
    //       prenom_1,
    //       prenom_2,
    //       prenom_3,
    //       libelle_etab_accueil,
    //       libelle_formation,
    //     } = wish?.content ?? {};

    //     // filtrer les emails invalides
    //     const emails = [
    //       ...new Set([mail_responsable_1, mail_responsable_2]),
    //     ].filter((e) => EMAIL_REGEX.test(e ?? ""));

    //     const wishData = {
    //       ...tl,
    //       email: emails?.[0] ?? "",
    //       nom_eleve: nom_eleve ?? "",
    //       prenom_eleve: [prenom_1 ?? "", prenom_2 ?? "", prenom_3 ?? ""]
    //         .join(" ")
    //         .trim(),
    //       libelle_etab_accueil: libelle_etab_accueil ?? "",
    //       libelle_formation: libelle_formation ?? "",
    //     };

    //     return wishData;
    //   })
    //   .flat();

    await importDocumentContent(outputDocument, output, (line) => line);

    processed += wishes.length;

    await updateJob(job._id, {
      "payload.processed": document.lines_count
        ? (processed / document.lines_count) * 100
        : 0,
      "payload.processed_count": processed,
    });
    // Check if there are more documents to retrieve
    if (wishes.length === batchSize) {
      skip += batchSize;
    } else {
      hasMore = false;
      await updateMailingList(
        { _id: mailingList._id },
        { status: MAILING_LIST_STATUS.DONE }
      );

      logger.info("All documents retrieved");
    }
  }
};

const formatOutput = async (
  mailingList: IMailingList,
  documentContents: IDocumentContent[]
) => {
  const toDuplicate: unknown[] = [];
  const data = documentContents.map((documentContent) => {
    const { email, secondary_email } = mailingList;

    const primaryEmail = (documentContent?.content?.[email] as string) ?? "";
    const secondaryEmail =
      (secondary_email &&
        (documentContent?.content?.[secondary_email] as string)) ??
      "";
    // filtrer les emails invalides et doublons
    const emails = [...new Set([primaryEmail, secondaryEmail])].filter((e) =>
      EMAIL_REGEX.test(e ?? "")
    );

    const outputRow: Record<string, string> = {
      email: emails?.[0],
    };

    for (const outputColumn of mailingList.output_columns) {
      const outputColumnName = outputColumn.output;
      const outputColumnValue =
        documentContent?.content?.[outputColumn.column] ?? "";
      outputRow[outputColumnName] = outputColumnValue as string;
    }

    if (emails.length === 2) {
      toDuplicate.push({ ...outputRow, email: emails[1] });
    }
  });

  return [...data, ...toDuplicate];
};

async function* getLine(
  mailingList: IMailingList,
  cursor: FindCursor<IDocumentContent>
) {
  let currentLine: (Record<string, unknown> & { wishes: unknown[] }) | null =
    null;
  for await (const { content } of cursor) {
    if (!content) continue;
    const identifiersOutput = mailingList.output_columns
      .filter((c) => mailingList.identifier_columns.includes(c.column))
      .map((c) => c.output);
    const identifiers = ["email", ...identifiersOutput];

    if (currentLine !== null) {
      for (const identifier of identifiers) {
        if (
          currentLine?.[identifier] &&
          currentLine?.[identifier] !== content[identifier]
        ) {
          yield currentLine;
          currentLine = null;
        }
      }
    }

    currentLine = {
      wishes: [],
    };

    for (const identifier of identifiers) {
      currentLine[identifier] = content[identifier];
    }

    const notIdentifiers = mailingList.output_columns
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

export const createMailingListFile = async (
  mailingList: IMailingList,
  document: IDocument
) => {
  const groupBy = mailingList.output_columns
    .filter((c) => mailingList.identifier_columns.includes(c.column))
    .map((c) => c.output);

  const sort: Sort = {
    "content.email": 1,
  };

  for (const column of groupBy) {
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
        const keys = mailingList.output_columns
          .filter((c) => c.grouped)
          .map((c) => c.output);

        const flat: Record<string, string> = {
          email: line.email,
        };

        const ungrouped = mailingList.output_columns
          .filter((c) => !c.grouped)
          .map((c) => c.output);

        for (const key of ungrouped) {
          flat[key] = line?.[key] ?? line.wishes[0]?.[key] ?? "";
        }

        for (let i = 0; i < 10; i++) {
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

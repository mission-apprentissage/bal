import { Filter, UpdateFilter } from "mongodb";
import { IDocument } from "shared/models/document.model";
import { IMailingList } from "shared/models/mailingList.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

// import { Readable } from "stream";
import { getDbCollection } from "@/utils/mongodbUtils";

import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
  // TrainingLink,
} from "../../common/apis/lba";
import {
  createEmptyDocument,
  extractDocumentContent,
  findDocument,
  importDocumentContent,
  // uploadDocument,
} from "./documents.actions";
// import { findUser } from "./users.actions";

interface ContentLine {
  // Lignes affelnet et parcoursup
  mail_responsable_1: string;
  mail_responsable_2: string;
  code_mef: string;
  cfd: string;
  code_postal: string;
  code_uai_etab_accueil: string;
  rncp: string;
  cle_ministere_educatif: string;
}

const DEFAULT_LOOKUP = {
  from: "documents",
  let: { documentId: { $toObjectId: "$document_id" } },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ["$_id", "$$documentId"] },
      },
    },
  ],
  as: "document",
};

const DEFAULT_UNWIND = {
  path: "$document",
  preserveNullAndEmptyArrays: true,
};

/**
 * CRUD
 */

interface ICreateMailingList extends Omit<IMailingList, "_id"> {}

export const createMailingList = async (data: ICreateMailingList) => {
  const { insertedId: _id } = await getDbCollection("mailingLists").insertOne(
    data
  );

  return findMailingList({ _id });
};

export const findMailingList = async (filter: Filter<IMailingList>) => {
  return getDbCollection("mailingLists")
    .aggregate<IMailingList>([
      {
        $match: filter,
      },
      {
        $lookup: DEFAULT_LOOKUP,
      },
      {
        $unwind: DEFAULT_UNWIND,
      },
    ])
    .next();
};

export const findMailingLists = async (filter: Filter<IMailingList>) => {
  const users = await getDbCollection("mailingLists")
    .aggregate<IMailingList>([
      {
        $match: filter,
      },
      {
        $lookup: DEFAULT_LOOKUP,
      },
      {
        $unwind: DEFAULT_UNWIND,
      },
    ])
    .toArray();

  return users;
};

export const updateMailingList = async (
  mailingList: IMailingList,
  data: Partial<IMailingList>,
  updateFilter: UpdateFilter<IMailingList> = {}
) => {
  return await getDbCollection("mailingLists").findOneAndUpdate(
    {
      _id: mailingList._id,
    },
    {
      $set: data,
      ...updateFilter,
    }
  );
};

/**
 * ACTIONS
 */

export const handleVoeuxParcoursupFileContent = async (document: IDocument) => {
  const content = (await extractDocumentContent(
    document,
    ";"
  )) as ContentLine[];
  const documentContents = await importDocumentContent(
    document._id,
    content,
    (line) => line
  );

  return documentContents;
};

export const createMailingListFile = async (mailingList: IMailingList) => {
  if (!mailingList) {
    throw new Error("Error creating mailing list");
  }

  switch (mailingList.source) {
    case DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_MAI_2023:
      return handleVoeuxParcoursupMai2023(mailingList);

    default:
      break;
  }

  return;
};

const handleVoeuxParcoursupMai2023 = async (mailingList: IMailingList) => {
  const document = await findDocument({
    type_document: mailingList.source,
  });

  if (!document) throw new Error("Document not found");

  const batchSize = LIMIT_TRAINING_LINKS_PER_REQUEST;
  let skip = 0;
  let hasMore = true;
  // let trainingLinksResults: TrainingLink[] = [];

  const outputDocumentId = await createEmptyDocument({
    type_document: `mailing-list-${DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023}`,
    filename: `mailing-list-${mailingList._id.toString()}-${
      mailingList.source
    }.csv`,
    mimetype: "text/csv",
  });

  console.log(outputDocumentId);

  while (hasMore) {
    try {
      const wishes = await getDbCollection("documentContents")
        .find({ document_id: document._id.toString() })
        .limit(batchSize)
        .skip(skip)
        .toArray();

      if (!wishes.length) {
        hasMore = false;
        continue;
      }

      // TODO: vérifier le nom des colonnes
      const data = wishes?.map((dc) => ({
        id: dc._id.toString(),
        cle_ministere_educatif: dc.content?.cle_ministere_educatif ?? "",
        mef: dc.content?.code_mef ?? "",
        code_postal: dc.content?.code_postal ?? "",
        uai: dc.content?.code_uai_etab_accueil ?? "",
        cfd: dc.content?.cfd ?? "", // pas présent dans le fichier
        rncp: dc.content?.rncp ?? "", // pas présent dans le fichier
        email:
          dc.content?.mail_responsable_1 ??
          dc.content?.mail_responsable_2 ??
          "",
      }));

      // trainingLinksResults = [
      //   ...trainingLinksResults,
      //   await getTrainingLinks(data),
      // ];

      const tmp = await getTrainingLinks(data);
      const tmpContent = tmp.flat();

      // const documentContents =
      await importDocumentContent(outputDocumentId, tmpContent, (line) => line);

      // Check if there are more documents to retrieve
      if (wishes.length === batchSize) {
        skip += batchSize;
      } else {
        hasMore = false;
        console.log("All documents retrieved");
      }
    } catch (err) {
      await updateMailingList(mailingList, {
        status: "error",
      });
      console.error("Error retrieving documents:", err);
      return;
    }
  }

  // const trainingLinks = trainingLinksResults.flat();

  // const csvContent = generateCsvFromJson(trainingLinks, {
  //   withHeader: true,
  // });

  // const stream = new Readable();
  // stream.push(csvContent);
  // stream.push(null);

  // const user = await findUser({ _id: new ObjectId(mailingList.user_id) });

  // if (!user) {
  //   throw new Error("User not found");
  // }

  // const mailingListDocument = await uploadDocument(user, stream, {
  //   type_document: `mailing-list-${DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023}`,
  //   fileSize: stream.readableLength,
  //   filename: `mailing-list-${mailingList._id.toString()}-${
  //     mailingList.source
  //   }.csv`,
  //   mimetype: "text/csv",
  // });

  // if (!mailingListDocument) {
  //   throw new Error("Error uploading mailing list document");
  // }

  // await updateMailingList(mailingList, {
  //   document_id: mailingListDocument._id.toString(),
  //   status: "finished",
  // });

  // return mailingListDocument;
};

/**
 * Ne gère pas l'ordre des colonnes, les attributs doivent être dans le même ordre pour chaque ligne
 */
export const generateCsvFromJson = <T extends object>(
  items: T[],
  options?: {
    withHeader?: boolean;
  }
) => {
  const replacer = (_key: string, value: string) =>
    value === null ? "" : value;
  const header = Object.keys(items[0]);
  let csv: string[] = [];

  if (options?.withHeader) {
    csv = [header.join(",")];
  }

  return [
    ...csv,
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\n");
};

import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { stringify } from "csv-stringify";
import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { IDocument } from "shared/models/document.model";
import { IMailingList } from "shared/models/mailingList.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import logger from "@/common/logger";
import * as crypto from "@/utils/cryptoUtils";
import { getDbCollection } from "@/utils/mongodbUtils";

import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
  TrainingLink,
} from "../../common/apis/lba";
import { uploadToStorage } from "../../utils/ovhUtils";
import { noop } from "../server/utils/upload.utils";
import {
  createEmptyDocument,
  deleteDocumentById,
  extractDocumentContent,
  findDocument,
  importDocumentContent,
} from "./documents.actions";

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
  logger.info("extract wishes started");
  await extractDocumentContent(document);

  // return documentContents;
};

export const processMailingList = async (mailingList: IMailingList) => {
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

  const outputDocument = await createEmptyDocument({
    type_document: `mailing-list-${DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023}`,
    filename: `mailing-list-${mailingList._id.toString()}-${
      mailingList.source
    }.csv`,
  });

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
        nom_eleve: dc.content?.nom_eleve ?? "",
        prenom_eleve: [
          dc.content?.prenom_1 ?? "",
          dc.content?.prenom_2 ?? "",
          dc.content?.prenom_3 ?? "",
        ]
          .join(" ")
          .trim(),
        libelle_etab_accueil: dc.content?.libelle_etab_accueil ?? "",
        libelle_formation: dc.content?.libelle_formation ?? "",
      }));

      const tmp = (await getTrainingLinks(data)) as TrainingLink[];
      const tmpContent = tmp.flat();

      await importDocumentContent(outputDocument, tmpContent, (line) => line);

      // Check if there are more documents to retrieve
      if (wishes.length === batchSize) {
        skip += batchSize;
      } else {
        hasMore = false;
        logger.info("All documents retrieved");
      }
    } catch (err) {
      await updateMailingList(mailingList, {
        status: "error",
      });
      console.error("Error retrieving documents:", err);
      return;
    }
  }

  await updateMailingList(mailingList, {
    document_id: outputDocument._id.toString(),
    status: "finished",
  });
};

async function* getLine(cursor) {
  let currentLine = {
    email: null,
    nom_eleve: null,
    prenom_eleve: null,
    wishes: [] as any[],
  };
  for await (const {
    content: { email, nom_eleve, prenom_eleve, ...rest },
  } of cursor) {
    if (currentLine.email !== null && email !== currentLine.email) {
      yield currentLine;
      currentLine = {
        email: null,
        nom_eleve: null,
        prenom_eleve: null,
        wishes: [],
      };
    }

    currentLine.email = email;
    currentLine.nom_eleve = nom_eleve;
    currentLine.prenom_eleve = prenom_eleve;
    currentLine.wishes.push(rest);
  }

  if (currentLine.email !== null) yield currentLine;
}

export const createMailingListFile = async (document: any) => {
  const documentContents = await getDbCollection("documentContents").find(
    {
      document_id: document._id.toString(),
      "content.email": {
        $ne: "",
        $regex:
          /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\.[-_0-9a-zA-Z]+)*|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/,
      },
    },
    {
      projection: { _id: 0, content: 1 },
      sort: {
        "content.email": 1,
      },
    }
  );

  const parser = stringify({
    header: true,
    delimiter: ";",
    bom: true,
  });

  let progress = 0;

  await pipeline(
    getLine(documentContents),
    new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform(line, _encoding, callback) {
        if (progress % 100 === 0) console.log(progress);
        progress++;
        const keys = [
          "lien_prdv",
          "lien_lba",
          "libelle_etab_accueil",
          "libelle_formation",
        ];
        const flat = {
          email: line.email,
          nom_eleve: line.nom_eleve,
          prenom_eleve: line.prenom_eleve,
        };
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
  await deleteDocumentById(new ObjectId(mailingList.document_id));
  await getDbCollection("mailingLists").deleteOne({ _id: mailingList._id });
};

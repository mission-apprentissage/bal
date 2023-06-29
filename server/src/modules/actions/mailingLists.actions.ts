import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { stringify } from "csv-stringify";
import { Filter, ObjectId } from "mongodb";
import { IJob } from "shared/models/job.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
  TrainingLink,
} from "../../common/apis/lba";
import { uploadToStorage } from "../../common/utils/ovhUtils";
import { addJob } from "../jobs/jobs";
import { noop } from "../server/utils/upload.utils";
import {
  createEmptyDocument,
  deleteDocumentById,
  findDocument,
  importDocumentContent,
} from "./documents.actions";
import { findJob, findJobs, updateJob } from "./job.actions";

/**
 * CRUD
 */

export interface IMailingList {
  user_id: string;
  source: string;
  document_id?: string;
}

export const createMailingList = async (data: IMailingList) => {
  const outputDocument = await createEmptyDocument({
    type_document: `mailing-list-${data.source}`,
    filename: `mailing-list-${data.source}-${new ObjectId()}.csv`,
  });

  return addJob({
    name: "generate:mailing-list",
    payload: {
      user_id: data.user_id,
      source: data.source,
      document_id: outputDocument._id.toString(),
    },
  });
};

export const findMailingList = async (filter: Filter<IJob>) => {
  return findJob({
    name: "generate:mailing-list",
    ...filter,
  });
};

export const findMailingLists = async (filter: Filter<IJob>) => {
  return findJobs(filter);
};

export const updateMailingList = async (
  _id: ObjectId,
  data: Partial<IMailingList>
) => {
  return updateJob(_id, data);
};

/**
 * ACTIONS
 */

export const processMailingList = async (mailingList: IMailingList) => {
  switch (mailingList.source) {
    case DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_JUIN_2023:
      return handleVoeuxParcoursupMai2023(mailingList);

    default:
      break;
  }

  return;
};

const handleVoeuxParcoursupMai2023 = async (mailingList: IMailingList) => {
  const job = await findJob({
    "payload.document_id": mailingList.document_id,
  });

  if (!job) throw new Error("Job not found");

  const document = await findDocument({
    type_document: mailingList.source,
  });

  if (!document) throw new Error("Document not found");

  const batchSize = LIMIT_TRAINING_LINKS_PER_REQUEST;
  let skip = 0;
  let hasMore = true;
  let processed = 0;

  const outputDocument = await findDocument({
    _id: new ObjectId(mailingList.document_id),
  });

  if (!outputDocument) throw new Error("Output document not found");

  while (hasMore) {
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
        dc.content?.mail_responsable_1 ?? dc.content?.mail_responsable_2 ?? "",
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

    processed += wishes.length;

    await updateJob(job._id, {
      payload: {
        ...job.payload,
        processed: document.lines_count
          ? (processed / document.lines_count) * 100 //
          : 0,
        processed_count: processed,
      },
    });
    // Check if there are more documents to retrieve
    if (wishes.length === batchSize) {
      skip += batchSize;
    } else {
      hasMore = false;
      logger.info("All documents retrieved");
    }
  }
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

export const deleteMailingList = async (mailingList: IJob) => {
  if (mailingList.payload?.document_id) {
    await deleteDocumentById(
      new ObjectId(mailingList.payload.document_id as string)
    );
  }
  await getDbCollection("jobs").deleteOne({ _id: mailingList._id });
};

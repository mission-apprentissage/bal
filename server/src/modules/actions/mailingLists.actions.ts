import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

import { stringify } from "csv-stringify";
import { Filter, FindOptions, ObjectId } from "mongodb";
import { IDocument, IDocumentWithContent } from "shared/models/document.model";
import { IJob } from "shared/models/job.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
  TrainingLink,
  TrainingLinkData,
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

interface WishContent {
  cle_ministere_educatif?: string;
  code_mef?: string;
  code_postal?: string;
  code_uai_etab_accueil?: string;
  cfd?: string;
  rncp?: string;
  mail_responsable_1?: string;
  mail_responsable_2?: string;
  nom_eleve?: string;
  prenom_1?: string;
  prenom_2?: string;
  prenom_3?: string;
  libelle_etab_accueil?: string;
  libelle_formation?: string;
}

interface OutputWish {
  lien_prdv: string;
  lien_lba: string;
  libelle_etab_accueil: string;
  libelle_formation: string;
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

export const findMailingLists = async (
  filter: Filter<IJob>,
  options?: FindOptions<IJob>
) => {
  return findJobs(filter, options);
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

const EMAIL_REGEX =
  /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z]+(\.[-_0-9a-zA-Z]+)*|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/;

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
      .find<IDocumentWithContent<WishContent>>({
        document_id: document._id.toString(),
      })
      .limit(batchSize)
      .skip(skip)
      .toArray();

    if (!wishes.length) {
      hasMore = false;
      continue;
    }

    const data: TrainingLinkData[] = wishes.map((w) => ({
      id: w._id.toString(),
      cle_ministere_educatif: w.content?.cle_ministere_educatif ?? "",
      mef: w.content?.code_mef ?? "",
      code_postal: w.content?.code_postal ?? "",
      uai: w.content?.code_uai_etab_accueil ?? "",
      cfd: w.content?.cfd ?? "", // pas présent dans le fichier
      rncp: w.content?.rncp ?? "", // pas présent dans le fichier
    }));

    const trainingLinks = (await getTrainingLinks(data)) as TrainingLink[];

    const toDuplicate: (TrainingLink & WishContent & { email?: string })[] = [];
    const trainingLinksWithWishes = trainingLinks
      .map((tl) => {
        const wish = wishes.find((w) => w._id.toString() === tl.id);
        const {
          mail_responsable_1,
          mail_responsable_2,
          nom_eleve,
          prenom_1,
          prenom_2,
          prenom_3,
          libelle_etab_accueil,
          libelle_formation,
        } = wish?.content ?? {};

        // filtrer les emails invalides
        const emails = [
          ...new Set([mail_responsable_1, mail_responsable_2]),
        ].filter((e) => EMAIL_REGEX.test(e ?? ""));

        const wishData = {
          ...tl,
          email: emails?.[0] ?? "",
          nom_eleve: nom_eleve ?? "",
          prenom_eleve: [prenom_1 ?? "", prenom_2 ?? "", prenom_3 ?? ""]
            .join(" ")
            .trim(),
          libelle_etab_accueil: libelle_etab_accueil ?? "",
          libelle_formation: libelle_formation ?? "",
        };

        // si plusieurs emails différents, on duplique la ligne
        if (emails.length === 2) {
          toDuplicate.push({ ...wishData, email: emails[1] ?? "" });
        }

        return wishData;
      })
      .flat();

    await importDocumentContent(
      outputDocument,
      [...trainingLinksWithWishes, ...toDuplicate],
      (line) => line
    );

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
      logger.info("All documents retrieved");
    }
  }
};

async function* getLine(cursor) {
  let currentLine = {
    email: null,
    nom_eleve: null,
    prenom_eleve: null,
    wishes: [] as OutputWish[],
  };
  for await (const {
    content: { email, nom_eleve, prenom_eleve, ...rest },
  } of cursor) {
    if (
      (currentLine.email !== null && email !== currentLine.email) ||
      nom_eleve !== currentLine.nom_eleve ||
      prenom_eleve !== currentLine.prenom_eleve
    ) {
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

export const createMailingListFile = async (document: IDocument) => {
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
      sort: {
        "content.email": 1,
        "content.nom_eleve": 1,
        "content.prenom_eleve": 1,
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

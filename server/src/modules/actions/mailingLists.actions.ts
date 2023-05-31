import { IDocumentContent } from "shared/models/documentContent.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import { getDbCollection } from "../../utils/mongodb";
import {
  getTrainingLinks,
  LIMIT_TRAINING_LINKS_PER_REQUEST,
} from "../apis/lba";
import { findDocument } from "./documents.actions";

export const createMailingList = (source: DOCUMENT_TYPES) => {
  // TODO : create file

  switch (source) {
    case DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023:
      return handleVoeuxParcoursupMai2023();

    default:
      break;
  }
};

const handleVoeuxParcoursupMai2023 = async () => {
  const document = await findDocument({
    type_document: DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023,
  });

  if (!document) throw new Error("Document not found");

  const cursor = getDbCollection(
    "documentContents"
  ).aggregate<IDocumentContent>([
    {
      $match: {
        document_id: document._id.toString(),
      },
    },
  ]);

  cursor.batchSize(LIMIT_TRAINING_LINKS_PER_REQUEST);

  while (await cursor.hasNext()) {
    const documentContents = await cursor.toArray();

    if (!documentContents?.length) continue;

    const data = documentContents?.map((dc) => ({
      id: dc._id,
      mef: dc.content?.mef as string,
      cfd: dc.content?.cfd as string,
      code_postal: dc.content?.code_postal as string,
      uai: dc.content?.uai as string,
      rncp: dc.content?.rncp as string,
      cle_ministere_educatif: dc.content?.cle_ministere_educatif as string,
    }));

    const trainingLinks = await getTrainingLinks(data);

    // TODO: append to file

    return trainingLinks;
  }

  // TODO: return file
};

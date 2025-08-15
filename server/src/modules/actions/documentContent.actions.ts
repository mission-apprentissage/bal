import type { Filter } from "mongodb";
import { ObjectId } from "mongodb";
import type { IDocumentContent } from "shared/models/documentContent.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type TCreateDocumentContent = Omit<IDocumentContent, "_id" | "updated_at" | "created_at">;

export const createDocumentContent = async (data: TCreateDocumentContent) => {
  const now = new Date();
  const documentContent: IDocumentContent = {
    _id: new ObjectId(),
    ...data,
    updated_at: now,
    created_at: now,
  };

  const { insertedId: _id } = await getDbCollection("documentContents").insertOne(documentContent);

  return documentContent;
};

export const deleteDocumentContent = async (filter: Filter<IDocumentContent>) => {
  await getDbCollection("documentContents").deleteMany(filter);
};

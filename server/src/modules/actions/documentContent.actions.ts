import { Filter, FindOptions, ObjectId } from "mongodb";
import { IDocumentContent } from "shared/models/documentContent.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type TCreateDocumentContent = Omit<IDocumentContent, "_id" | "updated_at" | "created_at">;

export const createDocumentContent = async (data: TCreateDocumentContent) => {
  const now = new Date();
  const { insertedId: _id } = await getDbCollection("documentContents").insertOne({
    ...data,
    updated_at: now,
    created_at: now,
  });

  const documentContent = await findOneDocumentContent({ _id });

  return documentContent;
};

export const findOneDocumentContent = async (filter: Filter<IDocumentContent>, options?: FindOptions) => {
  return await getDbCollection("documentContents").findOne<IDocumentContent>(filter, options);
};

export const findDocumentContents = async (
  filter: Filter<IDocumentContent>,
  options?: FindOptions
): Promise<IDocumentContent[]> => {
  return await getDbCollection("documentContents").find(filter, options).toArray();
};

export const deleteDocumentContent = async (filter: Filter<IDocumentContent>) => {
  await getDbCollection("documentContents").deleteMany(filter);
};

export const updateDocumentContent = async (_id: ObjectId, data: Partial<IDocumentContent>) => {
  return getDbCollection("documentContents").updateOne({ _id }, { $set: { ...data, updated_at: new Date() } });
};

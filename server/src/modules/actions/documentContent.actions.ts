import { Filter, FindOptions } from "mongodb";
import { IDocumentContent } from "shared/models/documentContent.model";

import { getDbCollection } from "@/utils/mongodbUtils";

type TCreateDocumentContent = Omit<IDocumentContent, "id">;

export const createDocumentContent = async (data: TCreateDocumentContent) => {
  const { insertedId: _id } = await getDbCollection(
    "documentContents"
  ).insertOne(data);

  const documentContent = await findDocumentContent({ _id });

  return documentContent;
};

export const findDocumentContent = async (
  filter: Filter<IDocumentContent>,
  options?: FindOptions
) => {
  return await getDbCollection("documentContents").findOne<IDocumentContent>(
    filter,
    options
  );
};

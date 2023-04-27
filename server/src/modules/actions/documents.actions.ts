import {
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  ObjectId,
  UpdateFilter,
} from "mongodb";
import { IDocument } from "shared/models/document.model";

import { getDbCollection } from "../../utils/mongodb";

interface ICreateDocument extends Omit<IDocument, "_id"> {
  _id: ObjectId;
}

export const createDocument = async (data: ICreateDocument) => {
  const { insertedId: _id } = await getDbCollection("documents").insertOne(
    data
  );

  return findDocument({ _id });
};

export const findDocument = async (
  filter: Filter<IDocument>,
  options?: FindOptions<IDocument>
) => {
  return await getDbCollection("documents").findOne<IDocument>(filter, options);
};

export const updateDocument = async (
  filter: Filter<IDocument>,
  update: UpdateFilter<IDocument>,
  options?: FindOneAndUpdateOptions
) => {
  const updated = await getDbCollection("documents").findOneAndUpdate(
    filter,
    update,
    {
      ...options,
      returnDocument: "after",
    }
  );
  return updated.value as IDocument | null;
};

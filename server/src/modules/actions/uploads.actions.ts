import { Filter, FindOptions, ObjectId } from "mongodb";
import { IUpload } from "shared/models/uploads.model";

import { getDbCollection } from "../../utils/mongodb";

interface ICreateDocument extends Omit<IUpload, "_id"> {
  _id: ObjectId;
}

export const createDocument = async (data: ICreateDocument) => {
  const { insertedId: _id } = await getDbCollection("uploads").insertOne(data);

  return findDocument({ _id });
};

export const findDocument = async (
  filter: Filter<IUpload>,
  options?: FindOptions<IUpload>
) => {
  return await getDbCollection("uploads").findOne<IUpload>(filter, options);
};

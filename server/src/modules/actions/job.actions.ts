import { getDbCollection } from "@/common/utils/mongodbUtils";

/**
 * Création d'un job
 * @param {*} data
 * @returns
 */
export const createJob = async ({
  name,
  status,
  payload,
  started_at = new Date(),
}: any) => {
  const { insertedId } = await getDbCollection("jobs").insertOne({
    name,
    status,
    ...(payload ? { payload } : {}),
    started_at,
    updated_at: new Date(),
    created_at: new Date(),
  });
  return insertedId;
};

/**
 * Mise à jour d'un job
 * @param {*} _id
 * @param {Object} data
 * @returns
 */
export const updateJob = async (_id, data) => {
  return getDbCollection("jobs").updateOne(
    { _id },
    { $set: { ...data, updated_at: new Date() } }
  );
};

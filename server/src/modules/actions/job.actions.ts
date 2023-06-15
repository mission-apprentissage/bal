import { JOB_STATUS_LIST } from "shared/models/job.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

/**
 * Création d'un job
 * @param {*} data
 * @returns
 */
export const createJob = async ({
  name,
  payload,
  scheduled_at = new Date(),
}: any) => {
  const { insertedId } = await getDbCollection("jobs").insertOne({
    name,
    status: JOB_STATUS_LIST.PENDING,
    ...(payload ? { payload } : {}),
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_at,
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

import { Filter, FindOptions } from "mongodb";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

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
  sync = false,
}: any) => {
  const { insertedId: _id } = await getDbCollection("jobs").insertOne({
    name,
    status: sync ? JOB_STATUS_LIST.WILLSTART : JOB_STATUS_LIST.PENDING,
    ...(payload ? { payload } : {}),
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_at,
    sync,
  });
  return findJob({ _id });
};

export const findJob = async (
  filter: Filter<IJob>,
  options?: FindOptions<IJob>
) => {
  return await getDbCollection("jobs").findOne<IJob>(filter, options);
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

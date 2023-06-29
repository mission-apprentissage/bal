import { Filter, FindOptions, ObjectId } from "mongodb";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

/**
 * Création d'un job
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

export const findJobs = async (filter: Filter<IJob>) => {
  return await getDbCollection("jobs").find<IJob>(filter).toArray();
};

/**
 * Mise à jour d'un job
 */
export const updateJob = async (_id: ObjectId, data: Partial<IJob>) => {
  return getDbCollection("jobs").updateOne(
    { _id },
    { $set: { ...data, updated_at: new Date() } }
  );
};

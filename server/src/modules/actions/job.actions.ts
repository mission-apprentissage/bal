import { Filter, FindOptions, MatchKeysAndValues, ObjectId } from "mongodb";
import { IJobDocument, JOB_STATUS_LIST } from "shared/models/job.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type CreateJobParam = Pick<
  IJobDocument,
  "name" | "payload" | "scheduled_at" | "sync"
>;

/**
 * Création d'un job
 */
export const createJob = async ({
  name,
  payload,
  scheduled_at = new Date(),
  sync = false,
}: CreateJobParam): Promise<IJobDocument> => {
  const job = {
    name,
    status: sync ? JOB_STATUS_LIST.WILLSTART : JOB_STATUS_LIST.PENDING,
    ...(payload ? { payload } : {}),
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_at,
    sync,
  };
  const { insertedId: _id } = await getDbCollection("jobs").insertOne(job);
  return { ...job, _id };
};

export const findJob = async (
  filter: Filter<IJobDocument>,
  options?: FindOptions<IJobDocument>
): Promise<IJobDocument | null> => {
  return await getDbCollection("jobs").findOne(filter, options);
};

export const findJobs = async (
  filter: Filter<IJobDocument>,
  options?: FindOptions<IJobDocument>
) => {
  return await getDbCollection("jobs")
    .find<IJobDocument>(filter, options)
    .toArray();
};

/**
 * Mise à jour d'un job
 */
export const updateJob = async (
  _id: ObjectId,
  data: MatchKeysAndValues<IJobDocument>
) => {
  return getDbCollection("jobs").updateOne(
    { _id },
    { $set: { ...data, updated_at: new Date() } }
  );
};

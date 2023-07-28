import {
  Filter,
  FindOptions,
  MatchKeysAndValues,
  ObjectId,
  WithoutId,
} from "mongodb";
import { IJob } from "shared/models/job.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type CreateJobParam = Pick<IJob, "name" | "payload" | "scheduled_at" | "sync">;

/**
 * Création d'un job
 */
export const createJob = async ({
  name,
  payload,
  scheduled_at = new Date(),
  sync = false,
}: CreateJobParam): Promise<IJob> => {
  const job: WithoutId<IJob> = {
    name,
    status: sync ? "will_start" : "pending",
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
  filter: Filter<IJob>,
  options?: FindOptions<IJob>
): Promise<IJob | null> => {
  return await getDbCollection("jobs").findOne(filter, options);
};

export const findJobs = async (
  filter: Filter<IJob>,
  options?: FindOptions<IJob>
): Promise<IJob[]> => {
  return await getDbCollection("jobs").find<IJob>(filter, options).toArray();
};

/**
 * Mise à jour d'un job
 */
export const updateJob = async (
  _id: ObjectId,
  data: MatchKeysAndValues<IJob>
) => {
  return getDbCollection("jobs").updateOne(
    { _id },
    { $set: { ...data, updated_at: new Date() } }
  );
};

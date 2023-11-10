import { Filter, FindOptions, MatchKeysAndValues, ObjectId } from "mongodb";
import { IJob, IJobsCron, IJobsCronTask, IJobsSimple } from "shared/models/job.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type CreateJobSimpleParams = Pick<IJobsSimple, "name" | "payload" | "scheduled_for" | "sync">;

export const createJobSimple = async ({
  name,
  payload,
  scheduled_for = new Date(),
  sync = false,
}: CreateJobSimpleParams): Promise<IJobsSimple> => {
  const job: IJobsSimple = {
    _id: new ObjectId(),
    name,
    type: "simple",
    status: sync ? "will_start" : "pending",
    payload,
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_for,
    sync,
  };
  await getDbCollection("jobs").insertOne(job);
  return job;
};

type CreateJobCronParams = Pick<IJobsCron, "name" | "cron_string" | "scheduled_for">;

export const createJobCron = async ({
  name,
  cron_string,
  scheduled_for = new Date(),
}: CreateJobCronParams): Promise<IJobsCron> => {
  const job: IJobsCron = {
    _id: new ObjectId(),
    name,
    type: "cron",
    status: "active",
    cron_string,
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_for,
  };
  await getDbCollection("jobs").insertOne(job);
  return job;
};

export const updateJobCron = async (id: ObjectId, cron_string: IJobsCron["cron_string"]): Promise<void> => {
  const data: Partial<IJobsCron> = {
    status: "active",
    cron_string,
    updated_at: new Date(),
  };

  await getDbCollection("jobs").findOneAndUpdate(id, data);
};

type CreateJobCronTaskParams = Pick<IJobsCron, "name" | "scheduled_for">;

export const createJobCronTask = async ({ name, scheduled_for }: CreateJobCronTaskParams): Promise<IJobsCronTask> => {
  const job: IJobsCronTask = {
    _id: new ObjectId(),
    name,
    type: "cron_task",
    status: "pending",
    updated_at: new Date(),
    created_at: new Date(),
    scheduled_for,
  };
  await getDbCollection("jobs").insertOne(job);
  return job;
};

export const findJobCron = async (filter: Filter<IJobsCron>, options?: FindOptions): Promise<IJobsCron | null> => {
  const f: Filter<IJobsCron> = { type: "cron", ...filter };
  // @ts-expect-error
  return await getDbCollection("jobs").findOne(f, options);
};

export const findSimpleJob = async (
  filter: Filter<IJobsSimple>,
  options?: FindOptions
): Promise<IJobsSimple | null> => {
  const f: Filter<IJobsSimple> = { type: "simple", ...filter };
  // @ts-expect-error
  return await getDbCollection("jobs").findOne<IJobsSimple>(f, options);
};

export const findJobs = async <T extends IJob>(filter: Filter<T>, options?: FindOptions): Promise<T[]> => {
  // @ts-expect-error
  return await getDbCollection("jobs").find(filter, options).toArray();
};

/**
 * Mise à jour d'un job
 */
export const updateJob = async (_id: ObjectId, data: MatchKeysAndValues<IJob>) => {
  return getDbCollection("jobs").updateOne({ _id }, { $set: { ...data, updated_at: new Date() } });
};

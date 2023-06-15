import { formatDuration, intervalToDuration } from "date-fns";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { updateJob } from "@/modules/actions/job.actions";

/**
 * Wrapper pour l'exécution de jobs avec création de JobEvents en base
 * pour sauvegarder le résultat du job
 */
export const runJob = async (job: IJob, jobFunc: () => Promise<any>) => {
  logger.info(`Job: ${job.name} Started`);
  const startDate = new Date();
  await updateJob(job._id, {
    status: JOB_STATUS_LIST.RUNNING,
    started_at: startDate,
  });
  let error: Error | undefined = undefined;
  let result = undefined;

  try {
    result = await jobFunc();
  } catch (err: any) {
    logger.error(
      { err, writeErrors: err.writeErrors, error: err },
      "job error"
    );
    error = err?.toString();
    await updateJob(job._id, {
      status: JOB_STATUS_LIST.ERRORED,
      payload: { error: err?.toString() },
    });
  }

  const endDate = new Date();
  const duration = formatDuration(
    intervalToDuration({ start: startDate, end: endDate })
  );
  await updateJob(job._id, {
    status: error ? JOB_STATUS_LIST.ERRORED : JOB_STATUS_LIST.FINISHED,
    payload: { duration, result, error },
    ended_at: endDate,
  });
  logger.info(`Job: ${job.name} Ended`);

  if (error) {
    logger.error(
      error.constructor.name === "EnvVarError" ? error.message : error
    );
  }
};

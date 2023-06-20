import { formatDuration, intervalToDuration } from "date-fns";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { updateJob } from "@/modules/actions/job.actions";

import { closeMongodbConnection } from "../../common/utils/mongodbUtils";

/**
 * Wrapper pour l'exécution de jobs
 */
export const executeJob = async (
  job: IJob,
  jobFunc: () => Promise<any>,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
) => {
  if (options.runningLogs) logger.info(`Job: ${job.name} Started`);
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
    if (options.runningLogs)
      logger.error(
        { err, writeErrors: err.writeErrors, error: err },
        "job error"
      );
    error = err?.toString();
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
  if (options.runningLogs) logger.info(`Job: ${job.name} Ended`);

  if (error) {
    if (options.runningLogs)
      logger.error(
        error.constructor.name === "EnvVarError" ? error.message : error
      );
  }

  if (job.sync) {
    // Waiting logger to flush all logs (MongoDB)
    setTimeout(async () => {
      try {
        await closeMongodbConnection();
      } catch (err) {
        if (options.runningLogs)
          logger.error({ err }, "close mongodb connection error");
      }
      process.exit(error ? 1 : 0); // eslint-disable-line no-process-exit
    }, 500);
  }
};

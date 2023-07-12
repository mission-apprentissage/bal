import {
  captureException,
  getCurrentHub,
  runWithAsyncContext,
} from "@sentry/node";
import { formatDuration, intervalToDuration } from "date-fns";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { updateJob } from "@/modules/actions/job.actions";

import { closeSentry } from "../../common/services/sentry/sentry";
import { closeMongodbConnection } from "../../common/utils/mongodbUtils";

const runner = async (
  job: IJob,
  jobFunc: () => Promise<any>,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
): Promise<number> => {
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
    captureException(err);
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
    "payload.duration": duration,
    "payload.result": result,
    "payload.error": error,
    ended_at: endDate,
  });
  if (options.runningLogs) logger.info(`Job: ${job.name} Ended`);

  if (error) {
    if (options.runningLogs)
      logger.error(
        error.constructor.name === "EnvVarError" ? error.message : error
      );
  }

  return error ? 1 : 0;
};

export function executeJob(
  job: IJob,
  jobFunc: () => Promise<any>,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
) {
  return runWithAsyncContext(async () => {
    const hub = getCurrentHub();
    const transaction = hub.startTransaction({
      name: `JOB: ${job.name}`,
      op: "processor.job",
    });
    hub.configureScope((scope) => {
      scope.setSpan(transaction);
      scope.setTag("job", job.name);
      scope.setContext("job", job);
    });
    const start = Date.now();
    try {
      await runner(job, jobFunc, options);
    } finally {
      transaction.setMeasurement(
        "job.execute",
        Date.now() - start,
        "millisecond"
      );
      transaction.finish();
    }
  });
}

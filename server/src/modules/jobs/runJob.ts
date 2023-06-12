import { formatDuration, intervalToDuration } from "date-fns";
import { JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { createJob, updateJob } from "@/modules/actions/job.actions";

import { closeMongodbConnection } from "../../utils/mongodbUtils";

/**
 * Wrapper pour l'exécution de jobs avec création de JobEvents en base
 * pour sauvegarder le résultat du job
 */
export const runJob = (jobFunc: (...args: any[]) => Promise<any>) => {
  return async function actionFunc(args: any, options: any) {
    const startDate = new Date();
    const jobId = await createJob({
      name: options._name,
      status: JOB_STATUS_LIST.STARTED,
      started_at: startDate,
    });
    let error: Error | undefined = undefined;
    let result = undefined;

    try {
      result = await jobFunc(args);
    } catch (err: any) {
      logger.error(
        { err, writeErrors: err.writeErrors, error: err },
        "job error"
      );
      error = err?.toString();
      await updateJob(jobId, {
        status: JOB_STATUS_LIST.ERRORED,
        payload: { error: err?.toString() },
      });
    }

    const endDate = new Date();
    const duration = formatDuration(
      intervalToDuration({ start: startDate, end: endDate })
    );
    await updateJob(jobId, {
      status: error ? JOB_STATUS_LIST.ERRORED : JOB_STATUS_LIST.FINISHED,
      payload: { duration, result, error },
      ended_at: endDate,
    });

    if (error) {
      logger.error(
        error.constructor.name === "EnvVarError" ? error.message : error
      );
    }

    //Waiting logger to flush all logs (MongoDB)
    setTimeout(async () => {
      try {
        await closeMongodbConnection();
      } catch (err) {
        logger.error({ err }, "close mongodb connection error");
      }
      process.exit(error ? 1 : 0); // eslint-disable-line no-process-exit
    }, 500);
  };
};

import cronParser from "cron-parser";
import { IJobsCron } from "shared/models/job.model";

import logger from "@/common/logger";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import config from "../../config";
import {
  createJobCron,
  createJobCronTask,
  createJobSimple,
  findJobCron,
  findJobs,
  updateJob,
  updateJobCron,
} from "../actions/job.actions";
import { CRONS } from "./jobs";
import { addJob } from "./jobs_actions";

function parseCronString(cronString: string, options: { currentDate: string } | object = {}) {
  return cronParser.parseExpression(cronString, {
    tz: "Europe/Paris",
    ...options,
  });
}

export async function cronsInit() {
  if (config.env === "preview") {
    return;
  }

  logger.info(`Crons - initialise crons in DB`);

  let schedulerRequired = false;

  await getDbCollection("jobs").deleteMany({
    name: { $nin: CRONS.map((c) => c.name) },
    type: "cron",
  });
  await getDbCollection("jobs").deleteMany({
    name: { $nin: CRONS.map((c) => c.name) },
    status: { $in: ["pending", "will_start"] },
    type: "cron_task",
  });

  for (const cron of CRONS) {
    const cronJob = await findJobCron({
      name: cron.name,
    });

    if (!cronJob) {
      await createJobCron({
        name: cron.name,
        cron_string: cron.cron_string,
        scheduled_for: new Date(),
      });
      schedulerRequired = true;
    } else if (cronJob.type === "cron" && cronJob.cron_string !== cron.cron_string) {
      await updateJobCron(cronJob._id, cron.cron_string);
      await getDbCollection("jobs").deleteMany({
        name: cronJob.name,
        status: { $in: ["pending", "will_start"] },
        type: "cron_task",
      });
      schedulerRequired = true;
    }
  }

  if (schedulerRequired) {
    await addJob({ name: "crons:scheduler", queued: true, payload: {} });
  }
}

export async function cronsScheduler(): Promise<void> {
  logger.info(`Crons - Check and run crons`);

  const crons = await findJobs<IJobsCron>(
    {
      type: "cron",
      scheduled_for: { $lte: new Date() },
    },
    { sort: { scheduled_for: 1 } }
  );

  for (const cron of crons) {
    const next = parseCronString(cron.cron_string ?? "", {
      currentDate: cron.scheduled_for,
    }).next();
    await createJobCronTask({
      name: cron.name,
      scheduled_for: next.toDate(),
    });

    await updateJob(cron._id, {
      scheduled_for: next.toDate(),
    });
  }
  const cron = await findJobCron({}, { sort: { scheduled_for: 1 } });

  if (!cron) return;

  cron.scheduled_for.setSeconds(cron.scheduled_for.getSeconds() + 1); // add DELTA of 1 sec
  await createJobSimple({
    name: "crons:scheduler",
    scheduled_for: cron.scheduled_for,
    sync: false,
    payload: {},
  });
}

import cronParser, { CronDate } from "cron-parser";

import logger from "@/common/logger";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import {
  createJob,
  findJob,
  findJobs,
  updateJob,
} from "../actions/job.actions";
import { CRONS } from "./jobs";

function parseCronString(
  cronString: string,
  options: { currentDate: string } | object = {}
) {
  return cronParser.parseExpression(cronString, {
    tz: "Europe/Paris",
    ...options,
  });
}

export async function cronsInit() {
  logger.info(`Crons - initialise crons in DB`);
  await getDbCollection("jobs").deleteMany({ type: "cron" });

  for (const cron of Object.values(CRONS)) {
    const next = parseCronString(cron.cron_string).next();
    await createJob({
      name: cron.name,
      type: "cron",
      cron_string: cron.cron_string,
      scheduled_for: next.toDate(),
    });
  }

  const orpghanOldJobs = await findJobs({
    type: "simple",
    status: "pending",
    name: { $regex: /^cron_/ },
  });
  await getDbCollection("jobs").deleteMany({
    _id: { $in: orpghanOldJobs.map(({ _id }) => _id) },
  });
}

export async function cronsScheduler(): Promise<void> {
  logger.info(`Crons - Check and run crons`);

  const crons = await findJobs(
    {
      type: "cron",
      //scheduled_for: { $lte: new Date() },
    },
    { sort: { scheduled_for: 1 } }
  );
  let cronsSchedulerNextRun = null as CronDate | null;
  for (const cron of crons) {
    const interval = parseCronString(cron.cron_string ?? "", {
      currentDate: cron.scheduled_for,
    });
    const next = interval.next();
    interval.prev();
    const previous = interval.prev();

    if (
      await findJob({
        type: "simple",
        name: `cron_${cron.name}`,
        status: "pending",
        scheduled_for: previous.toDate(),
      })
    ) {
      continue;
    }

    await createJob({
      type: "simple",
      name: `cron_${cron.name}`,
      scheduled_for: cron.scheduled_for,
    });

    await updateJob(cron._id, {
      scheduled_for: next.toDate(),
    });

    if (
      !cronsSchedulerNextRun ||
      next.getTime() < cronsSchedulerNextRun.getTime()
    ) {
      cronsSchedulerNextRun = next;
    }
  }
  cronsSchedulerNextRun = cronsSchedulerNextRun as CronDate;
  cronsSchedulerNextRun.addSecond(); // add DELTA of 1 sec
  await createJob({
    type: "simple",
    name: "crons:scheduler",
    scheduled_for: cronsSchedulerNextRun.toDate(),
  });
}

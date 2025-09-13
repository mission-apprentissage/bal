import { scheduleJob } from "job-processor";
import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async () => {
  // Clear legacy data
  await getDbCollection("persons").deleteMany({});
  await getDbCollection("organisations").deleteMany({});

  await scheduleJob({
    name: "import:person:catalogue",
  });
  await scheduleJob({
    name: "import:person:deca",
  });
  await scheduleJob({
    name: "import:person:algo-lba",
  });
};

export const requireShutdown: boolean = true;

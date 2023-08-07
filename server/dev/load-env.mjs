import fs from "node:fs";

import { config } from "dotenv";

config();

if (fs.existsSync(".env.local")) {
  config({ override: true, path: ".env.local" });
}

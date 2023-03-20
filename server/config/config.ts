import "dotenv/config";

import env from "env-var";

export const config = {
  appName: env.get("MNA_BAL_APP_NAME").default("BAL").asString(),
  env: env.get("MNA_BAL_ENV").required().asString(),
  publicUrl: env.get("MNA_BAL_PUBLIC_URL").required().asString(),
  mongodb: {
    uri: env.get("MNA_BAL_MONGODB_URI").required().asString(),
  },
  log: {
    type: env.get("MNA_BAL_LOG_TYPE").default("console").asString(),
    level: env.get("MNA_BAL_LOG_LEVEL").default("info").asString(),
  },
};

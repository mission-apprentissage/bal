import "dotenv/config";

import env from "env-var";

export const config = {
  appName: env.get("APP_NAME").default("BAL").asString(),
  env: env.get("MNA_BAL_ENV").required().asString(),
  publicUrl: env.get("MNA_BAL_PUBLIC_URL").required().asString(),
  mongodb: {
    uri: env.get("MNA_BAL_MONGODB_URI").required().asString(),
  },
  log: {
    type: env.get("MNA_BAL_LOG_TYPE").default("console").asString(),
    level: env.get("MNA_BAL_LOG_LEVEL").default("info").asString(),
  },
  session: {
    secret: env.get("MNA_BAL_SESSION_SECRET").required().asString(),
    salt: env.get("MNA_BAL_SESSION_SALT").required().asString(),
  },
  auth: {
    user: {
      jwtSecret: env.get("MNA_BAL_AUTH_USER_JWT_SECRET").required().asString(),
      expiresIn: "7d",
    },
    activation: {
      jwtSecret: env.get("MNA_BAL_AUTH_ACTIVATION_JWT_SECRET").required().asString(),
      expiresIn: "96h",
    },
    resetPasswordToken: {
      jwtSecret: env.get("MNA_BAL_AUTH_PASSWORD_JWT_SECRET").required().asString(),
      expiresIn: "1h",
    },
    hashRounds: env.get("MNA_BAL_AUTH_HASH_ROUNDS").default(10).asIntPositive(),
  },
};

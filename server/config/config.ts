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
    cookieName: env
      .get("MNA_BAL_SESSION_COOKIE_NAME")
      .default("bal_session")
      .asString(),
    cookie: {
      maxAge: env
        .get("MNA_BAL_SESSION_COOKIE_MAX_AGE")
        .default(30 * 24 * 3600000)
        .asInt(),
      httpOnly: env
        .get("MNA_BAL_SESSION_COOKIE_HTTP_ONLY")
        .default("true")
        .asBool(),
      sameSite: "lax" as const,
      secure: env.get("MNA_BAL_SESSION_COOKIE_SECURE").default("true").asBool(),
    },
  },
  auth: {
    user: {
      jwtSecret: env.get("MNA_BAL_AUTH_USER_JWT_SECRET").required().asString(),
      expiresIn: "7d",
    },
    activation: {
      jwtSecret: env
        .get("MNA_BAL_AUTH_ACTIVATION_JWT_SECRET")
        .required()
        .asString(),
      expiresIn: "96h",
    },
    resetPasswordToken: {
      jwtSecret: env
        .get("MNA_BAL_AUTH_PASSWORD_JWT_SECRET")
        .required()
        .asString(),
      expiresIn: "1h",
    },
    hashRounds: env
      .get("MNA_BAL_AUTH_HASH_ROUNDS")
      .default(1000)
      .asIntPositive(),
  },
  smtp: {
    host: env.get("MNA_BAL_SMTP_HOST").asString(),
    port: env.get("MNA_BAL_SMTP_PORT").asString(),
    secure: env.get("MNA_BAL_SMTP_SECURE").asBool(),
    auth: {
      user: env.get("MNA_BAL_SMTP_AUTH_USER").asString(),
      pass: env.get("MNA_BAL_SMTP_AUTH_PASS").asString(),
    },
  },
};

import "dotenv/config";

import env from "env-var";

export const config = {
  appName: env.get("APP_NAME").default("BAL").asString(),
  env: env.get("MNA_BAL_ENV").required().asString(),
  publicUrl: env.get("MNA_BAL_PUBLIC_URL").required().asString(),
  email: env
    .get("MNA_BAL_EMAIL")
    .default("contact@apprentissage.beta.gouv.fr")
    .asString(),
  email_from: env
    .get("MNA_BAL_EMAIL_FROM")
    .default("Boîte aux lettres")
    .asString(),
  mongodb: {
    uri: env.get("MNA_BAL_MONGODB_URI").required().asString(),
  },
  processorUrl: env
    .get("MNA_BAL_PROCESSOR_URL")
    .default("http://processor:6000")
    .asString(),
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
      path: "/",
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
    webhookKey: env.get("MNA_BAL_SMTP_WEBHOOK_KEY").default("").asString(),
    auth: {
      user: env.get("MNA_BAL_SMTP_AUTH_USER").asString(),
      pass: env.get("MNA_BAL_SMTP_AUTH_PASS").asString(),
    },
  },
  akto: {
    grantType: env.get("MNA_BAL_AKTO_GRANT_TYPE").default("").asString(),
    clientId: env.get("MNA_BAL_AKTO_CLIENT_ID").default("").asString(),
    clientSecret: env.get("MNA_BAL_AKTO_CLIENT_SECRET").default("").asString(),
    scope: env.get("MNA_BAL_AKTO_SCOPE").default("").asString(),
  },
  opcoEp: {
    grantType: env.get("MNA_BAL_OPCO_EP_GRANT_TYPE").default("").asString(),
    baseAuthUrl: env
      .get("MNA_BAL_OPCO_EP_AUTH_URL_BASE")
      .default("")
      .asString(),
    baseUrl: env.get("MNA_BAL_OPCO_EP_URL_BASE").default("").asString(),
    clientId: env.get("MNA_BAL_OPCO_EP_CLIENT_ID").default("").asString(),
    clientSecret: env
      .get("MNA_BAL_OPCO_EP_CLIENT_SECRET")
      .default("")
      .asString(),
    scope: env.get("MNA_BAL_OPCO_EP_SCOPE").default("").asString(),
  },
  clamav: {
    uri: env.get("MNA_BAL_CLAMAV_URI").default("clamav:3310").asString(),
  },
  ovhStorage: {
    username: env.get("MNA_BAL_OVH_STORAGE_USERNAME").required().asString(),
    password: env.get("MNA_BAL_OVH_STORAGE_PASSWORD").required().asString(),
    authURL: "https://auth.cloud.ovh.net/v3/auth",
    tenantId: env.get("MNA_BAL_OVH_STORAGE_TENANT_ID").required().asString(),
    region: "GRA",
    containerName: env
      .get("MNA_BAL_OVH_STORAGE_CONTAINER_NAME")
      .required()
      .asString(),
    encryptionKey: env
      .get("MNA_BAL_OVH_STORAGE_ENCRYPTION_KEY")
      .required()
      .asString(),
    uri: env.get("MNA_BAL_OVH_STORAGE_URI").required().asString(),
  },
  tests: {
    testUserName: env.get("MNA_BAL_TEST_USER_NAME").default("").asString(),
    testUserPwd: env.get("MNA_BAL_TEST_USER_PWD").default("").asString(),
    testAdminName: env.get("MNA_BAL_TEST_ADMIN_NAME").default("").asString(),
    testAdminPwd: env.get("MNA_BAL_TEST_ADMIN_PWD").default("").asString(),
  },
};

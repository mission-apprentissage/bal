import env from "env-var";

const config = {
  appName: env.get("APP_NAME").default("bal").asString(),
  port: env.get("MNA_BAL_SERVER_PORT").default(5000).asPortNumber(),
  version: env.get("PUBLIC_VERSION").default("0.0.0-local").asString(),
  env: env.get("MNA_BAL_ENV").required().asEnum(["local", "recette", "production", "preview", "test"]),
  publicUrl: env.get("MNA_BAL_PUBLIC_URL").required().asString(),
  email: env.get("MNA_BAL_EMAIL").default("contact@apprentissage.beta.gouv.fr").asString(),
  email_from: env.get("MNA_BAL_EMAIL_FROM").default("Boîte aux lettres").asString(),
  mongodb: {
    uri: env.get("MNA_BAL_MONGODB_URI").required().asString(),
  },
  log: {
    type: env.get("MNA_BAL_LOG_TYPE").default("console").asString(),
    level: env.get("MNA_BAL_LOG_LEVEL").default("info").asString(),
  },
  session: {
    secret: env.get("MNA_BAL_SESSION_SECRET").required().asString(),
    cookieName: env.get("MNA_BAL_SESSION_COOKIE_NAME").default("bal_session").asString(),
    cookie: {
      maxAge: env
        .get("MNA_BAL_SESSION_COOKIE_MAX_AGE")
        .default(30 * 24 * 3600000)
        .asInt(),
      httpOnly: env.get("MNA_BAL_SESSION_COOKIE_HTTP_ONLY").default("true").asBool(),
      sameSite: "lax" as const,
      path: "/",
      secure: env.get("MNA_BAL_SESSION_COOKIE_SECURE").default("true").asBool(),
    },
  },
  auth: {
    user: {
      jwtSecret: env.get("MNA_BAL_AUTH_USER_JWT_SECRET").required().asString(),
      expiresIn: "7d" as const,
    },
    activation: {
      jwtSecret: env.get("MNA_BAL_AUTH_ACTIVATION_JWT_SECRET").required().asString(),
      expiresIn: "96h" as const,
    },
    resetPasswordToken: {
      jwtSecret: env.get("MNA_BAL_AUTH_PASSWORD_JWT_SECRET").required().asString(),
      expiresIn: "1h" as const,
    },
    hashRounds: env.get("MNA_BAL_AUTH_HASH_ROUNDS").default(1000).asIntPositive(),
  },
  smtp: {
    host: env.get("MNA_BAL_SMTP_HOST").required().asString(),
    port: env.get("MNA_BAL_SMTP_PORT").asString(),
    secure: env.get("MNA_BAL_SMTP_SECURE").asBool(),
    webhookKey: env.get("MNA_BAL_SMTP_WEBHOOK_KEY").default("").asString(),
    auth: {
      user: env.get("MNA_BAL_SMTP_AUTH_USER").asString(),
      pass: env.get("MNA_BAL_SMTP_AUTH_PASS").asString(),
    },
  },
  lba: {
    baseURL: env
      .get("MNA_BAL_LBA_BASE_URL")
      .default("https://labonnealternance-recette.apprentissage.beta.gouv.fr")
      .asString(),
    mongodb: {
      uri: env.get("LBA_MONGODB_URI").required().asString(),
      blacklistedDbCollection: env.get("LBA_EMAIL_BLACKLISTED_COLLECTION_NAME").required().asString(),
    },
    algoRecuteurs: {
      s3File: env.get("LBA_ALGO_RECRUTEURS_LBA_S3FILE").required().asString(),
    },
  },
  tdb: {
    baseURL: env.get("MNA_BAL_TDB_BASE_URL").required().asString(),
    apiKey: env.get("MNA_BAL_TDB_API_KEY").required().asString(),
  },
  ftp: {
    host: env.get("FTP_HOST").required().asString(),
    constructys: {
      user: env.get("FTP_CONSTRUCTYS_USER").required().asString(),
      password: env.get("FTP_CONSTRUCTYS_PASSWORD").required().asString(),
    },
    ocapiat: {
      user: env.get("FTP_OCAPIAT_USER").required().asString(),
      password: env.get("FTP_OCAPIAT_PASSWORD").required().asString(),
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
    baseAuthUrl: env.get("MNA_BAL_OPCO_EP_AUTH_URL_BASE").default("").asString(),
    baseUrl: env.get("MNA_BAL_OPCO_EP_URL_BASE").default("").asString(),
    clientId: env.get("MNA_BAL_OPCO_EP_CLIENT_ID").default("").asString(),
    clientSecret: env.get("MNA_BAL_OPCO_EP_CLIENT_SECRET").default("").asString(),
    scope: env.get("MNA_BAL_OPCO_EP_SCOPE").default("").asString(),
  },
  decaApi: {
    endpoint: env.get("MNA_BAL_API_DECA_URL").required().asString(),
    loginLba: env.get("MNA_BAL_API_DECA_LOGIN_LBA").required().asString(),
    passwordLba: env.get("MNA_BAL_API_DECA_PASSWORD_LBA").required().asString(),
    loginTdb: env.get("MNA_BAL_API_DECA_LOGIN_TDB").required().asString(),
    passwordTdb: env.get("MNA_BAL_API_DECA_PASSWORD_TDB").required().asString(),
  },
  clamav: {
    uri: env.get("MNA_BAL_CLAMAV_URI").default("localhost:3310").asString(),
  },
  ovhStorage: {
    username: env.get("MNA_BAL_OVH_STORAGE_USERNAME").required().asString(),
    password: env.get("MNA_BAL_OVH_STORAGE_PASSWORD").required().asString(),
    authURL: "https://auth.cloud.ovh.net/v3/auth",
    tenantId: env.get("MNA_BAL_OVH_STORAGE_TENANT_ID").required().asString(),
    region: "GRA",
    containerName: env.get("MNA_BAL_OVH_STORAGE_CONTAINER_NAME").required().asString(),
    encryptionKey: env.get("MNA_BAL_OVH_STORAGE_ENCRYPTION_KEY").required().asString(),
    uri: env.get("MNA_BAL_OVH_STORAGE_URI").required().asString(),
  },
  ovhStorageMna: {
    username: env.get("MNA_BAL_OVH_STORAGE_USERNAME_MNA").required().asString(),
    password: env.get("MNA_BAL_OVH_STORAGE_PASSWORD_MNA").required().asString(),
    authURL: "https://auth.cloud.ovh.net/v3/auth",
    tenantId: env.get("MNA_BAL_OVH_STORAGE_TENANT_ID_MNA").required().asString(),
    region: "GRA",
    containerName: env.get("MNA_BAL_OVH_STORAGE_CONTAINER_NAME_MNA").required().asString(),
    encryptionKey: env.get("MNA_BAL_OVH_STORAGE_ENCRYPTION_KEY_MNA").required().asString(),
    uri: env.get("MNA_BAL_OVH_STORAGE_URI_MNA").required().asString(),
  },
  disable_processors: env.get("MNA_BAL_DISABLE_PROCESSORS").default("false").asBool(),
  catalogue: {
    baseUrl: "https://catalogue-apprentissage.intercariforef.org",
  },
  s3: {
    accessKeyId: env.get("LBA_S3_ACCESSKEYID").required().asString(),
    secretAccessKey: env.get("LBA_S3_SECRETACCESSKEY").required().asString(),
    endpoint: env.get("LBA_S3_ENDPOINT").required().asString(),
    region: env.get("LBA_S3_REGION").required().asString(),
    bucket: {
      storage: env.get("LBA_S3_BUCKET").required().asString(),
      application: env.get("LBA_S3_APPLICATIONS_BUCKET").required().asString(),
    },
  },
  brevo: {
    apiKey: env.get("MNA_BAL_BREVO_API_KEY").required().asString(),
    webhookApiKey: env.get("MNA_BAL_BREVO_WEBHOOK_API_KEY").required().asString(),
  },
};

export default config;

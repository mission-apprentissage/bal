export interface PublicConfig {
  sentry: {
    dsn: string;
  };
  host: string;
  apiEndpoint: string;
  env: "local" | "preview" | "recette" | "production";
}

function getProductionPublicConfig(): PublicConfig {
  const host = "bal.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    env: "production",
    host,
    apiEndpoint: `${host}/api`,
  };
}

function getRecettePublicConfig(): PublicConfig {
  const host = "bal-recette.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    env: "recette",
    host,
    apiEndpoint: `https://${host}/api`,
  };
}

function getPreviewPublicConfig(): PublicConfig {
  const matches = getVersion().match(/^0\.0\.0-(\d+)$/);

  if (!matches) {
    throw new Error("getPreviewPublicConfig: invalid preview version");
  }

  const host = `${matches[1]}.bal-preview.apprentissage.beta.gouv.fr`;

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    env: "preview",
    host,
    apiEndpoint: `https://${host}/api`,
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    env: "local",
    host: "localhost",
    apiEndpoint: `http://${host}/api`,
  };
}

function getVersion(): string {
  const version = process.env.NEXT_PUBLIC_VERSION;

  if (!version) {
    throw new Error("missing NEXT_PUBLIC_VERSION env-vars");
  }

  return version;
}

function getEnv(): PublicConfig["env"] {
  const env = process.env.NEXT_PUBLIC_ENV;
  switch (env) {
    case "production":
    case "recette":
    case "preview":
    case "local":
      return env;
    default:
      throw new Error("invalid NEXT_PUBLIC_ENV env-vars");
  }
}

function getPublicConfig(): PublicConfig {
  switch (getEnv()) {
    case "production":
      return getProductionPublicConfig();
    case "recette":
      return getRecettePublicConfig();
    case "preview":
      return getPreviewPublicConfig();
    case "local":
      return getLocalPublicConfig();
  }
}

export const publicConfig: PublicConfig = getPublicConfig();

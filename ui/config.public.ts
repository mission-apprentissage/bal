export interface PublicConfig {
  sentry: {
    dsn: string;
  };
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" | "preview" | "recette" | "production";
  version: string;
}

function getProductionPublicConfig(): PublicConfig {
  const host = "bal.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
  };
}

function getRecettePublicConfig(): PublicConfig {
  const host = "bal-recette.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
  };
}

function getPreviewPublicConfig(): PublicConfig {
  const version = getVersion();
  const matches = version.match(/^0\.0\.0-(\d+)$/);

  if (!matches) {
    throw new Error(`getPreviewPublicConfig: invalid preview version ${version}`);
  }

  const host = `${matches[1]}.bal-preview.apprentissage.beta.gouv.fr`;

  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    host,
    baseUrl: `https://${host}`,
    env: "preview",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
    sentry: {
      dsn: "https://9517661db1de4c869b89a1a1a8678480@sentry.apprentissage.beta.gouv.fr/3",
    },
    host,
    baseUrl: `http://${host}:3000`,
    env: "local",
    apiEndpoint: `http://${host}:${process.env.NEXT_PUBLIC_API_PORT ?? 5000}/api`,
    version: getVersion(),
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
      throw new Error(`Invalid NEXT_PUBLIC_ENV env-vars ${env}`);
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

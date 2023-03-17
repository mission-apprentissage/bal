const defaultConfig = {
  client: "pg",
  connection: process.env.MNA_BAL_POSTGRES_URI,
  migrations: { directory: "dist/migrations" },
};

export default {
  development: defaultConfig,
  recette: defaultConfig,
  production: defaultConfig,
};

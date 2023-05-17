import { config, up } from "migrate-mongo";
import { MongoClient } from "mongodb";
import path from "path";

import { __dirname } from "../../../utils/esmUtils";

const myConfig = {
  mongodb: {
    url: process.env.MNA_BAL_MONGODB_URI as string,

    // in URL
    databaseName: "",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: path.join(__dirname(import.meta.url), "../../db/migrations"),

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "migrations",

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: "esm",
};

// @ts-ignore
config.set(myConfig);

export async function migrations(client: MongoClient) {
  // then, use the API as you normally would, eg:
  // @ts-ignore
  await up(client.db(), client);
}

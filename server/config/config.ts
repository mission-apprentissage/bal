import "dotenv/config";

import env from "env-var";
export const config = {
  MNA_BAL_POSTGRES_URI: env
    .get("MNA_BAL_POSTGRES_URI")
    .default("local")
    .asString(),
  MNA_BAL_INSERJEUNES_USERNAME: env
    .get("MNA_BAL_INSERJEUNES_USERNAME")
    .required()
    .asString(),
  MNA_BAL_INSERJEUNES_PASSWORD: env
    .get("MNA_BAL_INSERJEUNES_PASSWORD")
    .required()
    .asString(),
};

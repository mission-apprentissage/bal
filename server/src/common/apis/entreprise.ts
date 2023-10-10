import config from "../../config";
import logger from "../logger";
import { ApiError, apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://doc.entreprise.api.gouv.fr/#param-tres-obligatoires
const executeWithRateLimiting = apiRateLimiter("apiEntreprise", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://entreprise.api.gouv.fr/v2",
    timeout: 5000,
  }),
});

const apiParams = {
  token: config.apiEntreprise,
  context: "CERFA MNA",
  recipient: "13002526500013", // Siret Dinum
  object: "Construction d'un générateur de CERFA pour les contrats privé d'apprentissage",
  non_diffusables: true,
};

export const getEntreprise = (siren: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching entreprise ${siren}...`);
      const response = await client.get(`entreprises/${siren}`, {
        params: apiParams,
      });
      if (!response?.data?.entreprise) {
        throw new ApiError("Api Entreprise", "No entreprise data received");
      }
      return response.data.entreprise;
    } catch (e) {
      if (e.message === "timeout of 5000ms exceeded") {
        return null;
      }
      if (e.response.status === 404) {
        return null;
      }
      throw new ApiError("Api Entreprise getEntreprise", e.message, e.code || e.response.status);
    }
  });
};

export const getEtablissement = async (siret: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching etablissement ${siret}...`);
      const response = await client.get(`etablissements/${siret}`, {
        params: apiParams,
      });
      if (!response?.data?.etablissement) {
        throw new ApiError("Api Entreprise", "No etablissement data received");
      }
      return response.data.etablissement;
    } catch (e) {
      throw new ApiError("Api Entreprise getEtablissement", e.message, e.code || e.response.status);
    }
  });
};
export const getConventionCollective = async (siret: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching convention collective ${siret}...`);
      const response = await client.get(`conventions_collectives/${siret}`, {
        params: apiParams,
      });
      if (!response?.data?.conventions[0]) {
        throw new ApiError("Api Entreprise", "error getConventionCollective");
      }
      return response.data.conventions[0];
    } catch (e) {
      if (e.response.status === 404) {
        return { active: null, date_publication: null, etat: null, titre_court: null, titre: null, url: null };
      } else {
        throw new ApiError("Api Entreprise ConventionCollective", e.message, e.code || e.response.status);
      }
    }
  });
};

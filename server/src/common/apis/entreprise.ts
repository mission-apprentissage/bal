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
    baseURL: "https://entreprise.api.gouv.fr/v3",
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${config.apiEntreprise}`,
    },
  }),
});

const apiParams = {
  context: "CERFA MNA",
  recipient: "13002526500013", // Siret Dinum
  object: "Construction d'un générateur de CERFA pour les contrats privé d'apprentissage",
  non_diffusables: true,
};

export const getEntreprisePart = (endpoint: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching entreprise part ${endpoint}...`);
      const response = await client.get(endpoint, {
        params: apiParams,
      });
      if (!response?.data?.data) {
        throw new ApiError("Api Entreprise", "No entreprise data received");
      }
      return response.data.data;
    } catch (e) {
      if (e.message === "timeout of 5000ms exceeded") {
        return null;
      }
      if (e.response.status === 404) {
        return null;
      }
      throw new ApiError(`Api Entreprise getEntreprise part ${endpoint}`, e.message, e.code || e.response.status);
    }
  });
};

export const getEntreprise = async (siren: string) => {
  // fetch all parts in parallel
  const [entreprise, siege_social, numero_tva, extrait_kbis] = await Promise.all([
    getEntreprisePart(`insee/sirene/unites_legales/${siren}`),
    getEntreprisePart(`insee/sirene/unites_legales/${siren}/siege_social`),
    getEntreprisePart(`european_commission/unites_legales/${siren}/numero_tva`),
    getEntreprisePart(`infogreffe/rcs/unites_legales/${siren}/extrait_kbis`),
  ]);

  return {
    ...entreprise,
    siege_social,
    numero_tva,
    extrait_kbis,
  };
};

export const getEtablissement = async (siret: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching etablissement ${siret}...`);
      const response = await client.get(`insee/sirene/etablissements/${siret}`, {
        params: apiParams,
      });
      if (!response?.data?.data) {
        throw new ApiError("Api Entreprise", "No etablissement data received");
      }
      return response.data.data;
    } catch (e) {
      throw new ApiError("Api Entreprise getEtablissement", e.message, e.code || e.response.status);
    }
  });
};
export const getConventionCollective = async (siret: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching convention collective ${siret}...`);
      const response = await client.get(
        `fabrique_numerique_ministeres_sociaux/etablissements/${siret}/conventions_collectives`,
        {
          params: apiParams,
        }
      );
      if (!response?.data?.data?.[0]?.data) {
        throw new ApiError("Api Entreprise", "error getConventionCollective");
      }
      return response.data.data[0].data;
    } catch (e) {
      if (e.response.status === 404) {
        return { active: null, date_publication: null, etat: null, titre_court: null, titre: null, url: null };
      } else {
        throw new ApiError("Api Entreprise ConventionCollective", e.message, e.code || e.response.status);
      }
    }
  });
};

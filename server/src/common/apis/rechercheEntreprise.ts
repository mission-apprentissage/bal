import logger from "../logger";
import { ApiError, apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

interface Result {
  siren: string;
  siege: {
    liste_idcc: string[];
  };
}

interface RechercheEntrepriseResponse {
  results: Result[];
}

const executeWithRateLimiting = apiRateLimiter("apiRechercheEntreprise", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://recherche-entreprises.api.gouv.fr",
    timeout: 5000,
  }),
});

export const getRechercheEntreprise = (siret: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Recherche Entreprises Api] Fetching Siret ${siret}...`);
      const { data } = await client.get<RechercheEntrepriseResponse>("/search", {
        params: {
          q: siret,
        },
      });
      if (!data?.results || data.results.length === 0) {
        throw new ApiError("[Recherche Entreprises Api]", "No entreprise data received");
      }

      return data.results[0];
    } catch (e) {
      logger.debug(`[Recherche Entreprises Api] Error Fetching Siret ${siret}...`);
      throw new ApiError("[Recherche Entreprises Api]", e.message, e.code || e.response.status);
    }
  });
};

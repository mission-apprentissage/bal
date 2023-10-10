import logger from "../logger";
import { ApiError, apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://www.insee.fr/fr/metadonnees/nafr2
const executeWithRateLimiting = apiRateLimiter("apiNaf", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://www.insee.fr/fr/metadonnees/nafr2",
    timeout: 5000,
  }),
});

export const getNafFromCode = (naf: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Naf API] Search naf data ${naf}...`);
      const response = await client.post(`consultation`, {
        facetsQuery: [],
        filters: [],
        q: naf,
        rows: 100,
        start: 0,
      });
      if (!response?.data) {
        throw new ApiError("Api Naf", `No data found for naf=${naf}`);
      }
      return response.data.documents[0];
    } catch (e) {
      if (e.response.status === 404) {
        return null;
      } else {
        throw new ApiError("Api Naf", `${e.message} for naf=${naf}`, e.code || e.response.status);
      }
    }
  });
};

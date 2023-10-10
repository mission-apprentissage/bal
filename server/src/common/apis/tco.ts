import logger from "../logger";
import { ApiError, apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1/docs/
const executeWithRateLimiting = apiRateLimiter("apiTco", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1",
    timeout: 5000,
  }),
});

export const findCfd = (cfd: string) =>
  executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[TCO API] Search cfd data ${cfd}...`);
      const response = await client.post(`cfd`, {
        cfd,
      });
      return response;
    } catch (e) {
      throw new ApiError("Api Tco", `${e.message} for cfd=${cfd}`, e.code || e.response.status);
    }
  });

export const findRncp = (rncp: string) =>
  executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[TCO API] Search rncp data ${rncp}...`);
      const response = await client.post(`rncp`, {
        rncp,
      });
      return response;
    } catch (e) {
      throw new ApiError("Api Tco", `${e.message} for rncp=${rncp}`, e.code || e.response.status);
    }
  });

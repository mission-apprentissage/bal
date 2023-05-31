import { AxiosInstance } from "axios";

import { ApiError, apiRateLimiter } from "../../utils/apiUtils";
import getApiClient from "./client";

export const LIMIT_TRAINING_LINKS_PER_REQUEST = 100;

const executeWithRateLimiting = apiRateLimiter("processor", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient(
    {
      baseURL: "https://labonnealternance-develop.apprentissage.beta.gouv.fr",
    },
    { cache: false }
  ),
});

interface Data {
  id: string;
  mef?: string;
  cfd?: string;
  code_postal?: string;
  uai?: string;
  rncp?: string;
  cle_ministere_educatif?: string;
}

export const getTrainingLinks = async (data: Data[]) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    try {
      const { data: links, ...rest } = await client.post(
        `/api/trainingLinks`,
        data
      );
      console.log({ links, rest });
      return links;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log({ error });
      throw new ApiError(
        "Api LBA",
        `${error.message}`,
        error.code || error.response?.status
      );
    }
  });
};

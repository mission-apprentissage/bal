import { AxiosInstance } from "axios";

import { ApiError, apiRateLimiter } from "../../utils/apiUtils";
import getApiClient from "./client";

export const LIMIT_TRAINING_LINKS_PER_REQUEST = 100;

const executeWithRateLimiting = apiRateLimiter("mailingList", {
  //3 requests per second
  nbRequests: 3,
  durationInSeconds: 1,
  maxQueueSize: LIMIT_TRAINING_LINKS_PER_REQUEST,
  client: getApiClient(
    {
      baseURL: "https://labonnealternance-develop.apprentissage.beta.gouv.fr",
      timeout: 0, // no timeout
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
  email?: string;
}

export interface TrainingLink {
  id: string;
  lien_prdv: string;
  lien_lba: string;
}

export const getTrainingLinks = async (data: Data[]) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    console.log(`Request fired with ${data.length} items`);
    try {
      const { data: links } = await client.post<TrainingLink[]>(
        `/api/trainingLinks`,
        // remove email from data
        data.map(({ email: _, ...rest }) => ({
          ...rest,
        }))
      );
      console.log(`Request success with ${links.length} items`);

      // columns to add in the response from data
      return links.map(({ id, ...link }) => {
        const wish = data.find((d) => d.id === id);
        return { ...link, email: wish?.email ?? "" };
      });
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

import { AxiosInstance } from "axios";

import config from "@/config";

import { ApiError, apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

export const LIMIT_TRAINING_LINKS_PER_REQUEST = 100;

const executeWithRateLimiting = apiRateLimiter("mailingList", {
  //3 requests per second
  nbRequests: 3,
  durationInSeconds: 1,
  maxQueueSize: LIMIT_TRAINING_LINKS_PER_REQUEST,
  client: getApiClient(
    {
      baseURL: config.lba.baseURL,
      timeout: 0, // no timeout
    },
    { cache: false }
  ),
});

export interface TrainingLinkData {
  id: string;
  cle_ministere_educatif?: string;
  mef?: string;
  cfd?: string;
  rncp?: string;
  code_postal?: string;
  uai?: string;
  uai_lieu_formation?: string;
  uai_formateur?: string;
  uai_formateur_responsable?: string;
  code_insee?: string;
}

export interface TrainingLink {
  id: string;
  lien_prdv: string;
  lien_lba: string;
}

export const getTrainingLinks = async (data: TrainingLinkData[]) => {
  return executeWithRateLimiting(async (client: AxiosInstance) => {
    console.log(`Request fired with ${data.length} items`);
    try {
      const { data: links } = await client.post<TrainingLink[]>(`/api/traininglinks`, data);
      console.log(`Request success with ${links.length} items`);

      return links;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError("Api LBA", `${error.message}`, error.code || error.response?.status);
    }
  });
};

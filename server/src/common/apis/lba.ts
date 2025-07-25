import { isAxiosError } from "axios";

import { ApiError } from "../utils/apiUtils";
import getApiClient from "./client";
import config from "@/config";

export const LIMIT_TRAINING_LINKS_PER_REQUEST = 100;

const client = getApiClient(
  {
    baseURL: config.lba.baseURL,
    timeout: 0, // no timeout
  },
  { cache: false }
);

export interface TrainingLinkData {
  id: string;
  cle_ministere_educatif?: string | null;
  mef?: string | null;
  cfd?: string | null;
  rncp?: string | null;
  code_postal?: string | null;
  uai_lieu_formation?: string | null;
  uai_formateur?: string | null;
  uai_formateur_responsable?: string | null;
  code_insee?: string | null;
  siret_lieu_formation?: string | null;
  siret_formateur?: string | null;
  siret_formateur_responsable?: string | null;
}

export interface TrainingLink {
  id: string;
  lien_prdv: string;
  lien_lba: string;
}

export const getTrainingLinks = async (data: TrainingLinkData[]): Promise<TrainingLink[]> => {
  try {
    const tasks = [];

    for (let i = 0; i < data.length; i += LIMIT_TRAINING_LINKS_PER_REQUEST) {
      const chunk = data.slice(i, i + LIMIT_TRAINING_LINKS_PER_REQUEST);
      tasks.push(client.post<TrainingLink[]>(`/api/traininglinks`, chunk));
    }

    const responses = await Promise.all(tasks);

    return responses.flatMap((response) => response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (isAxiosError(error)) {
      throw new ApiError("Api LBA", `${error.code}: ${error.message}`, JSON.stringify(error.response?.data ?? null));
    }

    throw new ApiError("Api LBA", `${error.message}`, error.code || error.response?.status);
  }
};

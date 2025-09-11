import axios, { isAxiosError } from "axios";
import { internal } from "@hapi/boom";
import config from "@/config";

const LIMIT_TRAINING_LINKS_PER_REQUEST = 100;

const client = axios.create({
  baseURL: config.lba.baseURL,
  timeout: 0, // no timeout
});

export interface TrainingLinkData {
  id: string;
  cle_ministere_educatif: string | null;
  mef: string | null;
  cfd: string | null;
  rncp: string | null;
  code_postal: string | null;
  uai_lieu_formation: string | null;
  uai_formateur: string | null;
  uai_formateur_responsable: string | null;
  code_insee: string | null;
  siret_lieu_formation?: string | null;
  siret_formateur?: string | null;
  siret_formateur_responsable?: string | null;
}

export interface TrainingLink {
  id: string;
  lien_prdv: string;
  lien_lba: string;
}

export const getTrainingLinks = async (
  data: TrainingLinkData[],
  signal: AbortSignal | null = null
): Promise<TrainingLink[]> => {
  try {
    const tasks = [];

    const opts = signal ? { signal: signal } : undefined;

    for (let i = 0; i < data.length; i += LIMIT_TRAINING_LINKS_PER_REQUEST) {
      const chunk = data.slice(i, i + LIMIT_TRAINING_LINKS_PER_REQUEST);
      tasks.push(client.post<TrainingLink[]>(`/api/traininglinks`, chunk, opts));
    }

    const responses = await Promise.all(tasks);

    return responses.flatMap((response) => response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (isAxiosError(error)) {
      throw internal(
        `Erreur lors de la génération des liens de prises de rendez-vous. ${error.code ?? ""}: ${error.message}. Le serveur a répondu avec le message suivant : ${JSON.stringify(
          error.response?.data ?? null
        )}`,
        { error }
      );
    }

    throw internal(`Erreur lors de la génération des liens de prises de rendez-vous. ${error.message}`, { error });
  }
};

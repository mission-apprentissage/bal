import { AxiosInstance } from "axios";

import config from "@/config";

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
      baseURL: config.lba.baseURL,
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
  nom_eleve?: string;
  prenom_eleve?: string;
  libelle_etab_accueil?: string;
  libelle_formation?: string;
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
        // remove some from data
        data.map(
          ({
            email: _email,
            nom_eleve: _nom_eleve,
            prenom_eleve: _prenom_eleve,
            libelle_etab_accueil: _libelle_etab_accueil,
            libelle_formation: _libelle_formation,
            ...rest
          }) => ({
            ...rest,
          })
        )
      );
      console.log(`Request success with ${links.length} items`);

      // columns to add in the response from data
      return links.map(({ id, ...link }) => {
        const wish = data.find((d) => d.id === id);
        return {
          ...link,
          email: wish?.email ?? "",
          nom_eleve: wish?.nom_eleve ?? "",
          prenom_eleve: wish?.prenom_eleve ?? "",
          libelle_etab_accueil: wish?.libelle_etab_accueil ?? "",
          libelle_formation: wish?.libelle_formation ?? "",
        };
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

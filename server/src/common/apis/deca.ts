import { formatDuration, intervalToDuration } from "date-fns";
import { ApiDeca, Contrat } from "shared/apis/deca";

import logger from "@/common/logger";
import { ApiError, apiRateLimiter } from "@/common/utils/apiUtils";
import config from "@/config";

import getApiClient from "./client";

export const API_ENDPOINT = config.decaApi.endpoint;

const axiosClient = getApiClient({
  baseURL: API_ENDPOINT,
  timeout: 600000, // Nécessaire pour Deca car très long - en attente optimisation de leur coté
});

const executeWithRateLimiting = apiRateLimiter("apiDeca", {
  nbRequests: 2,
  durationInSeconds: 1,
  client: axiosClient,
});

const configFor = {
  LBA: {
    endpoint: "contrats/extractLBA",
    username: config.decaApi.loginLba,
    password: config.decaApi.passwordLba,
  },
  TDB: {
    endpoint: "contrats/extractTBA",
    username: config.decaApi.loginTdb,
    password: config.decaApi.passwordTdb,
  },
};

/**
 * Fonction de récupération des contrats DECA depuis l'API mise à disposition par la DGEFP
 * @param dateDebut
 * @param dateFin
 * @param page
 * @param for
 * @returns
 */
export const getDeca = async (
  dateDebut: string,
  dateFin: string,
  page: number,
  product: "LBA" | "TDB" = "LBA"
): Promise<ApiDeca> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return executeWithRateLimiting(async (client: any) => {
    try {
      console.log(dateDebut, dateFin, page);
      const startDate = new Date();
      const response = await client.post(
        configFor[product].endpoint,
        {
          dateDebut,
          dateFin,
          page,
        },
        {
          auth: {
            username: configFor[product].username,
            password: configFor[product].password,
          },
        }
      );
      const endDate = new Date();
      const ts = endDate.getTime() - startDate.getTime();
      const duration = formatDuration(intervalToDuration({ start: startDate, end: endDate })) || `${ts}ms`;
      console.log(duration);
      logger.debug(
        `[API Deca] Récupération contrats du ${dateDebut} au ${dateFin} - page ${page} sur ${
          response?.data?.metadonnees?.totalPages
        } ${response.cached ? "(depuis le cache)" : ""}`
      );
      if (!response?.data) {
        throw new ApiError("Api Deca", "No data received");
      }
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.info(e.response);
      if (!e.response) logger.info(e);
      throw new ApiError("Api Deca getDeca", e.message, e.code || e.response?.status);
    }
  });
};

export const getAllContrats = async (
  dateDebut: string,
  dateFin: string,
  product: "LBA" | "TDB" = "LBA"
): Promise<Contrat[]> => {
  const allContrats: Contrat[] = [];

  // Fetch de la première page
  const apiResponse: ApiDeca = await getDeca(dateDebut, dateFin, 1, product);
  logger.info(
    `> API DECA - Fetch => [dateDebut : ${dateDebut} - dateFin : ${dateFin} - page : 1] => Métadonnées Réponse : ${JSON.stringify(
      apiResponse?.metadonnees
    )}`
  );
  allContrats.push(...apiResponse.contrats);

  // Fetch sur toutes les pages restantes
  for (let pageIndex = 2; pageIndex <= apiResponse.metadonnees.totalPages; pageIndex++) {
    const apiResponse: ApiDeca = await getDeca(dateDebut, dateFin, pageIndex, product);
    logger.info(
      `> API DECA - Fetch => [dateDebut : ${dateDebut} - dateFin : ${dateFin} - page : ${pageIndex}] => Métadonnées Réponse : ${JSON.stringify(
        apiResponse?.metadonnees
      )}`
    );
    allContrats.push(...apiResponse.contrats);
  }

  return allContrats;
};

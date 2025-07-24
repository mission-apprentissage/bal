import querystring from "querystring";
import axios from "axios";

import { ApiError } from "../utils/apiUtils";
import getApiClient from "./client";
import config from "@/config";

export const OPCO_EP_BASE_URL = `https://${config.opcoEp.baseUrl}`;
export const OPCO_EP_AUTH_BASE_URL = `https://${config.opcoEp.baseAuthUrl}`;

export const OPCO_EP_CODE_RETOUR_EMAIL_TROUVE = 1;
export const OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE = 2;

const axiosClient = getApiClient({
  baseURL: OPCO_EP_BASE_URL,
});

/**
 * @description get auth token from gateway
 * @param {*} token
 * @returns {object} token data
 */
const getToken = async () => {
  try {
    const response = await axios.post(
      `${OPCO_EP_AUTH_BASE_URL}/auth/realms/partenaires-etatiques/protocol/openid-connect/token`,
      querystring.stringify({
        grant_type: config.opcoEp.grantType,
        client_id: config.opcoEp.clientId,
        client_secret: config.opcoEp.clientSecret,
        scope: config.opcoEp.scope,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError("Api Opco Ep token", error.message, error.code || error.response?.status);
  }
};

/**
 * @description Check Opco Ep referential using siret & email submitted by user
 * @param {string} siret
 * @param {string} email
 * @returns {boolean}
 */
export const getOpcoEpVerification = async (siret: string, email: string) => {
  const token_ep = await getToken();

  try {
    const { data } = await axiosClient.get(
      `/apis/referentiel-entreprise/v2/entreprises/securisation-echange?email=${email}&siret=${siret}`,
      {
        headers: {
          Authorization: `Bearer ${token_ep.access_token}`,
          "X-Audience-Id": "etatiques-lba",
          "Content-Type": "application/json",
        },
      }
    );

    //   1-	SIRET et courriel connus
    // {
    //     "codeRetour": 1,
    //     "detailRetour": "Email trouvé"
    // }

    // 2-	SIRET connu et domaine courriel connu
    // {
    //     "codeRetour": 2,
    //     "detailRetour": "Domaine identique"
    // }

    // 3-	SIRET connu et domaine courriel inconnu
    // {
    //     "codeRetour": 3,
    //     "detailRetour": "Email ou domaine inconnu"
    // }

    // 4-	SIRET inconnu
    // {
    //     "codeRetour": 4,
    //     "detailRetour": "Siret inconnu"
    // }

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError("Api Opco Ep", error.message, error.code || error.response?.status);
  }
};

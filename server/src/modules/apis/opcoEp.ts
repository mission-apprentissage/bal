import axios from "axios";
import dayjs from "dayjs";
import querystring from "querystring";

import { config } from "../../../config/config";
import { ApiError } from "../../utils/apiUtils";
import getApiClient from "./client";

const axiosClient = getApiClient({
  baseURL: `https://${config.opcoEp.baseUrl}`,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let token = {} as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTokenValid = (token: any) => dayjs().isAfter(dayjs(token.expire));

/**
 * @description get auth token from gateway
 * @param {*} token
 * @returns {object} token data
 */
const getToken = async (token = {}) => {
  const isValid = isTokenValid(token);

  if (isValid) {
    return token;
  }

  try {
    const response = await axios.post(
      `https://${config.opcoEp.baseAuthUrl}/auth/realms/partenaires-etatiques/protocol/openid-connect/token`,
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

    return {
      ...response.data,
      expire: dayjs().add(response.data.expires_in - 10, "s"),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(
      "Api Opco Ep token",
      error.message,
      error.code || error.response?.status
    );
  }
};

/**
 * @description Check Opco Ep referential using siret & email submitted by user
 * @param {string} siret
 * @param {string} email
 * @returns {boolean}
 */
export const getOpcoEpVerification = async (siret: string, email: string) => {
  token = await getToken(token);

  try {
    const { data } = await axiosClient.get(
      `/apis/referentiel-entreprise/v2/entreprises/securisation-echange?email=${email}&siret=${siret}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "X-Audience-Id": "etatiques-lba",
          "Content-Type": "application/json",
        },
      }
    );

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(
      "Api Opco Ep",
      error.message,
      error.code || error.response?.status
    );
  }
};

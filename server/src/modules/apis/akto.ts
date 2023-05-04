import axios from "axios";
import dayjs from "dayjs";
import querystring from "querystring";

import { config } from "../../../config/config";
import { ApiError } from "../../utils/apiUtils";
import getApiClient from "./client";

const axiosClient = getApiClient({
  baseURL: "https://api.akto.fr/referentiel/api/v1",
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
      "https://login.microsoftonline.com/0285c9cb-dd17-4c1e-9621-c83e9204ad68/oauth2/v2.0/token",
      querystring.stringify({
        grant_type: config.akto.grantType,
        client_id: config.akto.clientId,
        client_secret: config.akto.clientSecret,
        scope: config.akto.scope,
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
  } catch (error) {
    return error;
  }
};

/**
 * @description Check Akto referential using siren & email submitted by user
 * @param {string} siren
 * @param {string} email
 * @returns {boolean}
 */
export const getAktoVerification = async (siren: string, email: string) => {
  token = await getToken(token);

  try {
    const { data } = await axiosClient.get(
      `/Relations/Validation?email=${email}&siren=${siren}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    return data.data.match;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(
      "Api Akto",
      error.message,
      error.code || error.response?.status
    );
  }
};
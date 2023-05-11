import axios from "axios";
import querystring from "querystring";

import { config } from "../../../config/config";
import { ApiError } from "../../utils/apiUtils";
import getApiClient from "./client";

const axiosClient = getApiClient({
  baseURL: "https://api.akto.fr/referentiel/api/v1",
});

/**
 * @description get auth token from gateway
 * @param {*} token
 * @returns {object} token data
 */
const getToken = async () => {
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

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(
      "Api Akto token",
      error.message,
      error.code || error.response?.status
    );
  }
};

/**
 * @description Check Akto referential using siren & email submitted by user
 * @param {string} siren
 * @param {string} email
 * @returns {boolean}
 */
export const getAktoVerification = async (siren: string, email: string) => {
  const token_akto = await getToken();

  try {
    const { data } = await axiosClient.get(
      `/Relations/Validation?email=${email}&siren=${siren}`,
      {
        headers: {
          Authorization: `Bearer ${token_akto.access_token}`,
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

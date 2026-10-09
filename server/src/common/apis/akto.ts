import axios from "axios"
import querystring from "querystring"
import config from "@/config"
import { ApiError, toApiErrorDetails } from "../utils/apiUtils"

export const AKTO_API_BASE_URL = "https://api.akto.fr/referentiel/api/v1"
export const AKTO_AUTH_BASE_URL = "https://login.microsoftonline.com"

const TIMEOUT_MS = 5_000

const axiosClient = axios.create({
  timeout: TIMEOUT_MS,
  baseURL: AKTO_API_BASE_URL,
})

/**
 * @description get auth token from gateway
 * @param {*} token
 * @returns {object} token data
 */
const getToken = async () => {
  try {
    const response = await axios.post(
      `${AKTO_AUTH_BASE_URL}/0285c9cb-dd17-4c1e-9621-c83e9204ad68/oauth2/v2.0/token`,
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
        timeout: TIMEOUT_MS,
      }
    )

    return response.data
  } catch (error) {
    const { message, reason } = toApiErrorDetails(error)
    throw new ApiError("Api Akto token", message, reason)
  }
}

/**
 * Lève une `ApiError` quand AKTO ne répond pas ou répond hors contrat : seul un booléen `match` est une réponse métier.
 */
export const getAktoVerification = async (siren: string, email: string): Promise<boolean> => {
  const token_akto = await getToken()

  let data: { data?: { match?: unknown } } | undefined
  try {
    const response = await axiosClient.get("/Relations/Validation", {
      params: { email, siren },
      headers: {
        Authorization: `Bearer ${token_akto.access_token}`,
      },
    })
    data = response.data
  } catch (error) {
    const { message, reason } = toApiErrorDetails(error)
    throw new ApiError("Api Akto", message, reason)
  }

  const match = data?.data?.match
  if (typeof match !== "boolean") {
    throw new ApiError("Api Akto", "réponse inattendue")
  }
  return match
}

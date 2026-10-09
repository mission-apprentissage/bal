import axios from "axios"
import querystring from "querystring"
import config from "@/config"
import { ApiError, toApiErrorDetails } from "../utils/apiUtils"

export const OPCO_EP_BASE_URL = `https://${config.opcoEp.baseUrl}`
export const OPCO_EP_AUTH_BASE_URL = `https://${config.opcoEp.baseAuthUrl}`

//   1-	SIRET et courriel connus : { "codeRetour": 1, "detailRetour": "Email trouvé" }
//   2-	SIRET connu et domaine courriel connu : { "codeRetour": 2, "detailRetour": "Domaine identique" }
//   3-	SIRET connu et domaine courriel inconnu : { "codeRetour": 3, "detailRetour": "Email ou domaine inconnu" }
//   4-	SIRET inconnu : { "codeRetour": 4, "detailRetour": "Siret inconnu" }
export const OPCO_EP_CODE_RETOUR_EMAIL_TROUVE = 1
export const OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE = 2
const OPCO_EP_CODE_RETOUR_EMAIL_OU_DOMAINE_INCONNU = 3
const OPCO_EP_CODE_RETOUR_SIRET_INCONNU = 4

const OPCO_EP_CODES_RETOUR = [
  OPCO_EP_CODE_RETOUR_EMAIL_TROUVE,
  OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE,
  OPCO_EP_CODE_RETOUR_EMAIL_OU_DOMAINE_INCONNU,
  OPCO_EP_CODE_RETOUR_SIRET_INCONNU,
] as const

type IOpcoEpCodeRetour = (typeof OPCO_EP_CODES_RETOUR)[number]

const TIMEOUT_MS = 5_000

const axiosClient = axios.create({
  timeout: TIMEOUT_MS,
  baseURL: OPCO_EP_BASE_URL,
})

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
        timeout: TIMEOUT_MS,
      }
    )

    return response.data
  } catch (error) {
    const { message, reason } = toApiErrorDetails(error)
    throw new ApiError("Api Opco Ep token", message, reason)
  }
}

const isOpcoEpCodeRetour = (value: unknown): value is IOpcoEpCodeRetour => OPCO_EP_CODES_RETOUR.some((code) => code === value)

/**
 * Lève une `ApiError` quand OPCO EP ne répond pas ou répond hors contrat : seuls les codes retour 1 à 4 sont des réponses métier.
 */
export const getOpcoEpVerification = async (siret: string, email: string): Promise<{ codeRetour: IOpcoEpCodeRetour }> => {
  const token_ep = await getToken()

  let data: { codeRetour?: unknown } | undefined
  try {
    const response = await axiosClient.get("/apis/referentiel-entreprise/v2/entreprises/securisation-echange", {
      params: { email, siret },
      headers: {
        Authorization: `Bearer ${token_ep.access_token}`,
        "X-Audience-Id": "etatiques-lba",
        "Content-Type": "application/json",
      },
    })
    data = response.data
  } catch (error) {
    const { message, reason } = toApiErrorDetails(error)
    throw new ApiError("Api Opco Ep", message, reason)
  }

  const codeRetour = data?.codeRetour
  if (!isOpcoEpCodeRetour(codeRetour)) {
    throw new ApiError("Api Opco Ep", "réponse inattendue")
  }
  return { codeRetour }
}

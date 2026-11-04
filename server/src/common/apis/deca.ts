import axios from "axios"
import { formatDuration, intervalToDuration } from "date-fns"
import type { ApiDeca, Contrat } from "shared/apis/deca"
import logger from "@/common/logger"
import { ApiError, apiRateLimiter, toApiErrorDetails } from "@/common/utils/apiUtils"
import config from "@/config"

const axiosClient = axios.create({
  baseURL: config.decaApi.endpoint,
  timeout: 600000, // Nécessaire pour Deca car très long - en attente optimisation de leur coté
})

const executeWithRateLimiting = apiRateLimiter("apiDeca", {
  nbRequests: 2,
  durationInSeconds: 1,
  client: axiosClient,
})

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
}

const MAX_ERROR_BODY_LENGTH = 500

// Deca renvoie un message JSON (ex : 503 hors plage horaire) ou une page d'erreur HTML (ex : 404 en maintenance)
const formatErrorBody = (data: unknown): string => {
  if (data === undefined || data === null) return ""
  const raw = typeof data === "string" ? data : JSON.stringify(data)
  const text = raw
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > MAX_ERROR_BODY_LENGTH ? `${text.slice(0, MAX_ERROR_BODY_LENGTH)}…` : text
}

/**
 * Fonction de récupération des contrats DECA depuis l'API mise à disposition par la DGEFP
 * @param dateDebut
 * @param dateFin
 * @param page
 * @param for
 * @returns
 */
const getDeca = async (dateDebut: string, dateFin: string, page: number, product: "LBA" | "TDB" = "LBA"): Promise<ApiDeca> => {
  return executeWithRateLimiting(async (client) => {
    try {
      console.log(dateDebut, dateFin, page)
      const startDate = new Date()
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
      )
      const endDate = new Date()
      const ts = endDate.getTime() - startDate.getTime()
      const duration = formatDuration(intervalToDuration({ start: startDate, end: endDate })) || `${ts}ms`
      console.log(duration)
      logger.debug(`[API Deca] Récupération contrats du ${dateDebut} au ${dateFin} - page ${page} sur ${response?.data?.metadonnees?.totalPages}`)
      if (!response?.data) {
        throw new ApiError("Api Deca", "No data received")
      }
      return response.data
    } catch (e) {
      // ne pas logger l'erreur axios brute : sa config contient les identifiants Basic Auth
      const { message, reason, status } = toApiErrorDetails(e)
      const body = axios.isAxiosError(e) ? formatErrorBody(e.response?.data) : ""
      logger.error(`[API Deca] ${configFor[product].endpoint} du ${dateDebut} au ${dateFin} - page ${page} : ${message}${body ? ` - ${body}` : ""}`)
      throw new ApiError("Api Deca getDeca", message, reason, status)
    }
  })
}

export const getAllContrats = async (dateDebut: string, dateFin: string, product: "LBA" | "TDB" = "LBA"): Promise<Contrat[]> => {
  const allContrats: Contrat[] = []

  // Fetch de la première page
  const apiResponse: ApiDeca = await getDeca(dateDebut, dateFin, 1, product)
  logger.info(`> API DECA - Fetch => [dateDebut : ${dateDebut} - dateFin : ${dateFin} - page : 1] => Métadonnées Réponse : ${JSON.stringify(apiResponse?.metadonnees)}`)
  allContrats.push(...apiResponse.contrats)

  // Fetch sur toutes les pages restantes
  for (let pageIndex = 2; pageIndex <= apiResponse.metadonnees.totalPages; pageIndex++) {
    const apiResponse: ApiDeca = await getDeca(dateDebut, dateFin, pageIndex, product)
    logger.info(
      `> API DECA - Fetch => [dateDebut : ${dateDebut} - dateFin : ${dateFin} - page : ${pageIndex}] => Métadonnées Réponse : ${JSON.stringify(apiResponse?.metadonnees)}`
    )
    allContrats.push(...apiResponse.contrats)
  }

  return allContrats
}

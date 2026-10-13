import config from "@/config"
import { ApiError, toApiErrorDetails } from "../utils/apiUtils"

export class BudgetExhaustedError extends Error {
  constructor() {
    super("budget de validation épuisé")
    this.name = "BudgetExhaustedError"
  }
}

/**
 * Timeout d'une requête fournisseur : le plus court entre le timeout par appel et le temps restant avant l'échéance de la cascade.
 */
export const getRequestTimeout = (deadline: number): number => {
  const remaining = deadline - Date.now()
  if (remaining <= 0) {
    throw new BudgetExhaustedError()
  }
  return Math.min(config.validation.providerTimeoutMs, remaining)
}

type ITokenResponse = { access_token?: unknown; expires_in?: unknown }

const TOKEN_EXPIRY_MARGIN_MS = 30_000

/**
 * Token OAuth2 gardé en mémoire jusqu'à son expiration moins une marge, propre à chaque process.
 */
export const createTokenProvider = (apiName: string, fetchToken: (timeout: number) => Promise<ITokenResponse>) => {
  let cached: { token: string; expiresAt: number } | null = null

  return {
    get: async (deadline: number): Promise<string> => {
      if (cached && cached.expiresAt > Date.now()) {
        return cached.token
      }

      const timeout = getRequestTimeout(deadline)
      let data: ITokenResponse
      try {
        data = await fetchToken(timeout)
      } catch (error) {
        const { message, reason, status } = toApiErrorDetails(error)
        throw new ApiError(apiName, message, reason, status)
      }

      const { access_token, expires_in } = data ?? {}
      if (typeof access_token !== "string") {
        throw new ApiError(apiName, "réponse inattendue")
      }
      if (typeof expires_in === "number" && expires_in * 1000 > TOKEN_EXPIRY_MARGIN_MS) {
        cached = { token: access_token, expiresAt: Date.now() + expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS }
      }
      return access_token
    },
    invalidate: () => {
      cached = null
    },
  }
}

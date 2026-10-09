import type { AxiosInstance } from "axios"
import { isAxiosError } from "axios"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

import { timeout } from "./asyncUtils"

interface ApiRateLimiterOptions {
  nbRequests?: number
  durationInSeconds?: number
  maxQueueSize?: number
  timeout?: number
  client: AxiosInstance
}
export const apiRateLimiter = (name: string, options: ApiRateLimiterOptions) => {
  const rateLimiter = new RateLimiterMemory({
    keyPrefix: name,
    points: options.nbRequests || 1,
    duration: options.durationInSeconds || 1,
  })

  const queue = new RateLimiterQueue(rateLimiter, {
    maxQueueSize: options.maxQueueSize || 25,
  })

  return async <T>(callback: (i: AxiosInstance) => T): Promise<T> => {
    await timeout(queue.removeTokens(1), options.timeout || 10000)
    return callback(options.client)
  }
}

export class ApiError extends Error {
  apiName: string
  message: string
  // les appelants passent `error.code || error.response?.status`, donc un status HTTP numérique
  // peut arriver ici : le type reflète ce qui transite réellement.
  reason: string | number | undefined
  // axios renseigne `code` (`ERR_BAD_REQUEST`, `ERR_BAD_RESPONSE`) sur une réponse HTTP en erreur : le statut n'est donc pas dans `reason`.
  status: number | undefined

  constructor(apiName: string, message: string, reason?: string | number, status?: number) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.apiName = apiName
    this.message = `[${apiName}] ${message}`
    this.reason = reason
    this.status = status
  }
}

/**
 * Extrait message et code d'une erreur de client HTTP sans passer par `any`.
 * Reproduit le comportement historique `error.message` / `error.code || error.response?.status`.
 */
export function toApiErrorDetails(error: unknown): { message: string; reason: string | number | undefined; status?: number | undefined } {
  if (isAxiosError(error)) {
    return { message: error.message, reason: error.code || error.response?.status, status: error.response?.status }
  }

  if (error instanceof Error) {
    return { message: error.message, reason: (error as NodeJS.ErrnoException).code }
  }

  return { message: String(error), reason: undefined }
}

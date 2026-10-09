import { setTimeout as sleep } from "node:timers/promises"
import { captureException } from "@sentry/node"
import type { IValidationExternalSource } from "shared/routes/v1/organisation.routes"
import { BudgetExhaustedError } from "@/common/apis/providerRequest"
import logger from "@/common/logger"
import { ApiError } from "@/common/utils/apiUtils"
import { CircuitBreaker } from "@/common/utils/circuitBreaker"
import config from "@/config"

export type IValidationMatch = "email" | "domain"
export type IExternalVerification = IValidationMatch | "no_match"

type IFailureOutcome = "timeout" | "network" | "http_5xx" | "http_auth" | "http_4xx" | "unexpected" | "budget_exhausted"
type IProviderCallOutcome = "match" | "no_match" | "circuit_open" | IFailureOutcome

const RETRYABLE_OUTCOMES: ReadonlySet<IProviderCallOutcome> = new Set(["timeout", "network", "http_5xx"])
const TIMEOUT_CODES: ReadonlySet<string> = new Set(["ECONNABORTED", "ETIMEDOUT"])

const getBreakerOptions = () => ({ threshold: config.validation.breakerThreshold, cooldownMs: config.validation.breakerCooldownMs })

// Un circuit par fournisseur et par process : chaque réplica du serveur a le sien.
const breakers: Record<IValidationExternalSource, CircuitBreaker> = {
  akto: new CircuitBreaker(getBreakerOptions),
  opco_ep: new CircuitBreaker(getBreakerOptions),
}

export const resetValidationBreakers = () => {
  breakers.akto = new CircuitBreaker(getBreakerOptions)
  breakers.opco_ep = new CircuitBreaker(getBreakerOptions)
}

function categorizeFailure(error: unknown): { outcome: IFailureOutcome; httpStatus?: number | undefined } {
  if (error instanceof BudgetExhaustedError) {
    return { outcome: "budget_exhausted" }
  }
  if (!(error instanceof ApiError)) {
    return { outcome: "unexpected" }
  }
  const { status, reason } = error
  if (status !== undefined) {
    if (status === 401 || status === 403) {
      return { outcome: "http_auth", httpStatus: status }
    }
    return { outcome: status >= 500 ? "http_5xx" : "http_4xx", httpStatus: status }
  }
  if (typeof reason === "string") {
    return { outcome: TIMEOUT_CODES.has(reason) ? "timeout" : "network" }
  }
  return { outcome: "unexpected" }
}

// Une ligne par appel, lue dans Loki : rien de la requête (e-mail, SIRET) n'y figure.
function logProviderCall(fields: { provider: IValidationExternalSource; outcome: IProviderCallOutcome; attempt: number; duration_ms?: number; http_status?: number | undefined }) {
  const entry = { module: "validation", ...fields }
  if (fields.outcome === "match" || fields.outcome === "no_match") {
    logger.info(entry, "appel fournisseur de validation")
  } else {
    logger.warn(entry, "appel fournisseur de validation")
  }
}

/**
 * Interroge un fournisseur avec nouvelle tentative bornée et circuit breaker. `unavailable` : pas de réponse métier exploitable.
 */
export async function callValidationProvider(
  provider: IValidationExternalSource,
  verify: () => Promise<IExternalVerification>,
  deadline: number
): Promise<IExternalVerification | "unavailable"> {
  if (deadline <= Date.now()) {
    logProviderCall({ provider, outcome: "budget_exhausted", attempt: 0 })
    return "unavailable"
  }
  const breaker = breakers[provider]
  if (!breaker.tryAcquire()) {
    logProviderCall({ provider, outcome: "circuit_open", attempt: 0 })
    return "unavailable"
  }

  let attempt = 0
  while (true) {
    attempt++
    const startedAt = Date.now()
    try {
      const result = await verify()
      logProviderCall({ provider, outcome: result === "no_match" ? "no_match" : "match", attempt, duration_ms: Date.now() - startedAt })
      breaker.recordSuccess()
      return result
    } catch (error) {
      const { outcome, httpStatus } = categorizeFailure(error)
      logProviderCall({ provider, outcome, attempt, duration_ms: Date.now() - startedAt, http_status: httpStatus })

      const canRetry = RETRYABLE_OUTCOMES.has(outcome) && attempt <= config.validation.retries && deadline - Date.now() > config.validation.retryDelayMs
      if (canRetry) {
        await sleep(config.validation.retryDelayMs)
        continue
      }

      if (outcome === "budget_exhausted") {
        breaker.release()
      } else {
        if (breaker.recordFailure()) {
          logger.warn({ module: "validation", provider }, "circuit ouvert sur le fournisseur de validation")
        }
        captureException(error, { tags: { module: "validation" } })
      }
      return "unavailable"
    }
  }
}

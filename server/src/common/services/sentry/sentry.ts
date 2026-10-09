import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"

import config from "../../../config"

// Filet de sécurité repris de labonnealternance#5294 : `extraErrorDataIntegration` sérialise les propriétés
// propres des erreurs (config axios, opérations MongoDB...), où peuvent figurer secrets et données personnelles.
const SENSITIVE_KEY_PATTERN = /(authorization|cookie|secret|password|passwd|token|api[-_]?key|credential)/i
const REDACTED = "[Filtered]"

// Objets internes Node/axios : sans valeur de diagnostic, et un secret peut y figurer sous une forme qu'aucun motif ne reconnaît.
const OPAQUE_TRANSPORT_KEY_PATTERN = /^(request|res|socket|agent|_streams|_currentRequest|httpAgent|httpsAgent)$/i

const SENSITIVE_KV_PATTERN = /((?:client_secret|refresh_token|access_token|token|password|passwd|api[-_]?key)\s*[=:]\s*)([^&\s"']+)/gi
const BEARER_TOKEN_PATTERN = /(Bearer\s+)([A-Za-z0-9\-._~+/]+=*)/gi
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

function redactString(str: string): string {
  return str.replace(SENSITIVE_KV_PATTERN, `$1${REDACTED}`).replace(BEARER_TOKEN_PATTERN, `$1${REDACTED}`).replace(EMAIL_PATTERN, REDACTED)
}

function scrubSensitiveData(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (typeof value === "string") {
    return redactString(value)
  }
  if (value === null || typeof value !== "object") {
    return value
  }
  if (seen.has(value)) {
    return value
  }
  seen.add(value)

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = scrubSensitiveData(value[i], seen)
    }
    return value
  }

  const obj = value as Record<string, unknown>
  for (const key of Object.keys(obj)) {
    obj[key] = SENSITIVE_KEY_PATTERN.test(key) || OPAQUE_TRANSPORT_KEY_PATTERN.test(key) ? REDACTED : scrubSensitiveData(obj[key], seen)
  }
  return obj
}

type ITransactionEvent = Parameters<NonNullable<Sentry.NodeOptions["beforeSendTransaction"]>>[0]

// Attributs d'URL des spans et breadcrumbs HTTP : la query des appels sortants porte les paramètres des fournisseurs (e-mail, SIRET).
const URL_QUERY_KEYS: ReadonlySet<string> = new Set(["url.query", "http.query", "http.fragment"])
const URL_KEYS: ReadonlySet<string> = new Set(["url", "http.url", "url.full", "url.path", "http.target"])

const stripUrlQuery = (url: string): string => url.replace(/[?#].*$/, "")

/** Copie des attributs sans query d'URL ni secret : les objets reçus peuvent appartenir à l'application. */
function scrubAttributes(data: Record<string, unknown>): Record<string, unknown> {
  const scrubbed: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (URL_QUERY_KEYS.has(key)) continue
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      scrubbed[key] = REDACTED
    } else if (typeof value === "string") {
      scrubbed[key] = redactString(URL_KEYS.has(key) ? stripUrlQuery(value) : value)
    } else {
      scrubbed[key] = value
    }
  }
  return scrubbed
}

// `beforeSend` et `beforeSendTransaction` reçoivent un évènement déjà normalisé par le SDK : le modifier en place est sans effet sur l'application.
function scrubCommonEventData<T extends Sentry.ErrorEvent | ITransactionEvent>(event: T): T {
  // Le corps et la query des requêtes BAL portent e-mails, SIRET ou mots de passe : ils ne sont jamais envoyés.
  if (event.request) {
    delete event.request.data
    delete event.request.query_string
    if (event.request.url) event.request.url = stripUrlQuery(event.request.url)
  }
  if (event.contexts) scrubSensitiveData(event.contexts)
  if (event.extra) scrubSensitiveData(event.extra)
  if (event.request) scrubSensitiveData(event.request)
  return event
}

function scrubSensitiveEventData(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.message) event.message = redactString(event.message)
  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = redactString(exception.value)
  }
  return scrubCommonEventData(event)
}

function scrubSensitiveTransactionData(event: ITransactionEvent): ITransactionEvent {
  const trace = event.contexts?.trace
  if (trace?.data) trace.data = scrubAttributes(trace.data)
  if (event.spans) {
    event.spans = event.spans.map((span) => ({
      ...span,
      ...(span.data ? { data: scrubAttributes(span.data) as typeof span.data } : {}),
    }))
  }
  return scrubCommonEventData(event)
}

// Appelé à l'ajout, avant normalisation : `data` peut référencer les arguments vivants d'un `console.*`, d'où la copie.
function scrubBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb {
  const { arguments: _consoleArguments, ...data } = breadcrumb.data ?? {}
  return {
    ...breadcrumb,
    ...(breadcrumb.message ? { message: redactString(breadcrumb.message) } : {}),
    ...(breadcrumb.data ? { data: scrubAttributes(data) } : {}),
  }
}

export function getSentryOptions(): Sentry.NodeOptions {
  return {
    beforeSend: (event) => scrubSensitiveEventData(event),
    beforeSendTransaction: (event) => scrubSensitiveTransactionData(event),
    beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
    tracesSampler: (samplingContext) => {
      // Continue trace decision, if there is any parentSampled information
      if (samplingContext.parentSampled != null) {
        return samplingContext.parentSampled
      }

      if (samplingContext.attributes?.["sentry.op"] === "queue.task") {
        return 1 / 10_000
      }

      if (samplingContext.attributes?.["sentry.op"] === "processor.job") {
        // Sample 100% of processor jobs
        return 1.0
      }

      return 0.01
    },
    tracePropagationTargets: [/^https:\/\/[^/]*\.apprentissage\.beta\.gouv\.fr/],
    profilesSampleRate: 0.001,
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      Sentry.httpIntegration(),
      Sentry.mongoIntegration(),
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
      Sentry.extraErrorDataIntegration({ depth: 16 }),
      nodeProfilingIntegration(),
    ],
  }
}

export function initSentry(): void {
  Sentry.init(getSentryOptions())
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000)
}

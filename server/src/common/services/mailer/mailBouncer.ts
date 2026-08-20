import { randomUUID } from "node:crypto"

import { captureException } from "@sentry/node"
import { ObjectId } from "mongodb"
import type { BouncerPingResult } from "shared/models/bouncer.email.model"

import logger from "../../logger"
import { mapWithConcurrency, sleep } from "../../utils/asyncUtils"
import { getDbCollection } from "../../utils/mongodbUtils"
import { createSmtpConnection, getSmtpServer, quit, sayEhlo, vrfy, vrfyWorkaround } from "./smtpConnection"

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

// Nombre de domaines vérifiés en parallèle (la vérification reste séquentielle au sein d'un même domaine)
const DOMAIN_CONCURRENCY = 20
// Un seul retry court : les erreurs 4xx persistantes (greylisting) sont persistées en cache
// avec un TTL court et re-vérifiées par le job de fond "Re-vérification des emails en erreur"
const MAX_RETRY_COUNT = 1
const RETRY_DELAY_MS = 10_000

type SmtpSupportMap = Map<string, BouncerPingResult | null>

async function tryVerifyEmail(email: string, signal: AbortSignal, retryCount = 0): Promise<BouncerPingResult> {
  const smtp = await getSmtpServer(email)

  const retry = async (r: BouncerPingResult): Promise<BouncerPingResult> => {
    if (r.status === "error" && r.responseCode?.startsWith("4") && retryCount < MAX_RETRY_COUNT) {
      await sleep(RETRY_DELAY_MS, signal)
      signal?.throwIfAborted()
      return tryVerifyEmail(email, signal, retryCount + 1)
    }

    return r
  }

  if (!smtp) {
    return {
      status: "invalid",
      message: "No SMTP server found for domain",
      responseCode: null,
      responseMessage: null,
    }
  }

  signal.throwIfAborted()

  const smtpConnection = createSmtpConnection(
    {
      port: 25, // Default SMTP port
      fqdn: "bal-mail.apprentissage.beta.gouv.fr", // Fully Qualified Domain Name of your SMTP server
      sender: "nepasrepondre@apprentissage.beta.gouv.fr", // Email address to use as the sender in SMTP checks,
      email,
      smtp,
    },
    signal
  )

  try {
    const elhoResult = await sayEhlo(smtpConnection)
    if (!elhoResult.success) {
      await quit(smtpConnection)

      return retry({
        status: "error",
        message: "Connection to SMTP server failed",
        responseCode: elhoResult.code,
        responseMessage: elhoResult.message,
      })
    }

    const vrfyResult = await vrfy(smtpConnection, elhoResult.extensions)

    if (!vrfyResult.success) {
      await quit(smtpConnection)

      return retry({
        status: "error",
        message: "VRFY command failed",
        responseCode: vrfyResult.code,
        responseMessage: vrfyResult.message,
      })
    }

    // Try to detect softbounce
    if (vrfyResult.status !== "not_supported" && vrfyResult.status !== "valid") {
      await quit(smtpConnection)

      return retry({
        status: vrfyResult.status,
        message: "VRFY validation succeeded",
        responseCode: vrfyResult.code,
        responseMessage: vrfyResult.message,
      })
    }

    const workaroundResult = await vrfyWorkaround(smtpConnection, elhoResult.extensions)
    await quit(smtpConnection)

    if (!workaroundResult.success) {
      return retry({
        status: "not_supported",
        message: "VRFY workaround command failed",
        responseCode: workaroundResult.code,
        responseMessage: workaroundResult.message,
      })
    }

    return {
      status: workaroundResult.status,
      message: "VRFY workaround validation succeeded",
      responseCode: workaroundResult.code,
      responseMessage: workaroundResult.message,
    }
  } catch (err) {
    await smtpConnection.throw(err)

    signal?.throwIfAborted()

    if (err.message !== "Connection closed") {
      // silenced on sentry for this common error
      captureException(err)
    }
    logger.error(err, { email })

    return {
      status: "error",
      message: "Unknown error occurred",
      responseCode: null,
      responseMessage: null,
    }
  }
}

async function tryWithRandomEmail(_smtp: string, email: string, signal: AbortSignal): Promise<BouncerPingResult | null> {
  const randomEmail = `${randomUUID()}@${email.split("@")[1]}`
  const randomResult = await tryVerifyEmail(randomEmail, signal)

  if (randomResult.status === "error") {
    return {
      ...randomResult,
      message: "Random email verification failed",
    }
  }

  if (randomResult.status === "valid" || randomResult.status === "not_supported") {
    return {
      ...randomResult,
      status: "not_supported",
      message: "Detection not supported",
    }
  }

  return null
}

async function verifyDomain(smtp: string, email: string, smtpSupportMap: SmtpSupportMap, signal: AbortSignal): Promise<BouncerPingResult | null> {
  if (!smtpSupportMap.has(smtp)) {
    const domain = email.split("@")[1]
    const randomResult = await tryWithRandomEmail(smtp, email, signal)

    const now = new Date()
    await getDbCollection("bouncer.domain").updateOne(
      { domain, smtp },
      {
        $set: {
          ping: randomResult,
          updated_at: now,
        },
        $setOnInsert: {
          domain,
          smtp,
          created_at: now,
        },
      },
      { upsert: true }
    )

    smtpSupportMap.set(smtp, randomResult)
  }

  return smtpSupportMap.get(smtp)!
}

function getPingCacheTtl(ping: BouncerPingResult, now: Date): Date | null {
  switch (ping.status) {
    case "invalid":
      // Permanent : un email invalide le reste
      return null
    case "error":
      // TTL court : re-vérifié par le job de fond ou au plus tard après expiration
      return new Date(now.getTime() + ONE_DAY)
    default:
      return new Date(now.getTime() + 90 * ONE_DAY)
  }
}

async function persistPingResultCache(email: string, smtp: string | null, ping: BouncerPingResult): Promise<{ email: string; ping: BouncerPingResult }> {
  const now = new Date()

  await getDbCollection("bouncer.email").updateOne(
    { email },
    {
      $set: {
        domain: email.split("@")[1],
        smtp,
        ping,
        ttl: getPingCacheTtl(ping, now),
      },
      $setOnInsert: {
        _id: new ObjectId(),
        email,
        created_at: now,
      },
    },
    { upsert: true }
  )

  return { email, ping }
}

async function verifyEmail(email: string, domainMap: SmtpSupportMap, signal: AbortSignal): Promise<{ email: string; ping: BouncerPingResult }> {
  try {
    // Le cache bouncer.email est consulté en batch dans verifyEmails
    const smtp = await getSmtpServer(email)

    signal.throwIfAborted()

    if (!smtp) {
      return persistPingResultCache(email, null, {
        status: "invalid",
        message: "No SMTP server found for domain",
        responseCode: null,
        responseMessage: null,
      })
    }

    const domainResult = await verifyDomain(smtp, email, domainMap, signal)

    if (domainResult) {
      return { email, ping: domainResult }
    }

    return persistPingResultCache(email, smtp, await tryVerifyEmail(email, signal))
  } catch (err) {
    signal.throwIfAborted()

    captureException(err)
    logger.error(err, { email })

    return {
      email,
      ping: {
        status: "error",
        message: "Unknown error occurred",
        responseCode: null,
        responseMessage: null,
      },
    }
  }
}

const DOMAIN_MAP_CACHE_TTL_MS = 5 * 60 * 1000

let domainMapCache: { map: SmtpSupportMap; expiresAt: number } | null = null

async function getDomainMap(): Promise<SmtpSupportMap> {
  if (domainMapCache && domainMapCache.expiresAt > Date.now()) {
    return domainMapCache.map
  }

  const knownDomains = await getDbCollection("bouncer.domain")
    .find({
      "ping.status": { $ne: "error" },
    })
    .toArray()

  // La Map est partagée entre les appels : les domaines découverts par verifyDomain
  // pendant la durée du cache profitent aux batchs suivants
  const map: SmtpSupportMap = new Map(knownDomains.map((d) => [d.smtp, d.ping]))
  domainMapCache = { map, expiresAt: Date.now() + DOMAIN_MAP_CACHE_TTL_MS }

  return map
}

async function verifyEmailsSequentially(emails: string[], domainMap: SmtpSupportMap, signal: AbortSignal): Promise<{ email: string; ping: BouncerPingResult }[]> {
  const result: { email: string; ping: BouncerPingResult }[] = []

  for (const email of emails) {
    if (signal?.aborted) {
      throw signal.reason
    }

    result.push(await verifyEmail(email, domainMap, signal))
  }

  return result
}

export async function verifyEmails(emails: string[], signal: AbortSignal): Promise<{ email: string; ping: BouncerPingResult }[]> {
  if (emails.length === 0) {
    return []
  }

  const cachedDocs = await getDbCollection("bouncer.email")
    .find({ email: { $in: emails } }, { projection: { email: 1, ping: 1 } })
    .toArray()

  const cachedPings = new Map(cachedDocs.map((doc) => [doc.email, doc.ping]))

  const results: { email: string; ping: BouncerPingResult }[] = []
  const toVerify: string[] = []

  for (const email of emails) {
    const ping = cachedPings.get(email)
    if (ping) {
      results.push({ email, ping })
    } else {
      toVerify.push(email)
    }
  }

  if (toVerify.length === 0) {
    return results
  }

  const domainMap: Map<string, BouncerPingResult | null> = await getDomainMap()

  const perDomain = toVerify.reduce((acc, email) => {
    const domain = email.split("@")[1]
    if (!acc.has(domain)) {
      acc.set(domain, [])
    }

    acc.get(domain)!.push(email)

    return acc
  }, new Map<string, string[]>())

  const data = await mapWithConcurrency(Array.from(perDomain.values()), DOMAIN_CONCURRENCY, async (domainEmails) => verifyEmailsSequentially(domainEmails, domainMap, signal))

  return results.concat(data.flat())
}

import assert from "node:assert"

import type { Event } from "@sentry/node"
import * as Sentry from "@sentry/node"
import axios from "axios"
import nock from "nock"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { AKTO_AUTH_BASE_URL, aktoTokenProvider } from "../../src/common/apis/akto"
import { opcoEpTokenProvider } from "../../src/common/apis/opcoEp"
import { getSentryOptions } from "../../src/common/services/sentry/sentry"
import * as mongodbUtils from "../../src/common/utils/mongodbUtils"
import config from "../../src/config"
import * as personsActions from "../../src/modules/actions/persons.actions"
import { createUser, generateApiKey } from "../../src/modules/actions/users.actions"
import { resetValidationBreakers } from "../../src/modules/actions/validationProviders"
import type { Server } from "../../src/modules/server/server"
import createServer from "../../src/modules/server/server"
import { aktoMatch, aktoToken } from "../data/akto"
import { opcoEpSiretInconnu, opcoEptoken, opcoEpValidEmail } from "../data/opcoEp"
import { aktoTokenMock, aktoVerificationReplyMock } from "../utils/mocks/akto.mock"
import { opcoEpTokenMock, opcoEpVerificationReplyMock } from "../utils/mocks/opcoEp.mock"
import { useMongo } from "../utils/mongo.utils"

// Envois Sentry réels (config de production, hors profiling), interceptés au niveau du transport.
const envelopes: string[] = []

const email = "contact@entreprise.exemple.fr"
const siret = opcoEpValidEmail.siret
const siren = siret.substring(0, 9)
const aktoSecret = "SECRET-AKTO-TEST"
const opcoEpSecret = "SECRET-OPCO-EP-TEST"
const aktoAccessToken = "TOKEN-AKTO-TEST"
const opcoEpAccessToken = "TOKEN-OPCO-EP-TEST"
const sessionCookie = "SESSION-BAL-TEST"
const apiUserEmail = "compte-api@exemple.fr"

const sentEvents = (): Event[] =>
  envelopes.flatMap((envelope) =>
    envelope
      .split("\n")
      .slice(1)
      .flatMap((line) => {
        try {
          const item = JSON.parse(line)
          return item?.event_id && item.type !== "transaction" ? [item as Event] : []
        } catch {
          return []
        }
      })
  )

describe("Validation : contexte Sentry", () => {
  const mongo = useMongo()
  const defaultConfig = { akto: { ...config.akto }, opcoEp: { ...config.opcoEp }, validation: { ...config.validation } }
  let app: Server
  let baseUrl: string
  let apiKey: string
  let apiUserId: string

  beforeAll(async () => {
    const { integrations, ...options } = getSentryOptions()
    Sentry.init({
      ...options,
      dsn: "https://public@sentry.exemple.fr/1",
      // Toutes les requêtes sont tracées pour contrôler aussi les transactions, envoyées en production pour 1 % des requêtes.
      tracesSampler: () => 1,
      integrations: (integrations as Extract<NonNullable<typeof integrations>, unknown[]>).filter((integration) => integration.name !== "ProfilingIntegration"),
      transport: (transportOptions) =>
        Sentry.createTransport(transportOptions, async (request) => {
          envelopes.push(typeof request.body === "string" ? request.body : new TextDecoder().decode(request.body))
          return { statusCode: 200 }
        }),
    })
    nock.disableNetConnect()
    nock.enableNetConnect("127.0.0.1")
    app = await createServer()
    await Promise.all([app.ready(), mongo.beforeAll()])
    baseUrl = await app.listen({ port: 0, host: "127.0.0.1" })
  }, 20_000)

  beforeEach(async () => {
    await mongo.beforeEach()
    const apiUser = await createUser({ email: apiUserEmail, password: "my-password" })
    apiUserId = apiUser._id.toString()
    apiKey = await generateApiKey(apiUser)
    nock.cleanAll()
    envelopes.length = 0
    aktoTokenProvider.invalidate()
    opcoEpTokenProvider.invalidate()
    resetValidationBreakers()
    Object.assign(config.akto, { clientSecret: aktoSecret })
    Object.assign(config.opcoEp, { clientSecret: opcoEpSecret })
    config.validation.retries = 0
  })

  afterEach(() => {
    Object.assign(config.akto, defaultConfig.akto)
    Object.assign(config.opcoEp, defaultConfig.opcoEp)
    Object.assign(config.validation, defaultConfig.validation)
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    nock.enableNetConnect()
    await Promise.all([mongo.afterAll(), app.close()])
    await Sentry.close(2_000)
  })

  const postValidation = async () => {
    const response = await fetch(`${baseUrl}/api/v1/organisation/validation`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}`, cookie: `bal_session=${sessionCookie}` },
      body: JSON.stringify({ email, siret }),
    })
    await Sentry.flush(2_000)
    return response
  }

  const assertNothingSensitiveSent = () => {
    assert.ok(envelopes.length > 0, "aucun envoi Sentry capturé")
    const sent = envelopes.join("\n")
    for (const value of [email, siret, siren, aktoSecret, opcoEpSecret, aktoAccessToken, opcoEpAccessToken, apiKey, sessionCookie, apiUserEmail]) {
      expect(sent, `valeur envoyée à Sentry : ${value}`).not.toContain(value)
    }
  }

  it("groupe les échecs par fournisseur et par catégorie, avec statut, durée et tentatives", async () => {
    aktoTokenMock({ ...aktoToken, access_token: aktoAccessToken })
    aktoVerificationReplyMock(email, siren, 401, { error: "invalid_token" })
    opcoEpTokenMock({ ...opcoEptoken, access_token: opcoEpAccessToken })
    opcoEpVerificationReplyMock(email, siret, 500, { message: "indisponible" })

    assert.equal((await postValidation()).status, 200)

    const events = sentEvents().filter((event) => event.tags?.module === "validation")
    expect(events.map((event) => [event.tags?.provider, event.tags?.outcome, event.fingerprint])).toEqual([
      ["akto", "http_auth", ["validation", "akto", "http_auth"]],
      ["opco_ep", "http_5xx", ["validation", "opco_ep", "http_5xx"]],
    ])
    expect(events[0]?.contexts?.validation).toEqual({ provider: "akto", outcome: "http_auth", http_status: 401, duration_ms: expect.any(Number), attempts: 1 })
    expect(events[0]?.user).toEqual({ segment: "user", id: apiUserId, type: "standard" })
    assertNothingSensitiveSent()
  })

  it("remonte un échec d'écriture du cache sans l'opération MongoDB", async () => {
    vi.spyOn(personsActions, "importPerson").mockImplementationOnce(async () => {
      await mongodbUtils
        .getDbCollection("persons")
        .bulkWrite([{ updateOne: { filter: { email, siret, source: "AKTO" }, update: { $set: { ttl: "pas une date" as unknown as Date } }, upsert: true } }])
      return true
    })
    aktoTokenMock({ ...aktoToken, access_token: aktoAccessToken })
    aktoVerificationReplyMock(email, siren, 200, aktoMatch)

    assert.equal((await postValidation()).status, 200)

    const [event] = sentEvents().filter((sent) => sent.tags?.outcome === "cache_write")
    expect(event?.tags).toMatchObject({ module: "validation", provider: "internal", outcome: "cache_write" })
    expect(event?.contexts?.validation).toMatchObject({ source: "akto", error_name: "MongoBulkWriteError", error_code: 121 })
    assertNothingSensitiveSent()
  })

  it("rattache une panne de la base interne à la sous-source internal", async () => {
    const getDbCollection = mongodbUtils.getDbCollection
    vi.spyOn(mongodbUtils, "getDbCollection").mockImplementation(((name: Parameters<typeof getDbCollection>[0]) => {
      if (name === "persons") {
        throw new Error("connexion perdue")
      }
      return getDbCollection(name)
    }) as typeof getDbCollection)

    assert.equal((await postValidation()).status, 500)

    const [event] = sentEvents().filter((sent) => sent.tags?.module === "validation")
    expect(event?.fingerprint).toEqual(["validation", "internal", "database"])
    assertNothingSensitiveSent()
  })

  it("signale l'ouverture du circuit une seule fois", async () => {
    config.validation.breakerThreshold = 1
    aktoTokenMock({ ...aktoToken, access_token: aktoAccessToken })
    aktoVerificationReplyMock(email, siren, 503)
    opcoEpTokenMock({ ...opcoEptoken, access_token: opcoEpAccessToken })
    opcoEpVerificationReplyMock(email, siret, 200, opcoEpSiretInconnu)

    await postValidation()
    await postValidation()

    const circuitEvents = sentEvents().filter((event) => event.tags?.outcome === "circuit_open")
    expect(circuitEvents.map((event) => [event.tags?.provider, event.level, event.fingerprint])).toEqual([["akto", "warning", ["validation", "akto", "circuit_open"]]])
    assertNothingSensitiveSent()
  })

  it("n'envoie pas la query d'une requête entrante, ni dans l'erreur ni dans la transaction", async () => {
    const response = await fetch(`${baseUrl}/api/healthcheck/sentry?contact=${encodeURIComponent(email)}&siret=${siret}`, {
      headers: { cookie: `bal_session=${sessionCookie}` },
    })
    await Sentry.flush(2_000)

    assert.equal(response.status, 500)
    assert.ok(
      envelopes.some((envelope) => envelope.includes('"type":"transaction"')),
      "aucune transaction capturée"
    )
    assertNothingSensitiveSent()
  })

  it("ne modifie pas les objets de l'application en masquant ce qui part vers Sentry", async () => {
    const payload = { contact: email, siret }
    const args = [email]
    console.info(payload, args)
    const error = Object.assign(new Error(`échec pour ${email}`), { config: { headers: { Authorization: `Bearer ${aktoAccessToken}` }, params: { email } } })
    const extra = { payload: { contact: email, token: aktoAccessToken } }
    Sentry.captureException(error, { extra })
    await Sentry.flush(2_000)

    expect(payload).toEqual({ contact: email, siret })
    expect(args).toEqual([email])
    expect(error.message).toBe(`échec pour ${email}`)
    expect(error.config).toEqual({ headers: { Authorization: `Bearer ${aktoAccessToken}` }, params: { email } })
    expect(extra).toEqual({ payload: { contact: email, token: aktoAccessToken } })
    assertNothingSensitiveSent()
  })

  it("ne transmet ni secret ni token d'une erreur axios brute d'appel authentifié", async () => {
    nock(AKTO_AUTH_BASE_URL).post(/token/).reply(400, { error: "invalid_client" })
    const error = await axios
      .post(`${AKTO_AUTH_BASE_URL}/tenant/oauth2/v2.0/token`, `grant_type=client_credentials&client_secret=${aktoSecret}&scope=api`, {
        headers: { Authorization: `Bearer ${aktoAccessToken}`, "Content-Type": "application/x-www-form-urlencoded" },
        params: { email },
      })
      .catch((err: unknown) => err)

    Sentry.captureException(error)
    await Sentry.flush(2_000)

    assertNothingSensitiveSent()
  })
})

import assert from "node:assert"

import { setTimeout as sleep } from "node:timers/promises"
import { addDays } from "date-fns"
import nock from "nock"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { AKTO_API_BASE_URL, aktoTokenProvider } from "../../src/common/apis/akto"
import { opcoEpTokenProvider } from "../../src/common/apis/opcoEp"
import logger from "../../src/common/logger"
import config from "../../src/config"
import { importOrganisation } from "../../src/modules/actions/organisations.actions"
import * as personsActions from "../../src/modules/actions/persons.actions"
import { createUser, generateApiKey } from "../../src/modules/actions/users.actions"
import { resetValidationBreakers } from "../../src/modules/actions/validationProviders"
import type { Server } from "../../src/modules/server/server"
import createServer from "../../src/modules/server/server"
import { aktoMatch, aktoNotMatch, aktoValid } from "../data/akto"
import { opcoEpEmailOuDomaineInconnu, opcoEpEmailTrouve, opcoEpInvalid, opcoEpSiretInconnu, opcoEpValidDomain, opcoEpValidEmail } from "../data/opcoEp"
import {
  aktoTokenDelayedMock,
  aktoTokenErrorMock,
  aktoTokenMock,
  aktoTokenSequenceMock,
  aktoVerificationDelayedMock,
  aktoVerificationMock,
  aktoVerificationNetworkErrorMock,
  aktoVerificationReplyMock,
  aktoVerificationSequenceMock,
} from "../utils/mocks/akto.mock"
import { opcoEpTokenMock, opcoEpTokenSequenceMock, opcoEpVerificationMock, opcoEpVerificationReplyMock, opcoEpVerificationSequenceMock } from "../utils/mocks/opcoEp.mock"
import { useMongo } from "../utils/mongo.utils"

let userToken: string

describe("Organisations", () => {
  const mongo = useMongo()
  let app: Server

  beforeAll(async () => {
    nock.disableNetConnect()
    app = await createServer()
    await Promise.all([app.ready(), mongo.beforeAll()])
  }, 15_000)

  beforeEach(async () => {
    await mongo.beforeEach()

    const user = await createUser({
      email: "connected@exemple.fr",
      password: "my-password",
    })

    userToken = await generateApiKey(user)
    nock.cleanAll()
    aktoTokenProvider.invalidate()
    opcoEpTokenProvider.invalidate()
    resetValidationBreakers()
  })

  afterAll(async () => {
    vi.restoreAllMocks()
    nock.enableNetConnect()
    await Promise.all([mongo.afterAll(), app.close()])
  })

  describe("Validation Akto", () => {
    it("should be valid for correct email and domain", async () => {
      const tokenMock = aktoTokenMock()
      const verificationMock = aktoVerificationMock(aktoValid.email, aktoValid.siren)

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: {
          email: aktoValid.email,
          siret: `${aktoValid.siren}00000`,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      tokenMock.done()
      verificationMock.done()

      assert.equal(response.json().is_valid, true)
      assert.equal(response.json().on, "email")
    })
  })

  describe("Validation OPCO EP", () => {
    it("should be valid for correct email and domain", async () => {
      const tokenMock = opcoEpTokenMock()
      const verificationMock = opcoEpVerificationMock(opcoEpValidEmail.email, opcoEpValidEmail.siret)

      const tokenMockAkto = aktoTokenMock()
      const verificationMockAkto = aktoVerificationMock(opcoEpValidEmail.email, opcoEpValidEmail.siret.substring(0, 9))

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpValidEmail,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      assert.equal(response.json().is_valid, true)
      assert.equal(response.json().on, "email")

      tokenMock.done()
      verificationMock.done()

      tokenMockAkto.done()
      verificationMockAkto.done()
    })

    it("should be valid for correct domain", async () => {
      const tokenMock = opcoEpTokenMock()
      const verificationMock = opcoEpVerificationMock(opcoEpValidDomain.email, opcoEpValidDomain.siret)

      const tokenMockAkto = aktoTokenMock()
      const verificationMockAkto = aktoVerificationMock(opcoEpValidDomain.email, opcoEpValidDomain.siret.substring(0, 9))

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpValidDomain,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      tokenMock.done()
      verificationMock.done()

      tokenMockAkto.done()
      verificationMockAkto.done()

      assert.equal(response.json().is_valid, true)
      assert.equal(response.json().on, "domain")
    })

    it("should not be valid for incorrect email and domain", async () => {
      const tokenMock = opcoEpTokenMock()
      const verificationMock = opcoEpVerificationMock(opcoEpInvalid.email, opcoEpInvalid.siret)

      const tokenMockAkto = aktoTokenMock()
      const verificationMockAkto = aktoVerificationMock(opcoEpInvalid.email, opcoEpInvalid.siret.substring(0, 9))

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpInvalid,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      assert.equal(response.statusCode, 400)
      assert.deepEqual(response.json(), {
        data: {
          validationError: [
            {
              instancePath: "/siret",
              keyword: "custom",
              message: "SIRET does not pass the Luhn algorithm",
              params: {},
              schemaPath: "#/siret/custom",
            },
          ],
        },
        message: "Request validation failed",
        name: "Bad Request",
        statusCode: 400,
      })

      // We didn't call APIs
      tokenMock.pendingMocks()
      verificationMock.pendingMocks()

      tokenMockAkto.pendingMocks()
      verificationMockAkto.pendingMocks()
    })
  })

  describe("Validation : état de la réponse", () => {
    const siret = opcoEpValidEmail.siret
    const siren = siret.substring(0, 9)
    const email = "contact@entreprise.exemple.fr"

    const postValidation = async (payload: { email: string; siret: string }) => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      assert.equal(response.statusCode, 200)
      return response.json()
    }

    it.each([
      ["email ou domaine inconnu (code 3)", opcoEpEmailOuDomaineInconnu],
      ["SIRET inconnu (code 4)", opcoEpSiretInconnu],
    ])("renvoie invalid quand AKTO ne trouve pas et qu'OPCO EP répond %s", async (_label, opcoEpResponse) => {
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 200, aktoNotMatch)
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, 200, opcoEpResponse)

      assert.deepEqual(await postValidation({ email, siret }), { status: "invalid", is_valid: false, is_company_email: true })
    })

    it("renvoie valid quand AKTO est indisponible mais qu'OPCO EP valide", async () => {
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 503)
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, 200, opcoEpEmailTrouve)

      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["opco_ep"] })
    })

    it.each([
      ["AKTO répond 500", () => [aktoTokenMock(), aktoVerificationReplyMock(email, siren, 500)], ["akto"]],
      ["le token AKTO est refusé", () => [aktoTokenErrorMock(401)], ["akto"]],
      ["la connexion à AKTO est coupée", () => [aktoTokenMock(), aktoVerificationNetworkErrorMock(email, siren)], ["akto"]],
      ["AKTO répond hors contrat", () => [aktoTokenMock(), aktoVerificationReplyMock(email, siren, 200, { data: {} })], ["akto"]],
    ])("renvoie indeterminate quand %s et qu'OPCO EP ne trouve pas", async (_label, mockAkto, unavailableSources) => {
      mockAkto()
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, 200, opcoEpSiretInconnu)

      assert.deepEqual(await postValidation({ email, siret }), {
        status: "indeterminate",
        is_valid: false,
        is_company_email: true,
        unavailable_sources: unavailableSources,
      })
    })

    it.each([
      ["OPCO EP répond 401", 401, undefined],
      ["OPCO EP répond un code retour inconnu", 200, { codeRetour: 0, detailRetour: "inconnu" }],
    ])("renvoie indeterminate quand AKTO ne trouve pas et que %s", async (_label, status, body) => {
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 200, aktoNotMatch)
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, status, body)

      assert.deepEqual(await postValidation({ email, siret }), {
        status: "indeterminate",
        is_valid: false,
        is_company_email: true,
        unavailable_sources: ["opco_ep"],
      })
    })

    it("liste les deux fournisseurs quand aucun ne répond", async () => {
      aktoTokenErrorMock(503)
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, 500)

      assert.deepEqual(await postValidation({ email, siret }), {
        status: "indeterminate",
        is_valid: false,
        is_company_email: true,
        unavailable_sources: ["akto", "opco_ep"],
      })
    })

    it("renvoie une validation AKTO en cache avec la même valeur que unavailable_sources", async () => {
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 200, aktoMatch)
      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })

      nock.cleanAll()
      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
    })

    it("garde la validation AKTO quand l'écriture du cache échoue", async () => {
      vi.spyOn(personsActions, "importPerson").mockRejectedValueOnce(new Error("écriture impossible"))
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 200, aktoMatch)
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(email, siret, 200, opcoEpSiretInconnu)

      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
    })

    it("renvoie les sources de l'organisation trouvée par domaine", async () => {
      await importOrganisation({ email: "rh@entreprise.exemple.fr", siret, source: "catalogue", ttl: addDays(new Date(), 30) })

      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "domain", sources: ["catalogue"] })
    })

    it("transmet un e-mail contenant un + sans l'altérer", async () => {
      const emailWithPlus = "prenom+alternance@entreprise.exemple.fr"
      aktoTokenMock()
      aktoVerificationReplyMock(emailWithPlus, siren, 200, aktoMatch)

      assert.deepEqual(await postValidation({ email: emailWithPlus, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
    })
  })

  describe("Validation : résilience des fournisseurs", () => {
    const siret = opcoEpValidEmail.siret
    const siren = siret.substring(0, 9)
    const email = "contact@entreprise.exemple.fr"
    const defaultValidationConfig = { ...config.validation }

    beforeEach(() => {
      config.validation.retryDelayMs = 0
    })

    afterEach(() => {
      Object.assign(config.validation, defaultValidationConfig)
      vi.restoreAllMocks()
    })

    const postValidation = async (payload: { email: string; siret: string }) => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      assert.equal(response.statusCode, 200)
      return response.json()
    }

    const mockOpcoEpSiretInconnu = (forEmail = email) => {
      opcoEpTokenMock()
      opcoEpVerificationReplyMock(forEmail, siret, 200, opcoEpSiretInconnu)
    }

    it("retente une fois un 503 d'AKTO puis valide", async () => {
      aktoTokenMock()
      const verification = aktoVerificationSequenceMock(email, siren, [{ status: 503 }, { status: 200, body: aktoMatch }])

      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
      assert.equal(verification.isDone(), true)
    })

    it.each([
      ["un 401", { status: 401 }, { status: "indeterminate", is_valid: false, is_company_email: true, unavailable_sources: ["akto"] }],
      ["une réponse métier négative", { status: 200, body: aktoNotMatch }, { status: "invalid", is_valid: false, is_company_email: true }],
    ])("ne retente pas %s d'AKTO", async (_label, firstReply, expected) => {
      aktoTokenMock()
      const verification = aktoVerificationSequenceMock(email, siren, [firstReply, { status: 200, body: aktoMatch }])
      mockOpcoEpSiretInconnu()

      assert.deepEqual(await postValidation({ email, siret }), expected)
      assert.equal(verification.pendingMocks().length, 1)
    })

    it("réutilise le token AKTO d'une validation à l'autre", async () => {
      const otherEmail = "rh@entreprise.exemple.fr"
      const token = aktoTokenSequenceMock(1)
      aktoVerificationReplyMock(email, siren, 200, aktoNotMatch)
      aktoVerificationReplyMock(otherEmail, siren, 200, aktoNotMatch)
      mockOpcoEpSiretInconnu()
      mockOpcoEpSiretInconnu(otherEmail)

      assert.equal((await postValidation({ email, siret })).status, "invalid")
      assert.equal((await postValidation({ email: otherEmail, siret })).status, "invalid")
      assert.equal(token.isDone(), true)
    })

    it("redemande un token AKTO après un 401", async () => {
      const token = aktoTokenSequenceMock(2)
      aktoVerificationSequenceMock(email, siren, [{ status: 401 }, { status: 200, body: aktoMatch }])
      mockOpcoEpSiretInconnu()

      assert.equal((await postValidation({ email, siret })).status, "indeterminate")
      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
      assert.equal(token.isDone(), true)
    })

    it("redemande un token OPCO EP après un 401", async () => {
      aktoTokenMock()
      aktoVerificationReplyMock(email, siren, 200, aktoNotMatch)
      const token = opcoEpTokenSequenceMock(2)
      opcoEpVerificationSequenceMock(email, siret, [{ status: 401 }, { status: 200, body: opcoEpEmailTrouve }])

      assert.equal((await postValidation({ email, siret })).status, "indeterminate")
      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["opco_ep"] })
      assert.equal(token.isDone(), true)
    })

    it("coupe un appel de token qui dépasse le timeout par appel", async () => {
      config.validation.providerTimeoutMs = 100
      aktoTokenDelayedMock(500)
      aktoVerificationReplyMock(email, siren, 200, aktoMatch)
      mockOpcoEpSiretInconnu()

      assert.deepEqual(await postValidation({ email, siret }), { status: "indeterminate", is_valid: false, is_company_email: true, unavailable_sources: ["akto"] })
    })

    it("répond avant l'échéance de la cascade, sans appeler OPCO EP quand le budget est épuisé", async () => {
      config.validation.budgetMs = 300
      aktoTokenMock()
      aktoVerificationDelayedMock(email, siren, 1_000, aktoMatch)
      const opcoEpToken = opcoEpTokenMock()

      const startedAt = Date.now()
      assert.deepEqual(await postValidation({ email, siret }), {
        status: "indeterminate",
        is_valid: false,
        is_company_email: true,
        unavailable_sources: ["akto", "opco_ep"],
      })
      expect(Date.now() - startedAt).toBeLessThan(800)
      assert.equal(opcoEpToken.isDone(), false)
    })

    it("n'appelle plus AKTO une fois le circuit ouvert, puis le rappelle après la fenêtre", async () => {
      config.validation.retries = 0
      config.validation.breakerThreshold = 2
      config.validation.breakerCooldownMs = 100
      let aktoCalls = 0
      let aktoUp = false
      aktoTokenMock()
      nock(AKTO_API_BASE_URL)
        .persist()
        .get("/Relations/Validation")
        .query({ email, siren })
        .reply(() => {
          aktoCalls++
          return aktoUp ? [200, aktoMatch] : [500]
        })
      mockOpcoEpSiretInconnu()

      for (let i = 0; i < 3; i++) {
        assert.deepEqual((await postValidation({ email, siret })).unavailable_sources, ["akto"])
      }
      assert.equal(aktoCalls, 2)

      aktoUp = true
      await sleep(150)
      assert.deepEqual(await postValidation({ email, siret }), { status: "valid", is_valid: true, on: "email", sources: ["akto"] })
      assert.equal(aktoCalls, 3)
    })

    it("journalise chaque appel fournisseur sans donnée de la requête", async () => {
      const info = vi.spyOn(logger, "info")
      const warn = vi.spyOn(logger, "warn")
      aktoTokenMock()
      aktoVerificationSequenceMock(email, siren, [{ status: 503 }, { status: 200, body: aktoMatch }])

      await postValidation({ email, siret })

      const providerLogs = [...warn.mock.calls, ...info.mock.calls].filter(([, msg]) => msg === "appel fournisseur de validation").map(([entry]) => entry)
      expect(providerLogs).toEqual([
        { module: "validation", provider: "akto", outcome: "http_5xx", attempt: 1, duration_ms: expect.any(Number), http_status: 503 },
        { module: "validation", provider: "akto", outcome: "match", attempt: 2, duration_ms: expect.any(Number) },
      ])
      const serialized = JSON.stringify(providerLogs)
      for (const personalData of [email, siret, siren, "entreprise.exemple.fr"]) {
        expect(serialized).not.toContain(personalData)
      }
    })
  })
})

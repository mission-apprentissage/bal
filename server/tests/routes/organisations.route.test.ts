import assert from "node:assert"

import { addDays } from "date-fns"
import nock from "nock"
import { afterAll, beforeAll, beforeEach, describe, it, vi } from "vitest"

import { importOrganisation } from "../../src/modules/actions/organisations.actions"
import * as personsActions from "../../src/modules/actions/persons.actions"
import { createUser, generateApiKey } from "../../src/modules/actions/users.actions"
import type { Server } from "../../src/modules/server/server"
import createServer from "../../src/modules/server/server"
import { aktoMatch, aktoNotMatch, aktoValid } from "../data/akto"
import { opcoEpEmailOuDomaineInconnu, opcoEpEmailTrouve, opcoEpInvalid, opcoEpSiretInconnu, opcoEpValidDomain, opcoEpValidEmail } from "../data/opcoEp"
import { aktoTokenErrorMock, aktoTokenMock, aktoVerificationMock, aktoVerificationNetworkErrorMock, aktoVerificationReplyMock } from "../utils/mocks/akto.mock"
import { opcoEpTokenMock, opcoEpVerificationMock, opcoEpVerificationReplyMock } from "../utils/mocks/opcoEp.mock"
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
})

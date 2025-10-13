import assert from "node:assert";

import nock from "nock";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

import { createUser, generateApiKey } from "../../src/modules/actions/users.actions";
import type { Server } from "../../src/modules/server/server";
import createServer from "../../src/modules/server/server";
import { aktoValid } from "../data/akto";
import { opcoEpInvalid, opcoEpValidDomain, opcoEpValidEmail } from "../data/opcoEp";
import { aktoTokenMock, aktoVerificationMock } from "../utils/mocks/akto.mock";
import { opcoEpTokenMock, opcoEpVerificationMock } from "../utils/mocks/opcoEp.mock";
import { useMongo } from "../utils/mongo.utils";

let userToken: string;

describe("Organisations", () => {
  const mongo = useMongo();
  let app: Server;

  beforeAll(async () => {
    app = await createServer();
    await Promise.all([app.ready(), mongo.beforeAll()]);
  }, 15_000);

  beforeEach(async () => {
    await mongo.beforeEach();

    const user = await createUser({
      email: "connected@exemple.fr",
      password: "my-password",
    });

    userToken = await generateApiKey(user);
    nock.cleanAll();
  });

  afterAll(async () => {
    await Promise.all([mongo.afterAll(), app.close()]);
  });

  describe("Validation Akto", () => {
    it("should be valid for correct email and domain", async () => {
      const tokenMock = aktoTokenMock();
      const verificationMock = aktoVerificationMock(aktoValid.email, aktoValid.siren);

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
      });

      tokenMock.done();
      verificationMock.done();

      assert.equal(response.json().is_valid, true);
      assert.equal(response.json().on, "email");
    });
  });

  describe("Validation OPCO EP", () => {
    it("should be valid for correct email and domain", async () => {
      const tokenMock = opcoEpTokenMock();
      const verificationMock = opcoEpVerificationMock(opcoEpValidEmail.email, opcoEpValidEmail.siret);

      const tokenMockAkto = aktoTokenMock();
      const verificationMockAkto = aktoVerificationMock(opcoEpValidEmail.email, opcoEpValidEmail.siret.substring(0, 9));

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpValidEmail,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      assert.equal(response.json().is_valid, true);
      assert.equal(response.json().on, "email");

      tokenMock.done();
      verificationMock.done();

      tokenMockAkto.done();
      verificationMockAkto.done();
    });

    it("should be valid for correct domain", async () => {
      const tokenMock = opcoEpTokenMock();
      const verificationMock = opcoEpVerificationMock(opcoEpValidDomain.email, opcoEpValidDomain.siret);

      const tokenMockAkto = aktoTokenMock();
      const verificationMockAkto = aktoVerificationMock(
        opcoEpValidDomain.email,
        opcoEpValidDomain.siret.substring(0, 9)
      );

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpValidDomain,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      tokenMock.done();
      verificationMock.done();

      tokenMockAkto.done();
      verificationMockAkto.done();

      assert.equal(response.json().is_valid, true);
      assert.equal(response.json().on, "domain");
    });

    it("should not be valid for incorrect email and domain", async () => {
      const tokenMock = opcoEpTokenMock();
      const verificationMock = opcoEpVerificationMock(opcoEpInvalid.email, opcoEpInvalid.siret);

      const tokenMockAkto = aktoTokenMock();
      const verificationMockAkto = aktoVerificationMock(opcoEpInvalid.email, opcoEpInvalid.siret.substring(0, 9));

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/organisation/validation",
        payload: opcoEpInvalid,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      assert.equal(response.statusCode, 400);
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
      });

      // We didn't call APIs
      tokenMock.pendingMocks();
      verificationMock.pendingMocks();

      tokenMockAkto.pendingMocks();
      verificationMockAkto.pendingMocks();
    });
  });
});

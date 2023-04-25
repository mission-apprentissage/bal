import assert from "node:assert";

import { parseContentLine } from "../../src/modules/actions/deca.actions";

describe("DECA file", () => {
  it("should parse correct line", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,email2@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev", "email2@test.dev"],
      }
    );
  });
  it("should remove incorrect emails", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );

    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,NULL}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,not-email1@test.}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev"],
      }
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{}",
      }),
      undefined
    );
  });
  it("should remove duplicate emails", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "12345678901234",
        EMAIL: "{email1@test.dev,email2@test.dev,email1@test.dev}",
      }),
      {
        siret: "12345678901234",
        emails: ["email1@test.dev", "email2@test.dev"],
      }
    );
  });

  it("should not parse line with incorrect siret", async () => {
    assert.deepEqual(
      parseContentLine({
        SIRET: "notsiret",
        EMAIL: "{email1@test.dev}",
      }),
      undefined
    );
    assert.deepEqual(
      parseContentLine({
        SIRET: "(6 rows);;",
        EMAIL: "{email1@test.dev}",
      }),
      undefined
    );
  });
});

import assert from "node:assert";

import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

import { getDbVerification, importDecaContent, parseContentLine } from "../../src/modules/actions/deca.actions";
import { findOrganisations } from "../../src/modules/actions/organisations.actions";
import { findPersons } from "../../src/modules/actions/persons.actions";
import { buildPeriodsToFetch, NB_JOURS_MAX_PERIODE_FETCH } from "../../src/modules/jobs/deca/hydrate-deca";
import { deepFlattenToObject } from "../../src/modules/jobs/deca/hydrate-deca-history";
import { useMongo } from "../utils/mongo.utils";

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

describe("DECA import", () => {
  const mongo = useMongo();

  beforeAll(async () => {
    await mongo.beforeAll();
  });

  beforeEach(async () => {
    await mongo.beforeEach();
  });

  afterAll(async () => {
    await mongo.afterAll();
  });

  it("should import DECA content", async () => {
    await importDecaContent(["test1@company.com", "test2@company.com"], "12345678901234");
    await importDecaContent(["test1@company.com"], "12345678900000");

    const persons = await findPersons({});
    const organisations = await findOrganisations({});

    assert.equal(persons.length, 2);
    const p1 = persons.find((p) => p.email === "test1@company.com");
    assert.ok(p1);
    assert.ok(p1.sirets?.includes("12345678901234"));
    assert.ok(p1.sirets?.includes("12345678900000"));

    const p2 = persons.find((p) => p.email === "test2@company.com");
    assert.ok(p2);
    assert.ok(p2.sirets?.includes("12345678901234"));

    assert.equal(organisations.length, 1);
    assert.equal(organisations[0].siren, "123456789");

    assert.equal(organisations[0].email_domains?.length, 1);
    assert.ok(organisations[0].email_domains?.includes("company.com"));

    assert.equal(organisations[0].etablissements?.length, 2);
    assert.ok(organisations[0].etablissements?.find((e) => e.siret === "12345678901234"));
    assert.ok(organisations[0].etablissements?.find((e) => e.siret === "12345678900000"));
  });
});

describe("DECA verification", () => {
  const mongo = useMongo();

  beforeAll(async () => {
    await mongo.beforeAll();
  });

  beforeEach(async () => {
    await mongo.beforeEach();
  });

  afterAll(async () => {
    await mongo.afterAll();
  });

  it("should be valid SIRET email", async () => {
    await importDecaContent(["test1@company.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678901234", "test1@company.com"), {
      is_valid: true,
      on: "email",
    });

    await importDecaContent(["test1@gmail.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678901234", "test1@gmail.com"), {
      is_valid: true,
      on: "email",
    });
  });

  it("should be valid SIRET domain", async () => {
    await importDecaContent(["test1@company.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678901234", "test3@company.com"), {
      is_valid: true,
      on: "domain",
    });
  });

  it("should be valid SIREN email", async () => {
    await importDecaContent(["test1@company.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678999999", "test2@company.com"), {
      is_valid: true,
      on: "email",
    });
    await importDecaContent(["test1@gmail.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678999999", "test1@gmail.com"), {
      is_valid: true,
      on: "email",
    });
  });

  it("should be valid SIREN domain", async () => {
    await importDecaContent(["test1@company.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678999999", "test3@company.com"), {
      is_valid: true,
      on: "domain",
    });
  });

  it("should not be valid SIRET domain if blacklisted", async () => {
    await importDecaContent(["test1@gmail.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678901234", "test3@gmail.com"), {
      is_valid: false,
    });
  });

  it("should not be valid SIREN domain if blacklisted", async () => {
    await importDecaContent(["test1@gmail.com", "test2@company.com"], "12345678901234");

    assert.deepEqual(await getDbVerification("12345678999999", "test3@gmail.com"), {
      is_valid: false,
    });
  });
});

describe("IMPORT DECA from API", () => {
  const mongo = useMongo();

  beforeAll(async () => {
    await mongo.beforeAll();
  });

  beforeEach(async () => {
    await mongo.beforeEach();
  });

  afterAll(async () => {
    await mongo.afterAll();
  });

  it("periods to fetch OK", () => {
    const periods1 = buildPeriodsToFetch(new Date("2024-01-01"), new Date("2024-01-04"));
    assert.deepEqual(periods1, [
      { dateDebut: "2024-01-01", dateFin: "2024-01-02" },
      { dateDebut: "2024-01-02", dateFin: "2024-01-03" },
      { dateDebut: "2024-01-03", dateFin: "2024-01-04" },
    ]);

    const periods2 = buildPeriodsToFetch(new Date("2024-01-01"), new Date("2024-03-01"));
    assert.deepEqual(periods2.length, NB_JOURS_MAX_PERIODE_FETCH);
    assert.deepEqual(periods2[0], { dateDebut: "2024-01-01", dateFin: "2024-01-02" });
    assert.deepEqual(periods2[NB_JOURS_MAX_PERIODE_FETCH - 1], { dateDebut: "2024-01-30", dateFin: "2024-01-31" });
  });

  // buildDecaContrat

  it("deepFlattenToObject works as expected", async () => {
    const nestedObj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: 4,
        },
      },
      g: 5,
    };

    const expectedOutput = {
      a: 1,
      "b.c": 2,
      "b.d.e": 3,
      "b.d.f": 4,
      g: 5,
    };

    assert.deepEqual(deepFlattenToObject(nestedObj), expectedOutput);
    assert.deepEqual(deepFlattenToObject({}), {});
    assert.deepEqual(deepFlattenToObject({ a: 1, b: 2 }), { a: 1, b: 2 });
    assert.deepEqual(deepFlattenToObject({ a: 1, b: { c: 2, d: null } }), { a: 1, "b.c": 2, "b.d": null });
  });
});

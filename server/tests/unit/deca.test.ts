import assert from "node:assert";

import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

import { getDbVerification, importDecaContent, parseContentLine } from "../../src/modules/actions/deca.actions";
import { findOrganisations } from "../../src/modules/actions/organisations.actions";
import { findPersons } from "../../src/modules/actions/persons.actions";
import { buildDecaContract, buildPeriodsToFetch, isDecaApiAvailable } from "../../src/modules/jobs/deca/hydrate-deca";
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

  it("periods to fetch OK", async () => {
    const periods1 = await buildPeriodsToFetch(new Date("2024-01-01"), new Date("2024-01-04"));
    assert.deepEqual(periods1, [
      { dateDebut: "2024-01-01", dateFin: "2024-01-02" },
      { dateDebut: "2024-01-02", dateFin: "2024-01-03" },
      { dateDebut: "2024-01-03", dateFin: "2024-01-04" },
    ]);

    // TODO: ajouter des tests sur ces éléments
    // { start: new Date("2024-01-01T00:00:00.00Z"), end: new Date("2024-01-04T23:00:00.00Z") }
    // { start: new Date("2024-07-01T00:00:00.00+02:00"), end: new Date("2024-07-04T23:00:00.00+02:00") }
  });

  it("building deca contract OK", () => {
    const rawContractFromApi = {
      alternant: {
        dateNaissance: "1999-11-07",
        nom: "NOM",
        prenom: "PRENOM",
        sexe: "H",
        departementNaissance: "031",
        nationalite: 1,
        handicap: true,
        courriel: "alternant@alternant.fr",
        telephone: "",
        adresse: {
          numero: 5,
          voie: "2 RUE DE LA RUE",
          codePostal: "31000",
        },
        derniereClasse: "01",
      },
      formation: {
        rncp: "RNCP35400",
        codeDiplome: "32031102",
        intituleOuQualification: "TRANSPORT ET PRESTATION LOGISTIQUES (BTS)",
        typeDiplome: "54",
        dateDebutFormation: "2023-09-11",
        dateFinFormation: "2025-06-27",
      },
      etablissementFormation: { siret: "12345678912345" },
      organismeFormationResponsable: { siret: "12345678912345", uaiCfa: "01234567" },
      employeur: {
        siret: "12345678912345",
        adresse: { codePostal: "91920" },
        naf: "5210B",
        codeIdcc: "0016",
        nombreDeSalaries: 74,
        courriel: "test@test.com",
        telephone: "0102030405",
        denomination: "BIDULE LOGISTIQUES",
        typeEmployeur: 11,
        employeurSpecifique: 0,
      },
      detailsContrat: {
        dispositif: "APPR",
        noContrat: "031202310001351",
        dateEffetAvenant: "2023-09-18",
        noAvenant: "031202310001351",
        statut: "Rompu",
        dateDebutContrat: "2023-09-18",
        dateFinContrat: "2025-06-27",
        typeContrat: 11,
        typeDerogation: 99,
      },
      rupture: { dateEffetRupture: "2023-12-21" },
    };

    const expectedRefinedContractForBal = {
      alternant: {
        date_naissance: new Date("1999-11-07T00:00:00.000+02:00"),
        nom: "NOM",
        prenom: "PRENOM",
        sexe: "H",
        departement_naissance: "031",
        nationalite: 1,
        handicap: false,
        courriel: "alternant@alternant.fr",
        adresse: { numero: 5, voie: "2 RUE DE LA RUE", code_postal: "31000" },
        derniere_classe: "01",
      },
      formation: {
        date_debut_formation: new Date("2023-09-11T00:00:00.000+02:00"),
        date_fin_formation: new Date("2025-06-27T00:00:00.000+02:00"),
        code_diplome: "32031102",
        intitule_ou_qualification: "TRANSPORT ET PRESTATION LOGISTIQUES (BTS)",
        rncp: "RNCP35400",
        type_diplome: "54",
      },
      etablissement_formation: { siret: "12345678912345" },
      organisme_formation: { uai_cfa: "01234567", siret: "12345678912345" },
      employeur: {
        code_idcc: "0016",
        siret: "12345678912345",
        adresse: { code_postal: "91920" },
        naf: "5210B",
        nombre_de_salaries: 74,
        courriel: "test@test.com",
        telephone: "0102030405",
        denomination: "BIDULE LOGISTIQUES",
      },
      no_contrat: "031202310001351",
      type_contrat: "11",
      date_effet_rupture: new Date("2023-12-21T00:00:00.000+02:00"),
      dispositif: "APPR",
      date_debut_contrat: new Date("2023-09-18T00:00:00.000+02:00"),
      date_fin_contrat: new Date("2025-06-27T00:00:00.000+02:00"),
      date_effet_avenant: new Date("2023-09-18T00:00:00.000+02:00"),
      no_avenant: "031202310001351",
      statut: "Rompu",
    };

    const refinedContractForBal = buildDecaContract(rawContractFromApi);

    assert.deepEqual(refinedContractForBal, expectedRefinedContractForBal);
  });

  it("should not start when time is over", async () => {
    assert.equal(isDecaApiAvailable({ forceStartHour: 6, forceProductionEnvironment: "forceProduction" }), true);
    assert.equal(isDecaApiAvailable({ forceStartHour: 19, forceProductionEnvironment: "forceProduction" }), true);
    assert.equal(isDecaApiAvailable({ forceStartHour: 12, forceProductionEnvironment: "forceProduction" }), true);
    assert.equal(isDecaApiAvailable({ forceStartHour: 5, forceProductionEnvironment: "forceProduction" }), false);
    assert.equal(isDecaApiAvailable({ forceStartHour: 20, forceProductionEnvironment: "forceProduction" }), false);
  });

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

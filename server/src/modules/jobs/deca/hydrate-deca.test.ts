import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import { ZDeca } from "shared/models/deca.model/deca.model";

import { buildDecaContract } from "./hydrate-deca";

describe("buildDecaContract", () => {
  it("should map a fully populated Deca contract, including rupture and fin de contrat réelle", () => {
    const contrat = {
      alternant: {
        nom: "Dupont",
        prenom: "Jean",
        sexe: "1",
        dateNaissance: "1995-05-20",
        departementNaissance: "75",
        nationalite: "1",
        handicap: "true",
        courriel: "jean.dupont@exemple.fr",
        telephone: "0601020304",
        adresse: {
          numero: "12",
          voie: "Rue de la Paix",
          codePostal: "75002",
        },
        derniereClasse: "3",
      },
      formation: {
        dateDebutFormation: "2023-09-01",
        dateFinFormation: "2025-09-01",
        codeDiplome: "50033610",
        intituleOuQualification: "BTS Services Informatiques aux Organisations",
        rncp: "RNCP12345",
        typeDiplome: "BTS",
      },
      etablissementFormation: {
        siret: "73282932000074",
      },
      organismeFormationResponsable: {
        uaiCfa: "0123456B",
        siret: "39837262500017",
      },
      employeur: {
        codeIdcc: "1596",
        siret: "80478874200011",
        adresse: {
          codePostal: "75001",
        },
        naf: "6201Z",
        nombreDeSalaries: 50,
        courriel: "contact@exemple.fr",
        telephone: "0102030405",
        denomination: "ACME SARL",
        typeEmployeur: 1,
      },
      detailsContrat: {
        noContrat: "123456789",
        typeContrat: 11,
        dispositif: "APPR",
        dateDebutContrat: "2023-09-01",
        dateFinContrat: "2025-09-01",
        dateEffetAvenant: "2024-01-01",
        dateConclusion: "2023-08-15",
        noAvenant: "AV1",
        statut: "Rompu",
      },
      rupture: {
        dateEffetRupture: "2024-06-01",
        codeMotifRupture: "01",
        commentaireRupture: "Rupture amiable pour convenance personnelle",
        dateSignalement: "2024-06-02",
      },
      suiviASP: {
        drfc: "2024-06-15",
      },
    };

    const result = buildDecaContract(contrat);

    expect(result).toEqual({
      alternant: {
        date_naissance: new Date("1995-05-20T00:00:00.000Z"),
        nom: "Dupont",
        prenom: "Jean",
        sexe: "1",
        departement_naissance: "75",
        nationalite: 1,
        handicap: true,
        courriel: "jean.dupont@exemple.fr",
        telephone: "0601020304",
        adresse: {
          numero: 12,
          voie: "Rue de la Paix",
          code_postal: "75002",
        },
        derniere_classe: "3",
      },
      formation: {
        date_debut_formation: new Date("2023-09-01T00:00:00.000Z"),
        date_fin_formation: new Date("2025-09-01T00:00:00.000Z"),
        code_diplome: "50033610",
        intitule_ou_qualification: "BTS Services Informatiques aux Organisations",
        rncp: "RNCP12345",
        type_diplome: "BTS",
      },
      etablissement_formation: {
        siret: "73282932000074",
      },
      organisme_formation: {
        uai_cfa: "0123456B",
        siret: "39837262500017",
      },
      employeur: {
        code_idcc: "1596",
        siret: "80478874200011",
        adresse: {
          code_postal: "75001",
        },
        naf: "6201Z",
        nombre_de_salaries: 50,
        courriel: "contact@exemple.fr",
        telephone: "0102030405",
        denomination: "ACME SARL",
      },
      type_employeur: 1,
      no_contrat: "123456789",
      type_contrat: "11",
      date_effet_rupture: new Date("2024-06-01T00:00:00.000Z"),
      code_motif_rupture: "01",
      commentaire_rupture: "Rupture amiable pour convenance personnelle",
      date_signalement_rupture: new Date("2024-06-02T00:00:00.000Z"),
      dispositif: "APPR",
      date_debut_contrat: new Date("2023-09-01T00:00:00.000Z"),
      date_fin_contrat: new Date("2025-09-01T00:00:00.000Z"),
      date_reelle_fin_contrat: new Date("2024-06-15T00:00:00.000Z"),
      date_effet_avenant: new Date("2024-01-01T00:00:00.000Z"),
      date_signature_contrat: new Date("2023-08-15T00:00:00.000Z"),
      no_avenant: "AV1",
      statut: "Rompu",
    });

    // Le contrat mappé doit rester conforme au schéma ZDeca une fois les champs techniques ajoutés
    expect(() =>
      ZDeca.parse({
        ...result,
        _id: new ObjectId(),
        created_at: new Date(),
        updated_at: new Date(),
      })
    ).not.toThrow();
  });

  it("should omit optional fields (rupture, avenant, etc.) when absent from the source contract", () => {
    const contrat = {
      alternant: {
        nom: "Martin",
        dateNaissance: "2000-01-01",
        handicap: false,
      },
      formation: {},
      etablissementFormation: {},
      organismeFormationResponsable: {},
      employeur: {
        adresse: {},
      },
      detailsContrat: {
        noContrat: "987654321",
        typeContrat: 11,
        dateConclusion: "",
      },
    };

    const result = buildDecaContract(contrat);

    expect(result).toEqual({
      alternant: {
        date_naissance: new Date("2000-01-01T00:00:00.000Z"),
        nom: "Martin",
        handicap: false,
        adresse: {},
      },
      formation: {},
      etablissement_formation: {},
      organisme_formation: {},
      employeur: {
        adresse: {},
      },
      no_contrat: "987654321",
      type_contrat: "11",
      date_signature_contrat: null,
    });
    expect(result).not.toHaveProperty("code_motif_rupture");
    expect(result).not.toHaveProperty("commentaire_rupture");
    expect(result).not.toHaveProperty("date_signalement_rupture");
    expect(result).not.toHaveProperty("date_reelle_fin_contrat");
    expect(result).not.toHaveProperty("date_effet_rupture");
  });
});

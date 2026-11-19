import { describe, expect, it } from "vitest"

import { ZLbaMailingContact } from "./lba.mailingList.model"

describe("ZLbaMailingContact : provenance de l'email", () => {
  const contact = {
    email: "contact@exemple.fr",
    siren: "130025265",
    Resultat_net: 1000,
    siret: "13002526500013",
    trancheEffectifsEtablissement: "6-9",
    codePostalEtablissement: "75001",
    activitePrincipaleEtablissement: "4673A",
    enseigne1Etablissement: "ENSEIGNE",
    enseigne2Etablissement: null,
    enseigne3Etablissement: null,
    denominationUsuelleEtablissement: "DENOMINATION",
    raisonsociale: "RAISON SOCIALE",
    exported_at: "2026-11-21",
    date_cloture_exercice: "2025-12-31",
  }

  it("accepte un enregistrement sans les champs de provenance", () => {
    expect(ZLbaMailingContact.safeParse(contact).success).toBe(true)
  })

  it("accepte les champs de provenance valides", () => {
    const result = ZLbaMailingContact.safeParse({ ...contact, email_source: "france_travail", email_confirme_deca: true, email_source_date: "2026-11-21" })
    expect(result.success).toBe(true)
    expect(result.data).toMatchObject({ email_source: "france_travail", email_confirme_deca: true, email_source_date: "2026-11-21" })
  })

  it("accepte une date de provenance null", () => {
    expect(ZLbaMailingContact.safeParse({ ...contact, email_source: "deca_maitre_apprentissage", email_source_date: null }).success).toBe(true)
  })

  it("rejette une source inconnue", () => {
    const result = ZLbaMailingContact.safeParse({ ...contact, email_source: "autre_source" })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path)).toEqual([["email_source"]])
  })

  it("rejette une date qui n'est pas au format AAAA-MM-JJ", () => {
    expect(ZLbaMailingContact.safeParse({ ...contact, email_source_date: "21/11/2026" }).success).toBe(false)
  })
})

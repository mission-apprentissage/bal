import { Readable } from "node:stream"
import { useMongo } from "@tests/utils/mongo.utils"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { s3ReadAsStream } from "@/common/utils/awsUtils"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { importCompanyEmailsForLbaMailing } from "@/modules/jobs/lba/hydrate-companyEmailList"

vi.mock("@/common/utils/awsUtils", () => ({ s3ReadAsStream: vi.fn() }))

const mongo = useMongo()

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()
})

afterAll(async () => {
  await mongo.afterAll()
})

const contact = (siret: string, extra: Record<string, unknown> = {}) => ({
  email: `contact-${siret}@exemple.fr`,
  siren: siret.slice(0, 9),
  Resultat_net: 1000,
  siret,
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
  ...extra,
})

describe("importCompanyEmailsForLbaMailing", () => {
  it("stocke la provenance de l'email et compte les lignes rejetées", async () => {
    const file = [
      contact("11111111100011"),
      contact("22222222200022", { email_source: "deca_employeur", email_confirme_deca: false, email_source_date: "2026-11-21" }),
      contact("33333333300033", { email_source: "france_travail", email_confirme_deca: true, email_source_date: null }),
      contact("44444444400044", { email_source: "autre_source" }),
    ]
    vi.mocked(s3ReadAsStream).mockResolvedValue(Readable.from([JSON.stringify(file)]) as never)

    const result = await importCompanyEmailsForLbaMailing()

    expect(result).toEqual({ rejected: 1 })
    const contacts = await getDbCollection("lba.mailingLists")
      .find({}, { projection: { _id: 0, siret: 1, email_source: 1, email_confirme_deca: 1, email_source_date: 1 }, sort: { siret: 1 } })
      .toArray()
    expect(contacts).toEqual([
      { siret: "11111111100011", email_source: null, email_confirme_deca: null, email_source_date: null },
      { siret: "22222222200022", email_source: "deca_employeur", email_confirme_deca: false, email_source_date: "2026-11-21" },
      { siret: "33333333300033", email_source: "france_travail", email_confirme_deca: true, email_source_date: null },
    ])
  })

  it("efface la provenance d'un établissement qui n'en a plus dans le dernier export", async () => {
    const siret = "22222222200022"
    vi.mocked(s3ReadAsStream)
      .mockResolvedValueOnce(
        Readable.from([JSON.stringify([contact(siret, { email_source: "deca_employeur", email_confirme_deca: false, email_source_date: "2026-11-21" })])]) as never
      )
      .mockResolvedValueOnce(Readable.from([JSON.stringify([contact(siret)])]) as never)

    await importCompanyEmailsForLbaMailing()
    await importCompanyEmailsForLbaMailing()

    const stored = await getDbCollection("lba.mailingLists").findOne({ siret })
    expect(stored).toMatchObject({ email_source: null, email_confirme_deca: null, email_source_date: null })
  })
})

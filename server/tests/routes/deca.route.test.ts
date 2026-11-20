import type { Event } from "@sentry/node"
import * as Sentry from "@sentry/node"
import { ObjectId } from "mongodb"
import type { IDeca } from "shared/models/deca.model/deca.model"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import logger from "../../src/common/logger"
import { getSentryOptions } from "../../src/common/services/sentry/sentry"
import { getDbCollection } from "../../src/common/utils/mongodbUtils"
import { findDecaContrats } from "../../src/modules/actions/deca.actions"
import { createSession, createSessionToken } from "../../src/modules/actions/sessions.actions"
import { createUser, generateApiKey, setUserDecaExport } from "../../src/modules/actions/users.actions"
import { anonymisationDECA } from "../../src/modules/jobs/anonymisation/anonymisation.deca"
import type { Server } from "../../src/modules/server/server"
import createServer from "../../src/modules/server/server"
import { useMongo } from "../utils/mongo.utils"

// Envois Sentry réels (config de production, hors profiling), interceptés au niveau du transport :
// la normalisation de Sentry, qui coupe les données trop profondes, fait partie de ce qui est testé.
const envelopes: string[] = []

const sentEvents = async (): Promise<Event[]> => {
  await Sentry.flush(2_000)
  return envelopes.flatMap((envelope) =>
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
}

// Valeurs nominatives du contrat de test, qui ne doivent jamais sortir dans un signalement.
const valeursNominatives = ["EXEMPLE", "Camille", "camille@exemple.fr", "0600000000", "rue de l'Exemple", "contact@entreprise.exemple.fr", "0100000000"]

// Paramètres refusés : 400 avec une clé valide, 403 sans clé (l'authentification passe avant la validation).
const identifiant = "abcdef01".repeat(3)
const parametresInvalides = [
  "?after=pas-un-identifiant",
  "?after=abcdefghijkl",
  `?after=${identifiant.toUpperCase()}`,
  `?after[]=${identifiant}`,
  `?after[$gt]=${identifiant}`,
  `?cursor=${identifiant}`,
  "?limit=0",
  "?limit=1001",
  "?limit=1.5",
  "?limit=abc",
]

// Tous les champs de ZDeca, sous-objets compris, sans valeur absente : le typage impose d'ajouter ici tout
// champ ajouté au modèle, pour que les tests de projection voient un champ qui sortirait par erreur.
type Complet<T> = T extends Date | ObjectId ? T : T extends object ? { [K in keyof T]-?: Complet<Exclude<T[K], null | undefined>> } : T

const contratComplet = (): Complet<IDeca> => ({
  _id: new ObjectId(),
  no_contrat: "012345678901",
  statut: "Corrigé",
  flag_correction: false,
  date_suppression: new Date("2026-02-01T00:00:00.000Z"),
  date_debut_contrat: new Date("2025-09-01T00:00:00.000Z"),
  date_fin_contrat: new Date("2027-08-31T00:00:00.000Z"),
  date_signature_contrat: new Date("2025-08-15T00:00:00.000Z"),
  date_effet_avenant: new Date("2025-12-01T00:00:00.000Z"),
  date_effet_rupture: new Date("2026-01-15T00:00:00.000Z"),
  code_motif_rupture: "1",
  commentaire_rupture: "Commentaire de rupture",
  date_signalement_rupture: new Date("2026-01-20T00:00:00.000Z"),
  date_reelle_fin_contrat: new Date("2026-01-15T00:00:00.000Z"),
  no_avenant: "01",
  dispositif: "APPR",
  type_contrat: "11",
  rupture_avant_debut: false,
  type_employeur: 11,
  employeur_specifique: 0,
  type_derogation: 0,
  alternant: {
    nom: "EXEMPLE",
    prenom: "Camille",
    sexe: "F",
    date_naissance: new Date("2006-03-14T00:00:00.000Z"),
    departement_naissance: "75",
    nationalite: 1,
    handicap: false,
    courriel: "camille@exemple.fr",
    telephone: "0600000000",
    adresse: { numero: "12", voie: "rue de l'Exemple", code_postal: "75011" },
    derniere_classe: 11,
  },
  formation: {
    date_debut_formation: new Date("2025-09-01T00:00:00.000Z"),
    date_fin_formation: new Date("2027-07-05T00:00:00.000Z"),
    code_diplome: "50022141",
    rncp: "RNCP00000",
    intitule_ou_qualification: "CAP exemple",
    type_diplome: "CAP",
  },
  employeur: {
    siret: "00000000000018",
    denomination: "ENTREPRISE EXEMPLE",
    naf: "1071C",
    code_idcc: "1234",
    adresse: { code_postal: "75011" },
    nombre_de_salaries: 4,
    courriel: "contact@entreprise.exemple.fr",
    telephone: "0100000000",
  },
  organisme_formation: { siret: "00000000000026", uai_cfa: "0000000A" },
  etablissement_formation: { siret: "00000000000026" },
  updated_at: new Date("2025-09-01T00:00:00.000Z"),
  created_at: new Date("2025-09-01T00:00:00.000Z"),
})

const buildContrat = (overrides: Partial<IDeca> = {}): IDeca => ({ ...contratComplet(), ...overrides })

// Ce que la base rend pour contratComplet() : les champs exportés et eux seuls.
const champsExportes = (_id: ObjectId) => ({
  _id,
  no_contrat: "012345678901",
  type_contrat: "11",
  type_employeur: 11,
  statut: "Corrigé",
  date_debut_contrat: new Date("2025-09-01T00:00:00.000Z"),
  date_fin_contrat: new Date("2027-08-31T00:00:00.000Z"),
  date_effet_rupture: new Date("2026-01-15T00:00:00.000Z"),
  updated_at: new Date("2025-09-01T00:00:00.000Z"),
  alternant: {
    nom: "EXEMPLE",
    prenom: "Camille",
    sexe: "F",
    courriel: "camille@exemple.fr",
    telephone: "0600000000",
    date_naissance: new Date("2006-03-14T00:00:00.000Z"),
    nationalite: 1,
    handicap: false,
    adresse: { numero: "12", voie: "rue de l'Exemple", code_postal: "75011" },
    derniere_classe: 11,
  },
  formation: {
    date_debut_formation: new Date("2025-09-01T00:00:00.000Z"),
    date_fin_formation: new Date("2027-07-05T00:00:00.000Z"),
    code_diplome: "50022141",
    rncp: "RNCP00000",
    intitule_ou_qualification: "CAP exemple",
  },
  employeur: {
    siret: "00000000000018",
    denomination: "ENTREPRISE EXEMPLE",
    naf: "1071C",
    adresse: { code_postal: "75011" },
    nombre_de_salaries: 4,
  },
  organisme_formation: { siret: "00000000000026", uai_cfa: "0000000A" },
  etablissement_formation: { siret: "00000000000026" },
})

const idsDe = (contrats: { _id: string }[]) => contrats.map((contrat) => contrat._id)

describe("GET /api/v1/deca/contrats", () => {
  const mongo = useMongo()
  let app: Server

  beforeAll(async () => {
    const { integrations, ...options } = getSentryOptions()
    Sentry.init({
      ...options,
      dsn: "https://public@sentry.exemple.fr/1",
      integrations: (integrations as Extract<NonNullable<typeof integrations>, unknown[]>).filter((integration) => integration.name !== "ProfilingIntegration"),
      transport: (transportOptions) =>
        Sentry.createTransport(transportOptions, async (request) => {
          envelopes.push(typeof request.body === "string" ? request.body : new TextDecoder().decode(request.body))
          return { statusCode: 200 }
        }),
    })
    app = await createServer()
    await Promise.all([app.ready(), mongo.beforeAll()])
  }, 15_000)

  beforeEach(async () => {
    await mongo.beforeEach()
    await Sentry.flush(2_000)
    envelopes.length = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await Promise.all([mongo.afterAll(), app.close()])
    await Sentry.close(2_000)
  })

  const getContrats = async (token: string | null, query = "") =>
    app.inject({
      method: "GET",
      url: `/api/v1/deca/contrats${query}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

  const searchOrganisme = async (token: string) =>
    app.inject({
      method: "POST",
      url: "/api/v1/deca/search/organisme",
      payload: { siret: "00000000000026" },
      headers: { Authorization: `Bearer ${token}` },
    })

  type Reponse = Awaited<ReturnType<typeof getContrats>>

  const expectJetonManquant = (response: Reponse) => {
    expect(response.statusCode).toBe(403)
    expect(response.json().message).toBe("Jeton manquant")
  }

  // Refus d'autorisation, à distinguer d'un refus d'authentification (« Jeton manquant », « Jeton invalide »).
  const expectPermissionRefusee = (response: Reponse) => {
    expect(response.statusCode).toBe(403)
    expect(response.json().message).toBe("Forbidden")
  }

  describe("accès", () => {
    it("refuse un appel sans jeton", async () => {
      expectJetonManquant(await getContrats(null))
    })

    it.each(parametresInvalides)("refuse sans jeton avant de valider les paramètres : %s", async (query) => {
      expectJetonManquant(await getContrats(null, query))
    })

    it.each([
      { role: "sans rôle", is_admin: false, is_support: false },
      { role: "support", is_admin: false, is_support: true },
      { role: "administrateur", is_admin: true, is_support: false },
    ])("ne donne pas la permission aux autres utilisateurs du rôle $role", async ({ is_admin, is_support }) => {
      const tba = await createUser({ email: "tba@exemple.fr", password: "my-password", is_admin, is_support })
      const autre = await createUser({ email: "autre@exemple.fr", password: "my-password", is_admin, is_support })
      await setUserDecaExport("tba@exemple.fr", "true")

      expect((await getContrats(await generateApiKey(tba))).statusCode).toBe(200)
      expectPermissionRefusee(await getContrats(await generateApiKey(autre)))
    })

    it("laisse ses droits à un administrateur qui reçoit la permission", async () => {
      const admin = await createUser({ email: "admin@exemple.fr", password: "my-password", is_admin: true })
      await setUserDecaExport("admin@exemple.fr", "true")
      const session = createSessionToken(admin.email)
      await createSession({ token: session })

      const response = await app.inject({ method: "GET", url: "/api/admin/users", headers: { Cookie: `bal_session=${session}` } })

      expect(response.statusCode).toBe(200)
    })

    it("laisse les routes v1 existantes ouvertes à une clé sans la permission", async () => {
      const user = await createUser({ email: "partenaire@exemple.fr", password: "my-password" })

      expect((await searchOrganisme(await generateApiKey(user))).statusCode).toBe(200)
    })

    it("accepte un compte existant sans le champ is_deca_export, sans lui donner l'export", async () => {
      const now = new Date()
      const ancien = {
        _id: new ObjectId(),
        email: "ancien@exemple.fr",
        password: "hashed",
        is_admin: false,
        is_support: false,
        api_key: null,
        api_key_used_at: null,
        updated_at: now,
        created_at: now,
      }
      await getDbCollection("users").insertOne(ancien)
      const token = await generateApiKey(ancien)

      expect((await searchOrganisme(token)).statusCode).toBe(200)
      expectPermissionRefusee(await getContrats(token))
    })

    it("crée les comptes sans le champ is_deca_export", async () => {
      const user = await createUser({ email: "nouveau@exemple.fr", password: "my-password" })

      expect(await getDbCollection("users").findOne({ _id: user._id })).not.toHaveProperty("is_deca_export")
    })
  })

  describe("setUserDecaExport", () => {
    it("donne puis retire l'accès, et la route suit", async () => {
      const user = await createUser({ email: "tba@exemple.fr", password: "my-password" })
      const token = await generateApiKey(user)

      await setUserDecaExport("tba@exemple.fr", "true")
      expect((await getContrats(token)).statusCode).toBe(200)

      await setUserDecaExport("tba@exemple.fr", "false")
      expectPermissionRefusee(await getContrats(token))
      expect(await getDbCollection("users").findOne({ _id: user._id })).not.toHaveProperty("is_deca_export")
    })

    it("échoue pour un email inconnu", async () => {
      await expect(setUserDecaExport("inconnu@exemple.fr", "true")).rejects.toThrow("Aucun utilisateur avec l'email inconnu@exemple.fr")
    })

    it("échoue pour une valeur autre que true ou false, sans rien écrire", async () => {
      await createUser({ email: "tba@exemple.fr", password: "my-password" })

      await expect(setUserDecaExport("tba@exemple.fr", "oui")).rejects.toThrow('Valeur invalide : "oui"')
      expect(await getDbCollection("users").findOne({ email: "tba@exemple.fr" })).not.toHaveProperty("is_deca_export")
    })
  })

  describe("avec la permission", () => {
    let token: string

    beforeEach(async () => {
      const user = await createUser({ email: "tba@exemple.fr", password: "my-password" })
      await setUserDecaExport("tba@exemple.fr", "true")
      token = await generateApiKey(user)
    })

    // Lit toutes les pages en suivant next, et renvoie les _id de chaque page.
    const lireTout = async (limit: number, depart: string | null = null) => {
      const pages: string[][] = []
      let after: string | null = depart
      do {
        const response = await getContrats(token, `?limit=${limit}${after ? `&after=${after}` : ""}`)
        expect(response.statusCode).toBe(200)
        const { contrats, pagination } = response.json()
        pages.push(idsDe(contrats))
        after = pagination.next
      } while (after !== null && pages.length < 100)
      expect(after).toBeNull()
      return pages
    }

    const insererContrats = async (nombre: number) => {
      const contrats = Array.from({ length: nombre }, (_, i) => buildContrat({ no_contrat: `contrat-${i}` }))
      await getDbCollection("deca").insertMany(contrats)
      return contrats.map((c) => c._id.toString())
    }

    describe("contrats renvoyés", () => {
      it("ne renvoie que les contrats qui passent les cinq conditions du filtre", async () => {
        const retenu = buildContrat()
        const { organisme_formation, formation } = contratComplet()
        const { uai_cfa: _uai, ...organismeSansUai } = organisme_formation
        const { siret: _siret, ...organismeSansSiret } = organisme_formation
        const { date_debut_formation: _debut, ...formationSansDebut } = formation
        const { date_fin_formation: _fin, ...formationSansFin } = formation

        await getDbCollection("deca").insertMany([
          retenu,
          buildContrat({ no_contrat: "pro", dispositif: "PROF" }),
          buildContrat({ no_contrat: "sans-uai", organisme_formation: organismeSansUai }),
          buildContrat({ no_contrat: "sans-siret", organisme_formation: organismeSansSiret }),
          buildContrat({ no_contrat: "sans-debut", formation: formationSansDebut }),
          buildContrat({ no_contrat: "sans-fin", formation: formationSansFin }),
        ])

        const response = await getContrats(token)

        expect(response.statusCode).toBe(200)
        expect(idsDe(response.json().contrats)).toEqual([retenu._id.toString()])
      })

      it("ne renvoie plus un contrat anonymisé", async () => {
        const ancien = buildContrat({ no_contrat: "ancien", date_fin_contrat: new Date("2020-06-30T00:00:00.000Z") })
        const recent = buildContrat({ no_contrat: "recent" })
        await getDbCollection("deca").insertMany([ancien, recent])

        await anonymisationDECA()

        const response = await getContrats(token)
        expect(idsDe(response.json().contrats)).toEqual([recent._id.toString()])
      })

      it("renvoie les seuls champs exportés, _id en chaîne et dates en ISO 8601", async () => {
        const contrat = buildContrat()
        await getDbCollection("deca").insertOne(contrat)

        const { contrats } = (await getContrats(token)).json()

        expect(contrats[0]._id).toBe(contrat._id.toHexString())
        expect(contrats[0].date_debut_contrat).toBe("2025-09-01T00:00:00.000Z")
        expect(contrats).toEqual([JSON.parse(JSON.stringify(champsExportes(contrat._id)))])
      })

      it("ne lit en base que les champs exportés", async () => {
        // Le schéma de la réponse retire aussi les champs en trop : seule la lecture en base montre la projection.
        const contrat = buildContrat()
        await getDbCollection("deca").insertOne(contrat)

        const [lu] = await findDecaContrats({ limit: 1 }).toArray()

        expect(lu).toEqual(champsExportes(contrat._id))
      })

      it("renvoie un contrat incomplet sans les parties absentes", async () => {
        const { adresse: _adresseAlternant, ...alternant } = buildContrat().alternant
        const { adresse: _adresseEmployeur, ...employeur } = buildContrat().employeur
        const { etablissement_formation: _etablissement, ...contrat } = buildContrat({ alternant, employeur })
        await getDbCollection("deca").insertOne(contrat)

        const response = await getContrats(token)

        expect(response.statusCode).toBe(200)
        const [renvoye] = response.json().contrats
        expect(renvoye._id).toBe(contrat._id.toString())
        expect(renvoye.alternant).not.toHaveProperty("adresse")
        expect(renvoye.employeur).not.toHaveProperty("adresse")
        expect(renvoye).not.toHaveProperty("etablissement_formation")
      })
    })

    describe("requête et réponse", () => {
      it.each(parametresInvalides)("répond 400 pour %s", async (query) => {
        // Des contrats en base : un paramètre ignoré répondrait 200 avec la première page.
        await insererContrats(1)

        const response = await getContrats(token, query)

        expect(response.statusCode).toBe(400)
      })

      it("interdit la mise en cache de la réponse", async () => {
        const response = await getContrats(token)

        expect(response.headers["cache-control"]).toBe("no-store")
      })

      it("force l'index _id, sans tri en mémoire", async () => {
        const ids = await insererContrats(3)

        const explain = await findDecaContrats({ after: new ObjectId(ids[0]), limit: 3 }).explain("executionStats")

        expect(explain.command.hint).toEqual({ _id: 1 })
        const plan = JSON.stringify(explain.queryPlanner.winningPlan)
        expect(plan).toContain('"indexName":"_id_"')
        expect(plan).not.toContain('"stage":"SORT"')
      })
    })

    describe("pagination", () => {
      it("parcourt tous les contrats une seule fois, dans l'ordre des _id", async () => {
        const ids = await insererContrats(25)

        const pages = await lireTout(7)

        expect(pages.map((page) => page.length)).toEqual([7, 7, 7, 4])
        expect(pages.flat()).toEqual([...ids].sort())
      })

      it("termine sur la dernière page pleine quand le total est un multiple de la taille de page", async () => {
        await insererContrats(21)

        const pages = await lireTout(7)

        expect(pages.map((page) => page.length)).toEqual([7, 7, 7])
      })

      it("renvoie 1000 contrats par défaut", async () => {
        await insererContrats(1001)

        const response = await getContrats(token)

        expect(response.json().contrats).toHaveLength(1000)
        expect(response.json().pagination.next).not.toBeNull()
      })

      it("ne fait ni sauter ni doubler un contrat quand la base change entre deux pages", async () => {
        const ids = await insererContrats(5)
        const page1 = (await getContrats(token, "?limit=2")).json()

        await getDbCollection("deca").updateOne({ _id: new ObjectId(ids[2]) }, { $set: { statut: "Annulé" } })
        await getDbCollection("deca").deleteOne({ _id: new ObjectId(ids[3]) })
        const insere = buildContrat({ no_contrat: "insere" })
        await getDbCollection("deca").insertOne(insere)

        const suite = await lireTout(2, page1.pagination.next)

        expect([...idsDe(page1.contrats), ...suite.flat()]).toEqual([ids[0], ids[1], ids[2], ids[4], insere._id.toString()])
      })

      it("reprend après un contrat supprimé depuis", async () => {
        const ids = await insererContrats(3)
        await getDbCollection("deca").deleteOne({ _id: new ObjectId(ids[0]) })

        const response = await getContrats(token, `?after=${ids[0]}`)

        expect(idsDe(response.json().contrats)).toEqual([ids[1], ids[2]])
      })

      it("répond une page vide et finale après le dernier contrat", async () => {
        const ids = await insererContrats(2)

        const response = await getContrats(token, `?after=${ids[1]}`)

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ contrats: [], pagination: { next: null, ecartes: 0 } })
      })
    })

    describe("contrats écartés", () => {
      it("écarte un contrat invalide sans bloquer la lecture, et le signale une fois sans ses valeurs", async () => {
        const warn = vi.spyOn(logger, "warn")
        const [premier, second, invalide, suivant] = Array.from({ length: 4 }, (_, i) => buildContrat({ no_contrat: `contrat-${i}` }))
        await getDbCollection("deca").insertMany([premier, second])
        await getDbCollection("deca").insertOne(
          { ...invalide, alternant: { ...invalide.alternant, nationalite: "française" as unknown as number } },
          { bypassDocumentValidation: true }
        )
        await getDbCollection("deca").insertOne(suivant)

        const page1 = (await getContrats(token, "?limit=3")).json()

        expect(idsDe(page1.contrats)).toEqual([premier._id.toString(), second._id.toString()])
        expect(page1.pagination).toEqual({ next: invalide._id.toString(), ecartes: 1 })

        const page2 = (await getContrats(token, `?limit=3&after=${page1.pagination.next}`)).json()
        expect(idsDe(page2.contrats)).toEqual([suivant._id.toString()])

        const events = await sentEvents()
        expect(events).toHaveLength(1)
        expect(events[0]).toMatchObject({
          message: "contrats DECA écartés de l'export",
          level: "warning",
          fingerprint: ["deca-export-ecartes"],
          extra: { ecartes: [{ _id: invalide._id.toString(), champs: "alternant.nationalite" }] },
        })

        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0][0]).toMatchObject({ ecartes: [{ _id: invalide._id.toString(), champs: ["alternant.nationalite"] }] })

        // Ni les valeurs du contrat, ni la clé API de l'appelant.
        const signalements = JSON.stringify([events, warn.mock.calls])
        for (const valeur of ["française", token, ...valeursNominatives]) {
          expect(signalements).not.toContain(valeur)
        }
      })

      it("répond 200 avec une page vide mais un next quand tous ses contrats sont écartés", async () => {
        const warn = vi.spyOn(logger, "warn")
        const invalides = Array.from({ length: 2 }, (_, i) => {
          const contrat = buildContrat({ no_contrat: `invalide-${i}` })
          return { ...contrat, alternant: { ...contrat.alternant, nationalite: "x" as unknown as number } }
        })
        await getDbCollection("deca").insertMany(invalides, { bypassDocumentValidation: true })
        await getDbCollection("deca").insertOne(buildContrat({ no_contrat: "valide" }))

        const response = await getContrats(token, "?limit=2")

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ contrats: [], pagination: { next: invalides[1]._id.toString(), ecartes: 2 } })
        expect(await sentEvents()).toHaveLength(1)
        expect(warn).toHaveBeenCalledTimes(1)
      })
    })
  })
})

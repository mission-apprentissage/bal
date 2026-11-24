import type { ObjectId } from "mongodb"
import { z } from "zod/v4-mini"
import { zObjectId } from "../common"

// Identifiant Mongo tel que l'export l'échange : une chaîne de 24 caractères hexadécimaux, typée comme
// telle dans l'OpenAPI (zObjectId seul y sort sans type).
const zObjectIdHex = z.string().check(z.regex(/^[0-9a-f]{24}$/))

// En sortie (_id, next) : ObjectId (ou sa chaîne) vers sa chaîne. Rend la même chose sur sa propre sortie.
export const zDecaExportId = z.pipe(
  zObjectId,
  z.pipe(
    z.transform((id: ObjectId) => id.toHexString()),
    zObjectIdHex
  )
)

// En entrée (paramètre after) : la chaîne d'un next déjà reçu, convertie en ObjectId pour la requête.
export const zDecaExportCursor = z.pipe(
  zObjectIdHex,
  z.transform((id: string) => zObjectId.parse(id))
)

// Contrat DECA tel que l'export le renvoie à TBA (GET /v1/deca/contrats). C'est la seule définition des
// champs exportés : le serveur en dérive la projection Mongo (deca.actions.ts). Types de base de ZDeca,
// sans refine, et tout est nullish sauf _id et updated_at, pour qu'un document incomplet ressorte au lieu
// d'être écarté. Le schéma doit rendre la même chose sur sa propre sortie : le handler puis le
// sérialiseur le valident.
export const ZDecaContratExport = z.object({
  _id: zDecaExportId,
  updated_at: z.date(),

  no_contrat: z.nullish(z.string()),
  type_contrat: z.nullish(z.string()),
  statut: z.nullish(z.string()),
  type_employeur: z.nullish(z.number()),
  date_debut_contrat: z.nullish(z.date()),
  date_fin_contrat: z.nullish(z.date()),
  date_effet_rupture: z.nullish(z.date()),

  alternant: z.nullish(
    z.object({
      nom: z.nullish(z.string()),
      prenom: z.nullish(z.string()),
      sexe: z.nullish(z.string()),
      courriel: z.nullish(z.string()),
      telephone: z.nullish(z.string()),
      date_naissance: z.nullish(z.date()),
      nationalite: z.nullish(z.number()),
      handicap: z.nullish(z.boolean()),
      derniere_classe: z.nullish(z.coerce.number()),
      adresse: z.nullish(
        z.object({
          numero: z.nullish(z.coerce.string()),
          voie: z.nullish(z.string()),
          code_postal: z.nullish(z.string()),
        })
      ),
    })
  ),
  formation: z.nullish(
    z.object({
      date_debut_formation: z.nullish(z.date()),
      date_fin_formation: z.nullish(z.date()),
      code_diplome: z.nullish(z.string()),
      rncp: z.nullish(z.string()),
      intitule_ou_qualification: z.nullish(z.string()),
    })
  ),
  employeur: z.nullish(
    z.object({
      siret: z.nullish(z.string()),
      denomination: z.nullish(z.string()),
      naf: z.nullish(z.string()),
      nombre_de_salaries: z.nullish(z.number()),
      adresse: z.nullish(
        z.object({
          code_postal: z.nullish(z.string()),
        })
      ),
    })
  ),
  organisme_formation: z.nullish(
    z.object({
      siret: z.nullish(z.string()),
      uai_cfa: z.nullish(z.string()),
    })
  ),
  etablissement_formation: z.nullish(
    z.object({
      siret: z.nullish(z.string()),
    })
  ),
})

export type IDecaContratExport = z.output<typeof ZDecaContratExport>

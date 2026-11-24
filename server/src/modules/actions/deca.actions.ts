import { captureMessage } from "@sentry/node"
import type { ObjectId } from "mongodb"
import { zObjectId } from "shared/models/common"
import type { IDecaContratExport } from "shared/models/deca.model/deca.export.model"
import { ZDecaContratExport } from "shared/models/deca.model/deca.export.model"
import type { $ZodType } from "zod/v4/core"
import { $ZodBoolean, $ZodDate, $ZodNullable, $ZodNumber, $ZodObject, $ZodOptional, $ZodPipe, $ZodString } from "zod/v4/core"

import logger from "@/common/logger"
import { getDbCollection } from "@/common/utils/mongodbUtils"

const unwrap = (schema: $ZodType): $ZodType => (schema instanceof $ZodOptional || schema instanceof $ZodNullable ? unwrap(schema._zod.def.innerType) : schema)

// Première entrée d'un pipe, à travers les pipes imbriqués.
const pipeEntry = (schema: $ZodType): $ZodType => (schema instanceof $ZodPipe ? pipeEntry(schema._zod.def.in) : schema)

const isLeaf = (schema: $ZodType): boolean =>
  schema instanceof $ZodString ||
  schema instanceof $ZodNumber ||
  schema instanceof $ZodBoolean ||
  schema instanceof $ZodDate ||
  // Identifiants seulement : un pipe qui part du contrôle de zObjectId lui-même, pas d'un autre custom.
  (schema instanceof $ZodPipe && pipeEntry(schema) === pipeEntry(zObjectId))

// Chemins pointés des feuilles du schéma : { "alternant.nom": 1, ... }. Ne jamais projeter un objet et
// l'un de ses champs à la fois, Mongo le refuse (« path collision »). Tout autre type échoue au
// chargement : projeter un objet enveloppé (default, tableau, autre pipe...) lirait tous ses champs,
// nominatifs compris.
export const toProjection = (shape: Readonly<Record<string, $ZodType>>, prefix = ""): Record<string, 1> =>
  Object.entries(shape).reduce<Record<string, 1>>((acc, [key, schema]) => {
    const path = `${prefix}${key}`
    const inner = unwrap(schema)
    if (inner instanceof $ZodObject) {
      return Object.assign(acc, toProjection(inner._zod.def.shape, `${path}.`))
    }
    if (!isLeaf(inner)) {
      throw new Error(`Export DECA : type Zod non projetable pour ${path} (${inner._zod.def.type})`)
    }
    acc[path] = 1
    return acc
  }, {})

// Les champs lus en base sont exactement ceux du contrat exporté.
const decaContratExportProjection = toProjection(ZDecaContratExport._zod.def.shape)

// Sélection actuelle de TBA, reproduite à l'identique.
const decaContratExportFilter = {
  dispositif: "APPR",
  "organisme_formation.uai_cfa": { $exists: true },
  "organisme_formation.siret": { $exists: true },
  "formation.date_debut_formation": { $exists: true },
  "formation.date_fin_formation": { $exists: true },
} as const

// Au plus `limit` contrats exportables après `after`, dans l'ordre des _id, sans skip : chaque page coûte
// le même prix. Le hint évite que le planificateur choisisse l'index organisme_formation.siret (à cause
// du $exists) suivi d'un tri en mémoire à chaque page.
export const findDecaContrats = ({ after, limit }: { after?: ObjectId | undefined; limit: number }) =>
  getDbCollection("deca").find(
    { ...decaContratExportFilter, ...(after ? { _id: { $gt: after } } : {}) },
    { projection: decaContratExportProjection, sort: { _id: 1 }, hint: { _id: 1 }, limit }
  )

type IContratEcarte = { _id: string; champs: string[] }

export const getDecaContratsPage = async ({
  after,
  limit,
}: {
  after?: ObjectId | undefined
  limit: number
}): Promise<{
  contrats: IDecaContratExport[]
  // Dernier contrat lu de la page, renvoyé ou écarté. null seulement quand il ne reste rien après.
  next: ObjectId | null
  ecartes: number
}> => {
  // Un contrat de plus que la page : il dit seulement s'il en reste une, sans requête supplémentaire.
  const documents = await findDecaContrats({ after, limit: limit + 1 }).toArray()
  const page = documents.slice(0, limit)
  const next = documents.length > limit ? page[page.length - 1]._id : null

  // Validation contrat par contrat : un seul contrat invalide ferait répondre 500 à toute la page au
  // sérialiseur, et le client ne pourrait jamais la dépasser. Il est écarté et signalé à la place.
  const contrats: IDecaContratExport[] = []
  const contratsEcartes: IContratEcarte[] = []
  for (const document of page) {
    const result = ZDecaContratExport.safeParse(document)
    if (result.success) {
      contrats.push(result.data)
    } else {
      // Chemins des champs en erreur seulement : jamais leurs valeurs, qui sont nominatives.
      contratsEcartes.push({ _id: document._id.toString(), champs: [...new Set(result.error.issues.map((issue) => issue.path.join(".")))] })
    }
  }

  if (contratsEcartes.length > 0) {
    signalerContratsEcartes(contratsEcartes)
  }

  return { contrats, next, ecartes: contratsEcartes.length }
}

function signalerContratsEcartes(contratsEcartes: IContratEcarte[]) {
  logger.warn({ module: "deca-export", ecartes: contratsEcartes }, "contrats DECA écartés de l'export")
  captureMessage("contrats DECA écartés de l'export", {
    level: "warning",
    // Empreinte fixe : un défaut systématique reste un seul problème dans Sentry.
    fingerprint: ["deca-export-ecartes"],
    // Champs en une chaîne : Sentry coupe les données au-delà de trois niveaux (normalizeDepth), et
    // remplacerait le tableau par "[Array]".
    extra: { ecartes: contratsEcartes.map(({ _id, champs }) => ({ _id, champs: champs.join(", ") })) },
  })
}

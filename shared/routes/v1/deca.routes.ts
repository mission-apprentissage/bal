import { z } from "zod/v4-mini"
import { extensions } from "../../helpers/zodHelpers/zodPrimitives"
import { ZDecaContratExport, zDecaExportCursor, zDecaExportId } from "../../models/deca.model/deca.export.model"
import type { IRoutesDef } from "../common.routes"
import { ZReqHeadersAuthorization } from "../common.routes"

const contratsDescription = `Export complet des contrats d'apprentissage DECA, page par page, pour une lecture complète.

- Pagination par curseur : passer en \`after\` la valeur \`pagination.next\` de la page précédente. \`next: null\` est le seul marqueur de fin : une page peut être courte, voire vide, sans être la dernière.
- On peut reprendre une lecture à partir de n'importe quel \`next\` déjà reçu.
- \`pagination.ecartes\` compte les contrats de la page que la BAL n'a pas pu renvoyer.
- Envoyer \`Accept-Encoding: gzip\`, et lire chaque réponse en entier dès réception : le proxy coupe une réponse que le client ne lit pas pendant 10 secondes.
- Une erreur passagère de la BAL peut répondre 403 « Jeton invalide », comme une clé refusée : réessayer aussi sur 403, avec un nombre de tentatives limité.
- \`updated_at\` vaut la date de la période DECA importée, à minuit UTC, et non l'heure d'écriture. Certains changements, comme \`alternant.handicap\`, ne le modifient pas.
- Les contrats dont \`date_fin_contrat\` date de plus de deux ans sont anonymisés et disparaissent sans être signalés.
- Une correction du nom de l'alternant ou du type de contrat crée un nouveau contrat, avec un nouveau \`_id\`. L'ancien reste renvoyé jusqu'à son anonymisation.
- Un paramètre inconnu ou mal formé répond 400, plutôt que de relire la première page.`

const contratsLimitMax = 1000

const contratsSchema = {
  // Strict : un curseur mal sérialisé (after[]=..., cursor=...) serait sinon ignoré, et le client relirait
  // la première page sans fin.
  querystring: z.strictObject({
    after: z.optional(zDecaExportCursor),
    limit: z._default(z.coerce.number().check(z.int(), z.gte(1), z.lte(contratsLimitMax)), contratsLimitMax),
  }),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z.object({
      contrats: z.array(ZDecaContratExport),
      pagination: z.object({
        next: z.nullable(zDecaExportId),
        ecartes: z.number(),
      }),
    }),
  },
} as const

const validationSchema = {
  body: z.object({
    siret: extensions.siret,
  }),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z.object({
      contrats: z.object({
        total: z.number(),
        appr: z.number(),
        prof: z.number(),
      }),
      premier_contrat: z.nullish(
        z.object({
          date_debut_contrat: z.optional(z.date()),
          date_fin_contrat: z.optional(z.date()),
        })
      ),
      dernier_contrat: z.nullish(
        z.object({
          date_debut_contrat: z.optional(z.date()),
          date_fin_contrat: z.optional(z.date()),
        })
      ),
    }),
  },
} as const

export const zDecaV1Routes = {
  get: {
    "/v1/deca/contrats": {
      method: "get",
      path: "/v1/deca/contrats",
      securityScheme: {
        auth: "api-key",
        ressources: {},
        access: "deca_export",
      },
      openapi: {
        tags: ["v1"] as string[],
        description: contratsDescription,
      },
      ...contratsSchema,
    },
  },
  post: {
    "/v1/deca/search/organisme": {
      method: "post",
      path: "/v1/deca/search/organisme",
      securityScheme: {
        auth: "api-key",
        ressources: {},
        access: null,
      },
      openapi: {
        tags: ["v1"] as string[],
      },
      ...validationSchema,
    },
  },
} as const satisfies IRoutesDef

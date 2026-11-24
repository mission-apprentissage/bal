import { zObjectId } from "shared/models/common"
import { describe, expect, it } from "vitest"
import { z } from "zod/v4-mini"

import { toProjection } from "../../../src/modules/actions/deca.actions"

describe("toProjection", () => {
  it("projette les feuilles par leur chemin pointé, identifiants compris", () => {
    const shape = {
      _id: z.pipe(
        zObjectId,
        z.transform((id) => id.toHexString())
      ),
      statut: z.nullish(z.string()),
      employeur: z.nullish(z.object({ siret: z.string(), adresse: z.optional(z.object({ code_postal: z.string() })) })),
    }

    expect(toProjection(shape)).toEqual({ _id: 1, statut: 1, "employeur.siret": 1, "employeur.adresse.code_postal": 1 })
  })

  // Chacun de ces types ferait lire l'objet entier en base, champs nominatifs compris.
  it.each([
    { type: "un tableau d'objets", schema: z.array(z.object({ courriel: z.string() })) },
    { type: "un objet avec valeur par défaut", schema: z._default(z.object({ courriel: z.string() }), { courriel: "" }) },
    {
      type: "un pipe issu d'un autre contrôle custom",
      schema: z.pipe(
        z.custom<{ courriel: string }>(),
        z.transform((value) => value)
      ),
    },
  ])("refuse $type", ({ schema }) => {
    expect(() => toProjection({ employeur: z.object({ contact: z.nullish(schema) }) })).toThrow("type Zod non projetable pour employeur.contact")
  })
})

import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { zObjectId } from "../models/common";
import { ZOrganisation } from "../models/organisation.model";

export const ZResGetPerson = z
  .object({
    _id: zObjectId,
    email: z.string().email(),
    civility: z.enum(["Madame", "Monsieur"]).optional(),
    nom: z.string().optional(),
    prenom: z.string().optional(),
    organisation_id: z.string(),
    organisation: ZOrganisation.optional(),
    sirets: z.array(z.string()).optional(),
    _meta: z.record(z.any()).optional(),
    updated_at: z.date(),
    created_at: z.date(),
  })
  .strict();

export const SResGetPerson = zodToJsonSchema(ZResGetPerson);
export type IResGetPerson = z.input<typeof ZResGetPerson>;

export const ZResGetPersons = z.array(ZResGetPerson);
export const SResGetPersons = zodToJsonSchema(ZResGetPersons);
export type IResGetPersons = z.input<typeof ZResGetPersons>;

import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { ZOrganisation } from "../models/organisation.model";

export const SResGetOrganisation = zodToJsonSchema(ZOrganisation());

export type IResGetOrganisation = z.input<ReturnType<typeof ZOrganisation>>;

export const ZResGetOrganisations = () => z.array(ZOrganisation());
export const SResGetOrganisations = zodToJsonSchema(ZResGetOrganisations());

export type IResGetOrganisations = z.input<
  ReturnType<typeof ZResGetOrganisations>
>;

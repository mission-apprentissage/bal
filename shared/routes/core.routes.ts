import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export enum EnvEnum {
  production = `production`,
  recette = `recette`,
  sandbox = `sandbox`,
  preview = `preview`,
}
export const Env = z.nativeEnum(EnvEnum);

export const ZResGetHealthCheck = z
  .object({
    name: z.string(),
    version: z.string(),
    env: Env,
  })
  .describe("API Health");

export const SResGetHealthCheck = zodToJsonSchema(ZResGetHealthCheck);

export type IResGetHealthCheck = z.input<typeof ZResGetHealthCheck>;

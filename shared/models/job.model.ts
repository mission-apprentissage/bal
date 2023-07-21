import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "./common";

export enum JOB_STATUS_LIST {
  PENDING = "pending",
  WILLSTART = "will_start",
  RUNNING = "running",
  FINISHED = "finished",
  BLOCKED = "blocked",
  ERRORED = "errored",
}

const collectionName = "jobs" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZJob = () =>
  z
    .object({
      _id: zObjectId,
      name: z.string().describe("Le nom de la tâche"),
      status: z.nativeEnum(JOB_STATUS_LIST).describe("Statut courant du job"),
      sync: z.boolean().describe("Si le job est synchrone"),
      payload: z
        .record(z.any())
        .optional()
        .describe("La donnée liéé à la tâche"),
      output: z
        .record(z.any())
        .optional()
        .describe("Les valeurs de retours du job"),
      scheduled_at: z.date().describe("Date de lancement programmée"),
      started_at: z.date().optional().describe("Date de lancement"),
      ended_at: z.date().optional().describe("Date de fin d'execution"),
      updated_at: z.date().describe("Date de mise à jour en base de données"),
      created_at: z.date().describe("Date d'ajout en base de données"),
    })
    .strict();

export const SJob = zodToJsonSchema(ZJob(), toJsonSchemaOptions);

export type IJob = z.input<ReturnType<typeof ZJob>>;

export default {
  schema: SJob as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};

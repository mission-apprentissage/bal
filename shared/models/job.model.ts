import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "jobs" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ type: 1, scheduled_for: 1 }, { name: "type_scheduled_for" }],
  [{ type: 1, status: 1, scheduled_for: 1 }, { name: "type_status_scheduled_for" }],
  [{ type: 1, name: 1 }, {}],
  [{ ended_at: 1 }, { expireAfterSeconds: 3600 * 24 * 90 }], // 3 mois
];

const zCronName = z.enum(["Run daily jobs each day at 02h30"]).describe("Le nom de la tâche");

export const ZJobSimple = z
  .object({
    _id: zObjectId,
    name: z.string().describe("Le nom de la tâche"),
    type: z.literal("simple"),
    status: z.enum(["pending", "will_start", "running", "finished", "errored"]).describe("Statut courant du job"),
    sync: z.boolean().describe("Si le job est synchrone"),
    payload: z.record(z.unknown()).nullish().describe("La donnée liéé à la tâche"),
    output: z.record(z.unknown()).nullish().describe("Les valeurs de retours du job"),
    scheduled_for: z.date().describe("Date de lancement programmée"),
    started_at: z.date().nullish().describe("Date de lancement"),
    ended_at: z.date().nullish().describe("Date de fin d'execution"),
    updated_at: z.date().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const ZJobCron = z
  .object({
    _id: zObjectId,
    name: zCronName,
    type: z.literal("cron"),
    status: z.enum(["active"]).describe("Statut courant du cron"),
    cron_string: z.string().describe("standard cron string exemple: '*/2 * * * *'"),
    scheduled_for: z.date().describe("Date de lancement programmée"),
    updated_at: z.date().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const ZJobCronTask = z
  .object({
    _id: zObjectId,
    name: zCronName,
    type: z.literal("cron_task"),
    status: z.enum(["pending", "will_start", "running", "finished", "errored"]).describe("Statut courant du job"),
    scheduled_for: z.date().describe("Date de lancement programmée"),
    started_at: z.date().optional().describe("Date de lancement"),
    ended_at: z.date().optional().describe("Date de fin d'execution"),
    updated_at: z.date().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const ZJob = z.discriminatedUnion("type", [ZJobSimple, ZJobCron, ZJobCronTask]);

export type IJob = z.output<typeof ZJob>;
export type CronName = z.output<typeof zCronName>;

export type IJobsSimple = z.output<typeof ZJobSimple>;
export type IJobsCron = z.output<typeof ZJobCron>;
export type IJobsCronTask = z.output<typeof ZJobCronTask>;

export default {
  zod: ZJob,
  indexes,
  collectionName,
};

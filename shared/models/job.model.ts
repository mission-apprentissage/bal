import { FromSchema } from "json-schema-to-ts";
import { ObjectId } from "mongodb";

import { IModelDescriptor } from "./common";

const collectionName = "jobs";

const indexes: IModelDescriptor["indexes"] = [];

export const SJob = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    name: { type: "string", description: "Le nom de la tâche" },
    // worker_id: { type: "string" },
    // source: {
    //   type: "string",
    // },
    // document_id: {
    //   type: "string",
    //   description: "Fichier liste de diffusion",
    // },
    // document: SDocument,
    // user_id: {
    //   type: "string",
    // },
    status: {
      type: "string",
      description: "Statut courant du job",
      enum: [
        "pending",
        "will_start",
        "running",
        "finished",
        "blocked",
        "errored",
      ],
    },
    payload: {
      type: "object",
      description: "La donnée liéé à la tâche",
    },
    scheduled_at: {
      type: "string",
      format: "date-time",
      description: "Date de lancement programmée",
    },
    started_at: {
      type: "string",
      format: "date-time",
      description: "Date de lancement",
    },
    ended_at: {
      type: "string",
      format: "date-time",
      description: "Date de fin d'execution",
    },
    updated_at: {
      type: "string",
      format: "date-time",
      description: "Date de mise à jour en base de données",
    },
    created_at: {
      type: "string",
      format: "date-time",
      description: "Date d'ajout en base de données",
    },
  },
  required: ["_id", "name", "status", "scheduled_at"],
} as const;

export enum JOB_STATUS_LIST {
  PENDING = "pending",
  WILLSTART = "will_start",
  RUNNING = "running",
  FINISHED = "finished",
  BLOCKED = "blocked",
  ERRORED = "errored",
}

export interface IJob
  extends FromSchema<
    typeof SJob,
    {
      deserialize: [
        {
          pattern: {
            type: "string";
            format: "date-time";
          };
          output: Date | string;
        },
        {
          pattern: {
            type: "string";
            format: "ObjectId";
          };
          output: ObjectId;
        }
      ];
    }
  > {}

export default { schema: SJob, indexes, collectionName };

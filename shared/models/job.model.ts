import { FromSchema } from "json-schema-to-ts";

import { IModelDescriptor } from "./common";

const collectionName = "jobs";

const indexes: IModelDescriptor["indexes"] = [];

export const SJob = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string", description: "Le nom de la tâche" },

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
      enum: ["pending", "started", "running", "finished", "blocked", "errored"],
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
  required: ["_id", "name", "status", "started_at"],
} as const;

export enum JOB_STATUS_LIST {
  PENDING = "pending",
  FINISHED = "finished",
  STARTED = "started",
  RUNNING = "running",
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
        }
      ];
    }
  > {}

export default { schema: SJob, indexes, collectionName };

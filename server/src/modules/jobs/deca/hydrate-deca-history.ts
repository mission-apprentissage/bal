import { diff } from "deep-object-diff";
import { get } from "lodash-es";
import { ObjectId } from "mongodb";
import type { IDeca } from "shared/models/deca.model/deca.model";
import type { IDecaHistory } from "shared/models/deca.model/decaHistory.model";
import type { Primitive } from "type-fest";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

function deepFlattenToObject(obj: object, prefix = ""): Record<string, Primitive> {
  return Object.entries(obj).reduce<Record<string, Primitive>>((acc, [k, value]) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof value === "object" && value !== null) {
      Object.assign(acc, deepFlattenToObject(value, pre + k));
    } else {
      if (Array.isArray(value) && value.length > 0) {
        for (let index = 0; index < value.length; index++) {
          acc[pre + k + "." + index] = value[index];
        }
      } else {
        acc[pre + k] = value;
      }
    }
    return acc;
  }, {});
}

type EXCLUDED_FIELDS = "_id" | "created_at" | "updated_at" | "flag_correction";
const excludedFieldsFromHistory: EXCLUDED_FIELDS[] = ["_id", "created_at", "updated_at", "flag_correction"];

function pickComparedFields(originalDocument: IDeca): Omit<IDeca, EXCLUDED_FIELDS> {
  const { _id, created_at: _c, updated_at: _u, flag_correction: _f, ...rest } = originalDocument;
  return rest;
}

async function saveHistory(originalDocument: IDeca, newDocument: IDeca, updateTime: Date): Promise<void> {
  const oDiff = diff(pickComparedFields(originalDocument), pickComparedFields(newDocument));
  const updatedFields = deepFlattenToObject(oDiff);

  if (!updatedFields) {
    return;
  }

  for (const [key, updatedFieldValue] of Object.entries(updatedFields)) {
    if (!excludedFieldsFromHistory.some((f) => key === f || key.startsWith(`${f}.`))) {
      const previousValue = get(originalDocument, key);

      // détection et exclusion cas particulier faux positif si un élément est undefined et l'autre null
      const from = previousValue ?? null;
      const to = updatedFieldValue ?? null;

      if (from !== to) {
        const log: IDecaHistory = {
          _id: new ObjectId(),
          key,
          from: previousValue,
          to: updatedFieldValue,

          deca_id: originalDocument._id,
          time: updateTime,
        };

        await getDbCollection("decaHistory").insertOne(log);
      }
    }
  }
}

export { saveHistory };

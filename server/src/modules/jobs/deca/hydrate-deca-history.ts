import { diff } from "deep-object-diff";
import { get } from "lodash-es";
import { ObjectId } from "mongodb";
import { IDeca } from "shared/models/deca.model/deca.model";
import { IDecaHistory } from "shared/models/deca.model/decaHistory.model";
import { Primitive } from "type-fest";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepFlattenToObject(obj: object, prefix = ""): Record<string, Primitive> {
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

type EXCLUDED_FIELDS = "_id" | "created_at" | "updated_at";
const excludedFieldsFromHistory: EXCLUDED_FIELDS[] = ["_id", "created_at", "updated_at"];

async function saveHistory(
  originalDocument: IDeca,
  newDocument: Omit<IDeca, EXCLUDED_FIELDS>,
  updateTime: Date
): Promise<"no_history_to_save" | "history_saved"> {
  const oDiff = diff(originalDocument, newDocument);
  const updatedFields = deepFlattenToObject(oDiff);

  if (!updatedFields) {
    return "no_history_to_save";
  }

  let diffCount = 0;
  for (const [key, updatedFieldValue] of Object.entries(updatedFields)) {
    if (!excludedFieldsFromHistory.includes(key as EXCLUDED_FIELDS)) {
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
          // eslint-disable-next-line no-underscore-dangle
          deca_id: originalDocument._id,
          time: updateTime,
        };

        await getDbCollection("decaHistory").insertOne(log);
        diffCount++;
      }
    }
  }

  return diffCount ? "history_saved" : "no_history_to_save";
}

export { saveHistory };

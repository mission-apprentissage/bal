import { diff } from "deep-object-diff";
import { get } from "lodash-es";
import { ObjectId } from "mongodb";
import { IDeca } from "shared/models/deca.model/deca.model";
import { IDecaHistory } from "shared/models/deca.model/decaHistory.model";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

export function deepFlattenToObject(obj: any, prefix = "") {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(acc, deepFlattenToObject(obj[k], pre + k));
    } else {
      if (Array.isArray(obj[k]) && obj[k].length > 0) {
        for (let index = 0; index < obj[k].length; index++) {
          // @ts-expect-error
          acc[pre + k + "." + index] = obj[k][index];
        }
      } else {
        // @ts-expect-error
        acc[pre + k] = obj[k];
      }
    }
    return acc;
  }, {});
}

const excludedFieldsFromHistory: string[] = ["_id", "created_at", "updated_at"];
// const excludedFieldsFromHistory = ["type_employeur", "employeur_specifique", "type_derogation", "employeur.code_idcc"];

async function saveHistory(
  originalDocument: IDeca,
  newDocument: IDeca
): Promise<"no_history_to_save" | "history_saved"> {
  const oDiff = diff(originalDocument, newDocument);
  const updatedFields = deepFlattenToObject(oDiff);

  if (!updatedFields || Object.keys(updatedFields).length === 0) {
    return "no_history_to_save";
  }

  let diffCount = 0;
  for (const key of Object.keys(updatedFields)) {
    if (!excludedFieldsFromHistory.includes(key)) {
      const previousValue = get(originalDocument, key);

      // détection et exclusion cas particulier faux positif si un élément est undefined et l'autre null
      const from = previousValue !== undefined ? previousValue : null;
      const to = updatedFields[key] !== undefined ? updatedFields[key] : null;

      if (from !== to) {
        const log: IDecaHistory = {
          _id: new ObjectId(),
          key,
          from: previousValue,
          // @ts-expect-error
          to: updatedFields[key],
          // eslint-disable-next-line no-underscore-dangle
          deca_id: newDocument._id,
          //   op: event.operationType,
          time: newDocument.updated_at,
        };

        await getDbCollection("decaHistory").insertOne(log);
        diffCount++;
      }
    }
  }

  return diffCount ? "history_saved" : "no_history_to_save";
}

export { saveHistory };

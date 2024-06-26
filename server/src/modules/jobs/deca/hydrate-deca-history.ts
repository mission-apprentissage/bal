import { diff } from "deep-object-diff";
import { get } from "lodash-es";
import { ObjectId } from "mongodb";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

function deepFlattenToObject(obj: any, prefix = "") {
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

async function saveHistory(originalDocument, newDocument) {
  let updatedFields = null;

  const oDiff = diff(originalDocument, newDocument);
  updatedFields = deepFlattenToObject(oDiff);

  console.log("updatedFields : ", updatedFields);

  if (!updatedFields) return;

  for (const key of Object.keys(updatedFields)) {
    if (!excludedFieldsFromHistory.includes(key)) {
      const previousValue = get(originalDocument, key);
      const log = {
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

      console.log("saving diff", log);
      await getDbCollection("decaHistory").insertOne(log);
    }
  }
  /**
   * TODO réflexion pour éviter de réinsérer des données déjà traitées
   * Virer les promise all pool
   * renommer watcher
   */
}

export { saveHistory };

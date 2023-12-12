import { diff } from "deep-object-diff";
import { get } from "lodash-es";
import { ObjectId } from "mongodb";

import logger from "../../../common/logger";
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

const excludedFieldsFromHistory: string[] = [];
// const excludedFieldsFromHistory = ["type_employeur", "employeur_specifique", "type_derogation", "employeur.code_idcc"];
async function processChangeEvent(event: any): Promise<void> {
  let updatedFields = null;
  // if (event.operationType === "update") {
  //   updatedFields = event.updateDescription.updatedFields;
  // } else if (event.operationType === "replace") {
  const oDiff = diff(event.fullDocumentBeforeChange, event.fullDocument);
  updatedFields = deepFlattenToObject(oDiff);
  // }
  if (!updatedFields) return;

  for (const key of Object.keys(updatedFields)) {
    if (!excludedFieldsFromHistory.includes(key)) {
      const previousValue = get(event.fullDocumentBeforeChange, key);
      const log = {
        _id: new ObjectId(),
        key,
        from: previousValue,
        // @ts-expect-error
        to: updatedFields[key],
        // eslint-disable-next-line no-underscore-dangle
        resumeToken: event._id,
        // eslint-disable-next-line no-underscore-dangle
        deca_id: event.documentKey._id,
        //   op: event.operationType,
        time: new Date(event.clusterTime.getHighBits() * 1000),
      };
      await getDbCollection("decaHistory").insertOne(log);
    }
  }
}

function getNext(asyncIte: any) {
  let timeoutID: undefined | NodeJS.Timeout;
  const timeout: Promise<any> = new Promise((resolve) => {
    timeoutID = setTimeout(() => resolve(null), 1500);
  });
  return Promise.race([asyncIte.next(), timeout]).finally(() => clearTimeout(timeoutID));
}

async function createHistory() {
  logger.warn("***************DO NOT FORGET TO CLEAN excludedFieldsFromHistory");
  const lastHistory = await getDbCollection("decaHistory").findOne({}, { sort: { $natural: -1 } });

  const collection = await getDbCollection("deca");

  try {
    const changeStream = collection.watch(
      [
        {
          $match: {
            $or: [
              {
                operationType: "replace",
              },
              {
                operationType: "update",
              },
            ],
          },
        },
        {
          $project: {
            clusterTime: 1,
            documentKey: 1,
            fullDocumentBeforeChange: 1,
            fullDocument: 1,
            operationType: 1,
            updateDescription: 1,
          },
        },
      ],
      {
        batchSize: 10,
        fullDocumentBeforeChange: "required",
        fullDocument: "required",
        resumeAfter: lastHistory ? lastHistory.resumeToken : null,
      }
    );

    // changeStream.on("error", (error) => {
    //   console.log(error);
    //   if (error.name === "MongoError") {
    //   }
    // });

    if (!lastHistory) {
      for await (const event of changeStream) {
        await processChangeEvent(event);
      }
    } else {
      const asyncIte = changeStream[Symbol.asyncIterator]();

      const processNext: any = async (asyncIte: any) => {
        const next = await getNext(asyncIte);
        if (!next) return null;
        await processChangeEvent(next.value);
        return processNext(asyncIte);
      };
      await processNext(asyncIte);
    }

    await changeStream.close();
  } catch (error) {
    console.log(error);
  }
}

export { createHistory };

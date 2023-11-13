import { get } from "lodash-es";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

async function processChangeEvent(event: any): Promise<void> {
  const keys = Object.keys(event.updateDescription.updatedFields);
  for (const key of keys) {
    const previousValue = get(event.fullDocumentBeforeChange, key);
    const log = {
      key,
      from: previousValue,
      to: event.updateDescription.updatedFields[key],
      // eslint-disable-next-line no-underscore-dangle
      resumeToken: event._id,
      // eslint-disable-next-line no-underscore-dangle
      docId: event.documentKey._id,
      //   op: event.operationType,
      time: event.clusterTime,
    };
    await getDbCollection("decaHistory").insertOne(log);
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
            operationType: 1,
            updateDescription: 1,
          },
        },
      ],
      {
        batchSize: 10,
        fullDocumentBeforeChange: "required",
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

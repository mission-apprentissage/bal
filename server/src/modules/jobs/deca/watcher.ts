import { get } from "lodash-es";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

async function processChangeEvent(event: any): Promise<void> {
  console.log(event.updateDescription.updatedFields);
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
    console.log(log);
    await getDbCollection("deca_history").insertOne(log);
  }
}

function getNext(asyncIte) {
  let timeoutID: undefined | NodeJS.Timeout;
  const timeout: Promise<never> = new Promise((resolve) => {
    timeoutID = setTimeout(() => resolve(null), 1500);
  });
  return Promise.race([asyncIte.next(), timeout]).finally(() => clearTimeout(timeoutID));
}

async function startWatcher() {
  const lastHistory = await getDbCollection("deca_history").findOne({}, { sort: { $natural: -1 } });

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
    const asyncIte = changeStream[Symbol.asyncIterator]();

    const processNext = async (asyncIte) => {
      const next = await getNext(asyncIte);
      if (!next) return null;
      await processChangeEvent(next);
      return processNext(asyncIte);
    };
    await processNext(asyncIte);

    const hasNext = await changeStream.tryNext();
    if (hasNext) {
      await processChangeEvent(hasNext);

      let tokenTimeout = setTimeout(async () => {
        console.log("Timeout close");
        await changeStream.close();
      }, 2000);
      for await (const event of changeStream) {
        clearTimeout(tokenTimeout);
        await processChangeEvent(event);
        tokenTimeout = setTimeout(async () => {
          console.log("Timeout close");
          await changeStream.close();
        }, 1500);
      }
    } else if (!lastHistory) {
      for await (const event of changeStream) {
        await processChangeEvent(event);
      }
    }
    await changeStream.close();
  } catch (error) {
    console.log(error);
  }
}

export { startWatcher };

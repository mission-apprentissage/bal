import { captureException } from "@sentry/node";
import * as Sentry from "@sentry/node";
import { MongoClient } from "mongodb";
import { extensions } from "shared/helpers/zodHelpers/zodPrimitives";
import { ILbaEmailBlacklist } from "shared/models/data/lba.emailBlacklist.model";

import parentLogger from "@/common/logger";
import config from "@/config";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

const logger = parentLogger.child({ module: "job:lba:hydrate:email-balcklisted" });

const client = new MongoClient(config.lba.mongodb.uri);

export async function hydrateLbaBlackListed() {
  const count = { created: 0, updated: 0 };
  let totalCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processBuffer = async (buffer: any) => {
    await Promise.allSettled(buffer);

    totalCount += buffer.length;
  };

  try {
    await client.connect();

    const query = {};

    const cursor = client.db().collection<ILbaEmailBlacklist>(config.lba.mongodb.blacklistedDbCollection).find(query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promiseArray: Array<any> = [];
    for await (const document of cursor) {
      promiseArray.push(
        new Promise((res, rej) => {
          totalCount++;
          try {
            res(updateLbaBlacklistedEmail(document));
          } catch (e) {
            rej(`Échec de la mise à jour du document ${document._id}: ${e}`);
          }
        })
      );

      if (promiseArray.length === 100) {
        await processBuffer(promiseArray);
        promiseArray = [];
      }
    }

    if (promiseArray.length > 0) {
      await processBuffer(promiseArray);
      promiseArray = [];
    }
  } catch (err) {
    logger.error(`Échec de la mise à jour des effectifs: ${err}`);
    captureException(err);
  } finally {
    logger.info(
      `Mise à jour des email black listed terminée. Sur ${totalCount}, ${count.created} créés, ${count.updated} mis à jour.`
    );
  }
}

async function updateLbaBlacklistedEmail({ _id, ...document }: ILbaEmailBlacklist) {
  return Sentry.startSpan(
    {
      name: "Lba Update blacklisted email",
      op: "lba.blacklisted.item",
      forceTransaction: true,
    },
    async () => {
      try {
        // TODO: connect directly to LBA database with Read-Only client
        const emailNormalized = extensions.email.parse(document.email);
        await getDbCollection("lba.emailblacklists").updateOne(
          { email: emailNormalized },
          {
            $set: {
              ...document,
              updated_at: new Date(),
            },
          },
          { upsert: true }
        );
      } catch (error) {
        logger.error(`Échec de la mise à jour du document ${_id}: ${error}`);
      }
    }
  );
}

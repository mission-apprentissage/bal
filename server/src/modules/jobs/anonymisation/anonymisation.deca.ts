import { addYears } from "date-fns";
import { ZDecaAnonymised } from "shared/models/deca.model/deca.anonymised.model";
import type { IDecaAnonimised } from "shared/models/deca.model/deca.anonymised.model";
import type { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { internal } from "@hapi/boom";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { withCause } from "../../../common/services/errors/withCause";

export async function anonymisationDECA() {
  try {
    // Anonymise DECA documents
    const twoYearsAgo = addYears(new Date(), -2);

    const cursor = await getDbCollection("deca").find({
      date_fin_contrat: { $lt: twoYearsAgo },
    });

    const batchOpsAnom: AnyBulkWriteOperation<IDecaAnonimised>[] = [];
    const toDelete: ObjectId[] = [];

    const processBatch = async () => {
      if (batchOpsAnom.length === 0) return;

      // Write anonymised documents before deleting to be sure we don't lose data
      await getDbCollection("deca.anonimised").bulkWrite(batchOpsAnom);
      batchOpsAnom.length = 0;
      await getDbCollection("deca").deleteMany({
        _id: { $in: toDelete },
      });
      toDelete.length = 0;
    };

    for await (const doc of cursor) {
      const anonymisedDoc = ZDecaAnonymised.parse(doc);

      batchOpsAnom.push({
        updateOne: {
          // Preserve the original _id
          filter: { _id: anonymisedDoc._id },
          update: {
            $set: anonymisedDoc,
          },
          upsert: true,
        },
      });
      toDelete.push(anonymisedDoc._id);

      if (batchOpsAnom.length >= 1_000) {
        await processBatch();
      }
    }

    await processBatch();

    await getDbCollection("decaHistory").deleteMany({
      time: { $lt: twoYearsAgo },
    });
  } catch (error) {
    throw withCause(internal("An error occurred while running the DECA anonymisation job"), error, "fatal");
  }
}

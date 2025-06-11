import { Db, MongoClient } from "mongodb";

import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async (_db: Db, _client: MongoClient) => {
  await getDbCollection("mailingLists").updateMany(
    {},
    [
      {
        $set: {
          output_columns: {
            $map: {
              input: "$output_columns",
              in: {
                column: "$$this.column",
                output: "$$this.output",
                simple: { $not: "$$this.grouped" },
              },
            },
          },
        },
      },
    ],
    { bypassDocumentValidation: true }
  );
};

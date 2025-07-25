import type { Db, MongoClient } from "mongodb";

// Migration already done, commented to avoid conflicts with 20230829073910-transform_job_to_mailing_list
export const up = async (_db: Db, _client: MongoClient) => {
  // const matchingCollections = await db
  //   .listCollections({ name: "mailingLists" })
  //   .toArray();
  // if (matchingCollections.length === 0) {
  //   return;
  // }
  // const mailingLists = await db.collection("mailingLists").find({}).toArray();
  // await Promise.all(
  //   mailingLists.map(async (mailingList) => {
  //     return db.collection("jobs").insertOne({
  //       name: "mailingList",
  //       status: mailingList.status,
  //       payload: {
  //         document_id: mailingList.document_id,
  //         user_id: mailingList.user_id,
  //         source: mailingList.source,
  //         result: null,
  //         error: null,
  //       },
  //       sync: false,
  //       created_at: mailingList.created_at,
  //       updated_at: mailingList.updated_at,
  //       scheduled_for: mailingList.created_at,
  //       ended_at: mailingList.updated_at,
  //     });
  //   })
  // );
  // await db.dropCollection("mailingLists");
};

export const down = async (_db: Db, _client: MongoClient) => {};

export const up = async (db, _client) => {
  const mailingLists = await db.collection("mailingLists").find({});

  await Promise.all(
    mailingLists.map(async (mailingList) => {
      return db.collection("jobs").insertOne({
        name: "mailingList",
        status: mailingList.status,
        payload: {
          document_id: mailingList.document_id,
          user_id: mailingList.user_id,
          source: mailingList.source,
          result: null,
          error: null,
        },
        sync: false,
        created_at: mailingList.created_at,
        updated_at: mailingList.updated_at,
        scheduled_at: mailingList.created_at,
        ended_at: mailingList.updated_at,
      });
    })
  );

  await db.dropCollection("mailingLists");
};

export const down = async (_db, _client) => {};

export const up = async (db, _client) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  // Example:
  const test = await db.collection("users").find().toArray();
  console.log(test);
};

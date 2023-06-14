export const up = async (db) => {
  const documents = await db
    .collection("documents")
    .find({}, { projection: { type_document: 1, _id: 1 } })
    .toArray();

  for (const document of documents) {
    await db
      .collection("documentContents")
      .updateMany(
        { document_id: document._id.toString() },
        { $set: { type_document: document.type_document } },
        { bypassDocumentValidation: true }
      );
  }
};

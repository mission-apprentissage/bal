import { Db, MongoClient } from "mongodb";
import { IMailingListDocument, IUploadDocument } from "shared/models/document.model";

export const up = async (db: Db, _client: MongoClient) => {
  const uploadDocumentWitJobCursor = db.collection("documents").aggregate([
    { $match: { nom_fichier: /^(?!mailing-list)/, kind: null } },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "payload.document_id",
        as: "jobs",
      },
    },
  ]);

  for await (const uploadDocumentWitJob of uploadDocumentWitJobCursor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const job = uploadDocumentWitJob.jobs.filter((j: any) => j.name === "import:document")[0] ?? null;
    const update: Partial<IUploadDocument> = {
      kind: "upload",
      job_status: "pending",
      job_error: null,
      job_id: null,
    };

    if (job) {
      switch (job.status) {
        case "errored":
          update.job_status = "error";
          update.job_error = job.output?.error ?? "Unknown";
          break;
        case "finished":
          update.job_status = "done";
          break;
        case "pending":
        case "running":
        case "will_start":
          // Job crashed
          update.job_status = "error";
          update.job_error = "Unknown";
          break;
      }
      update.job_id = job._id.toString();
    } else {
      update.job_status = uploadDocumentWitJob.import_progress === 100 ? "done" : "error";
      update.job_error = uploadDocumentWitJob.import_progress === 100 ? null : "Unknown";
    }

    await db.collection("documents").updateOne({ _id: uploadDocumentWitJob._id }, { $set: update });
  }

  const mailingListDocumentWittJobAndMailingListCursor = db.collection("documents").aggregate([
    { $match: { nom_fichier: /^(mailing-list)/, kind: null } },
    { $addFields: { id: { $toString: "$_id" } } },
    {
      $lookup: {
        from: "mailingLists",
        localField: "id",
        foreignField: "document_id",
        as: "mailingList",
      },
    },
    {
      $unwind: {
        path: "$mailingList",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        mailingListId: {
          $toString: "$mailingList._id",
        },
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "mailingListId",
        foreignField: "payload.mailing_list_id",
        as: "jobs",
      },
    },
  ]);

  for await (const doc of mailingListDocumentWittJobAndMailingListCursor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const job = doc.jobs.filter((j: any) => j.name === "generate:mailing-list")[0] ?? null;
    const update: Partial<IMailingListDocument> = {
      kind: "mailingList",
      job_status: "pending",
      job_id: null,
    };
    if (job) {
      switch (job.status) {
        case "errored":
          update.job_status = "error";
          break;
        case "finished":
          update.job_status = "done";
          break;
        case "pending":
        case "running":
        case "will_start":
          // Job crashed
          update.job_status = "error";
          break;
      }
      update.job_id = job._id.toString();
    } else {
      update.job_status = doc.mailingLists?.status === "done" ? "done" : "error";
    }

    await db.collection("documents").updateOne({ _id: doc._id }, { $set: update }, { bypassDocumentValidation: true });
  }

  await db.collection("mailingLists").updateMany({}, { $unset: { status: 1 } }, { bypassDocumentValidation: true });
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);
  if (collectionNames.includes("jobs")) {
    await db.dropCollection("jobs");
  }
  await db.collection("session").deleteMany({});
};

export const down = async (_db: Db, _client: MongoClient) => {};

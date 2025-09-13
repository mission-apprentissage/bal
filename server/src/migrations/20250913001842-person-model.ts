import type { ObjectId } from "mongodb";
import { getDbCollection } from "../common/utils/mongodbUtils";

type IPersonLegacy = {
  _id: ObjectId;
  email: string;
  civility?: string | undefined;
  nom?: string | undefined;
  prenom?: string | undefined;
  organisations: string[];
  sirets?: string[] | undefined;
  _meta: { sources: string[] };
  updated_at?: Date | undefined;
  created_at?: Date | undefined;
};

export const up = async () => {
  await getDbCollection("persons").updateMany(
    { civility: { $exists: true } },
    { $unset: { civility: "" } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("persons").updateMany(
    { nom: { $exists: false } },
    { $set: { nom: null } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("persons").updateMany(
    { prenom: { $exists: false } },
    { $set: { prenom: null } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("persons").updateMany(
    { sirets: { $exists: false } },
    { $set: { sirets: [] } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("persons").updateMany(
    { _meta: { $exists: false } },
    { $set: { _meta: { sources: [] } } },
    { bypassDocumentValidation: true }
  );

  const c1 = getDbCollection("persons").find<IPersonLegacy>({ updated_at: { $exists: false } });
  for await (const doc of c1) {
    await getDbCollection("persons").updateOne(
      { _id: doc._id },
      { $set: { updated_at: new Date(doc._id.getTimestamp()) } },
      { bypassDocumentValidation: true }
    );
  }

  const c2 = getDbCollection("persons").find<IPersonLegacy>({ created_at: { $exists: false } });
  for await (const doc of c2) {
    await getDbCollection("persons").updateOne(
      { _id: doc._id },
      { $set: { created_at: new Date(doc._id.getTimestamp()) } },
      { bypassDocumentValidation: true }
    );
  }

  const c3 = getDbCollection("persons").find<IPersonLegacy>({ email_domain: { $exists: true } });
  for await (const doc of c3) {
    const [_, domain] = doc.email.split("@");
    await getDbCollection("persons").updateOne(
      { _id: doc._id },
      { $set: { email_domain: domain } },
      { bypassDocumentValidation: true }
    );
  }
};

export const requireShutdown: boolean = true;

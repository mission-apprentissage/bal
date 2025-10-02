import { ObjectId } from "mongodb";
import { getDbCollection } from "../common/utils/mongodbUtils";

type IUserLegacy = {
  _id: ObjectId;
  email: string;
  password: string;
  person_id: string;
  is_admin?: boolean | undefined;
  is_support?: boolean | undefined;
  api_key?: string | undefined;
  api_key_used_at?: Date | null | undefined;
  updated_at?: Date | null | undefined;
  created_at?: Date | null | undefined;
};

export const up = async () => {
  const cursor = getDbCollection("users").find<IUserLegacy>({ person_id: { $exists: true } });
  for await (const user of cursor) {
    if (user.person_id) {
      await getDbCollection("persons").deleteMany({ _id: new ObjectId(user.person_id) });
    }
  }
  await getDbCollection("users").updateMany({}, { $unset: { person_id: "" } }, { bypassDocumentValidation: true });

  await getDbCollection("users").updateMany(
    { is_admin: { $exists: false } },
    { $set: { is_admin: false } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("users").updateMany(
    { is_support: { $exists: false } },
    { $set: { is_support: false } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("users").updateMany(
    { api_key: { $exists: false } },
    { $set: { api_key: null } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("users").updateMany(
    { api_key_used_at: { $exists: false } },
    { $set: { api_key_used_at: null } },
    { bypassDocumentValidation: true }
  );

  const cursor2 = getDbCollection("users").find({ updated_at: { $exists: false } });
  for await (const user of cursor2) {
    await getDbCollection("users").updateOne(
      { _id: user._id },
      { $set: { updated_at: new Date(user._id.getTimestamp()) } },
      { bypassDocumentValidation: true }
    );
  }

  const cursor3 = getDbCollection("users").find({ created_at: { $exists: false } });
  for await (const user of cursor3) {
    await getDbCollection("users").updateOne(
      { _id: user._id },
      { $set: { created_at: new Date(user._id.getTimestamp()) } },
      { bypassDocumentValidation: true }
    );
  }
};

export const requireShutdown: boolean = true;

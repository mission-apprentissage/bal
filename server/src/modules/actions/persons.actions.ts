import type { AnyBulkWriteOperation } from "mongodb";
import { ObjectId } from "mongodb";
import type { IPerson } from "shared/models/person.model";
import { z } from "zod/v4-mini";
import { getDbCollection } from "@/common/utils/mongodbUtils";

type IImportPerson = {
  email: unknown;
  siret: unknown;
  source: string;
};

export function getImportPersonBulkOp(data: IImportPerson): AnyBulkWriteOperation<IPerson>[] {
  const now = new Date();

  const emailParsed = z.email().check(z.lowercase()).safeParse(data.email);
  const siretParsed = z.string().safeParse(data.siret);

  if (!emailParsed.success || !siretParsed.success) {
    return [];
  }

  type UniquePersonField = "email" | "siret" | "source";

  const setOnInsert: Omit<IPerson, UniquePersonField | "updated_at"> = {
    _id: new ObjectId(),
    created_at: now,
  };

  return [
    {
      updateOne: {
        filter: {
          email: emailParsed.data,
          source: data.source,
          siret: siretParsed.data,
        },
        update: {
          $set: { updated_at: now },
          $setOnInsert: setOnInsert,
        },
        upsert: true,
      },
    },
  ];
}

export async function bulkWritePersons(
  ops: AnyBulkWriteOperation<IPerson>[]
): Promise<{ created: number; updated: number }> {
  if (ops.length === 0) {
    return { created: 0, updated: 0 };
  }

  const result = await getDbCollection("persons").bulkWrite(ops, { ordered: false });
  return { created: result.upsertedCount, updated: result.modifiedCount };
}

export async function importPerson(data: IImportPerson): Promise<boolean> {
  const ops = getImportPersonBulkOp(data);

  if (ops.length === 0) {
    return false;
  }

  await getDbCollection("persons").bulkWrite(ops);

  return true;
}

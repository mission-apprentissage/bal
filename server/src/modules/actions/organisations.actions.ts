import { isCompanyDomain } from "company-email-validator";
import { ObjectId } from "mongodb";
import type { AnyBulkWriteOperation } from "mongodb";
import { getSirenFromSiret } from "shared/helpers/common";
import type { IOrganisation } from "shared/models/organisation.model";
import { z } from "zod/v4-mini";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type IImportOrganisation = {
  email: unknown;
  source: string;
  siret: unknown;
  ttl: Date;
};

export function getImportOrganisationBulkOp(data: IImportOrganisation): AnyBulkWriteOperation<IOrganisation>[] {
  const emailParsed = z.email().check(z.lowercase()).safeParse(data.email);
  const siretParsed = z.string().safeParse(data.siret);

  if (!emailParsed.success || !siretParsed.success) {
    return [];
  }

  const [_, domain] = emailParsed.data.split("@");
  const siren = getSirenFromSiret(siretParsed.data);

  if (!isCompanyDomain(domain)) {
    return [];
  }

  const now = new Date();

  type UniqueOrganisationField = "siren" | "email_domain" | "source";

  const setOnInsert: Omit<IOrganisation, UniqueOrganisationField | "updated_at" | "ttl"> = {
    _id: new ObjectId(),
    created_at: now,
  };

  return [
    {
      updateOne: {
        filter: { siren, email_domain: domain.toLowerCase(), source: data.source },
        update: {
          $setOnInsert: setOnInsert,
          $set: { updated_at: now, ttl: data.ttl },
        },
        upsert: true,
      },
    },
  ];
}

export async function bulkWriteOrganisations(
  ops: AnyBulkWriteOperation<IOrganisation>[]
): Promise<{ created: number; updated: number }> {
  if (ops.length === 0) {
    return { created: 0, updated: 0 };
  }

  const result = await getDbCollection("organisations").bulkWrite(ops, { ordered: false });
  return { created: result.upsertedCount, updated: result.modifiedCount };
}

export async function importOrganisation(data: IImportOrganisation): Promise<boolean> {
  const ops = getImportOrganisationBulkOp(data);

  if (ops.length === 0) {
    return false;
  }

  await getDbCollection("organisations").bulkWrite(ops);

  return true;
}

export const updateOrganisation = async (organisation: IOrganisation, data: Partial<IOrganisation>) => {
  if (Object.keys(data).length === 0) {
    return organisation;
  }

  return await getDbCollection("organisations").findOneAndUpdate(
    {
      _id: organisation._id,
    },
    {
      $set: { ...data, updated_at: new Date() },
    },
    { returnDocument: "after" }
  );
};

export const sanitizeOrganisationDomains = async () => {
  const cursor = getDbCollection("organisations").find();

  for await (const organisation of cursor) {
    // Suppression des organisations dont le domaine n'est pas un domaine d'entreprise
    if (!isCompanyDomain(organisation.email_domain)) {
      await getDbCollection("organisations").deleteOne({ _id: organisation._id });
    }
  }
};

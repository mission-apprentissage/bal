import { isCompanyDomain } from "company-email-validator";
import { addDays } from "date-fns";
import { ObjectId } from "mongodb";
import type { AnyBulkWriteOperation } from "mongodb";
import type { IOrganisation } from "shared/models/organisation.model";
import type { IPerson } from "shared/models/person.model";
import { read, utils } from "xlsx";
import { z } from "zod/v4-mini";

import { bulkWriteOrganisations } from "../../actions/organisations.actions";
import { bulkWritePersons, getImportPersonBulkOp } from "../../actions/persons.actions";
import { getFromStorage } from "@/common/utils/ovhUtils";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:hydrate_from_akto" });

const STORAGE_PATH = "akto/contacts.xlsx";
const SOURCE = "akto";

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  return Buffer.concat(chunks);
}

function getOrganisationBulkOp(siren: string, email: string, ttl: Date): AnyBulkWriteOperation<IOrganisation>[] {
  const emailParsed = z.email().check(z.lowercase()).safeParse(email);
  if (!emailParsed.success) return [];

  const [, domain] = emailParsed.data.split("@");
  if (!isCompanyDomain(domain)) return [];

  const now = new Date();
  return [
    {
      updateOne: {
        filter: { siren, email_domain: domain, source: SOURCE },
        update: {
          $set: { updated_at: now, ttl },
          $setOnInsert: { _id: new ObjectId(), created_at: now },
        },
        upsert: true,
      },
    },
  ];
}

type AktoRow = {
  SIREN: string;
  SIRET: string;
  "Raison Sociale": string;
  "IDCC - Branche": string;
  Typologie: string;
  "Effectif moyen annuel de l'entreprise": string;
  Email: string;
  "Nom complet": string;
};

export async function hydrateFromAkto(signal: AbortSignal): Promise<void> {
  logger.info("downloading akto contact file from storage");

  const fileStream = await getFromStorage(STORAGE_PATH, "main", signal);
  const fileBuffer = await streamToBuffer(fileStream);

  const workbook = read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json<AktoRow>(sheet, { defval: "" });

  logger.info(`${rows.length} rows to process`);

  const ttl = addDays(new Date(), 30);

  let ops: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] } = {
    personOps: [],
    organisationOps: [],
  };

  let done = 0;

  const flush = async () => {
    await Promise.all([bulkWritePersons(ops.personOps), bulkWriteOrganisations(ops.organisationOps)]);
    ops = { personOps: [], organisationOps: [] };
  };

  for (const row of rows) {
    signal.throwIfAborted();

    const siren = String(row["SIREN"] ?? "").trim();
    const siret = String(row["SIRET"] ?? "").trim() || null;
    const email = String(row["Email"] ?? "").trim();

    if (siret) {
      ops.personOps.push(...getImportPersonBulkOp({ email, siret, source: SOURCE, ttl }));
    }

    if (siren) {
      ops.organisationOps.push(...getOrganisationBulkOp(siren, email, ttl));
    }

    if (ops.personOps.length > 1000 || ops.organisationOps.length > 1000) {
      await flush();
      logger.info(`processed ${done} / ${rows.length} rows`);
    }

    done++;
  }

  await flush();
  logger.info(`done: ${done} rows processed`);
}

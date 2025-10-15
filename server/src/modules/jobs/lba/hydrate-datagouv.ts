import { Readable, Transform } from "node:stream";
import { pipeline } from "stream/promises";
import { parse } from "csv-parse";
import { getSirenFromSiret } from "shared/helpers/common";
import z from "zod";
import type { IOrganisation } from "shared/models/organisation.model";
import { ObjectId } from "mongodb";
import { addYears } from "date-fns";
import { getDbCollection } from "../../../common/utils/mongodbUtils";

interface DataGouvRecord {
  siret: string;
  domain_email: string;
  data_source: "moncomptepro" | "trackdechets_postal_mail" | "alternance_job_contracted";
}

export const hydrateDataGouv = async (): Promise<void> => {
  const url = "https://www.data.gouv.fr/fr/datasets/r/4208f064-e655-4bad-93c9-9a3977f3f8cc";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const now = new Date();
  const ttl = addYears(new Date(), 1);

  const filterTransform = new Transform({
    objectMode: true,
    transform(chunk: DataGouvRecord, _, callback) {
      if (chunk.data_source !== "alternance_job_contracted") {
        callback(null, chunk);
      } else {
        callback();
      }
    },
  });

  const saveTransform = new Transform({
    objectMode: true,
    async transform(chunk: DataGouvRecord, _, callback) {
      const siretParsed = z.string().safeParse(chunk.siret);
      if (!siretParsed.success) {
        return callback();
      }

      const siren = getSirenFromSiret(siretParsed.data);

      const input: Omit<IOrganisation, "updated_at" | "ttl"> = {
        _id: new ObjectId(),
        siren,
        email_domain: chunk.domain_email.toLowerCase(),
        source: chunk.data_source,
        created_at: now,
      };

      await getDbCollection("organisations").updateOne(
        { siren, email_domain: chunk.domain_email.toLowerCase(), source: chunk.data_source },
        {
          $setOnInsert: input,
          $set: { updated_at: now, ttl },
        },
        {
          upsert: true,
        }
      );

      callback();
    },
  });

  await pipeline(
    Readable.fromWeb(response.body),
    parse({ columns: true, skip_empty_lines: true }),
    filterTransform,
    saveTransform
  );
};

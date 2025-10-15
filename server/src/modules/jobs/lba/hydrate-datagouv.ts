import { Readable, Transform } from "node:stream";
import { pipeline } from "stream/promises";
import { createWriteStream, createReadStream } from "fs";
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

const downloadDataGouvFile = async (url: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  const tempFile = `/tmp/datagouv-${Date.now()}.csv`;

  if (response.body) {
    await pipeline(Readable.fromWeb(response.body), createWriteStream(tempFile));
  }

  console.log(`Downloaded to ${tempFile}`);

  return tempFile;
};

const parseCSVFile = async (filePath: string): Promise<DataGouvRecord[]> => {
  const allData: DataGouvRecord[] = [];

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row: DataGouvRecord) => {
        allData.push(row);
      })
      .on("end", () => {
        console.log(`Parsed ${allData.length} total records`);
        resolve(allData);
      })
      .on("error", reject);
  });
};

export const hydrateDataGouv = async (): Promise<void> => {
  const url = "https://www.data.gouv.fr/fr/datasets/r/4208f064-e655-4bad-93c9-9a3977f3f8cc";
  const tempFile = await downloadDataGouvFile(url);
  const data = await parseCSVFile(tempFile);
  const filtered = data.filter((x) => x.data_source !== "alternance_job_contracted");

  const now = new Date();
  const ttl = addYears(new Date(), 1);

  const transform = new Transform({
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

  await pipeline(Readable.from(filtered), transform);
};

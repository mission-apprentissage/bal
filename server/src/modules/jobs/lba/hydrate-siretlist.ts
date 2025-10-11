import fs from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Transform } from "node:stream";
import type { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { internal } from "@hapi/boom";
import { z } from "zod/v4-mini";
import type { AnyBulkWriteOperation } from "mongodb";
import type { IPerson } from "shared/models/person.model";
import type { IOrganisation } from "shared/models/organisation.model";
import { addYears } from "date-fns";
import { withCause } from "../../../common/services/errors/withCause";
import { s3ReadAsStream } from "../../../common/utils/awsUtils";
import { streamJsonArray } from "../../../common/utils/streamUtils";
import { bulkWritePersons, getImportPersonBulkOp } from "../../actions/persons.actions";
import { bulkWriteOrganisations, getImportOrganisationBulkOp } from "../../actions/organisations.actions";
import config from "@/config";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:lba:hydrate:siret-list" });

const s3File = config.lba.algoRecuteurs.s3File;

const schema = z.object({
  siret: z.string(),
  email: z.string(),
});

export async function importPersonFromAlgoLba() {
  logger.info(`Downloading algo file from S3 Bucket...`);
  const destFile = await downloadFile();

  let buffer: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] } =
    {
      personOps: [],
      organisationOps: [],
    };

  const ttl = addYears(new Date(), 1);

  await pipeline(
    fs.createReadStream(destFile),
    streamJsonArray(),
    new Transform({
      objectMode: true,
      transform: async (data: unknown, _encoding, callback) => {
        const parsed = schema.safeParse(data);

        if (!parsed.success) {
          callback();
          return;
        }

        const input = {
          email: parsed.data.email,
          source: "LBA_ALGO",
          siret: parsed.data.siret,
          ttl,
        };

        const personOps = getImportPersonBulkOp(input);
        const organisationOps = getImportOrganisationBulkOp(input);
        callback(null, { personOps, organisationOps });
      },
    }),

    // Regroup bulks operations to make batch of 1000
    new Transform({
      objectMode: true,
      transform: function (
        data: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] },
        _encoding,
        callback
      ) {
        if (data.personOps.length > 0) {
          buffer.personOps.push(...data.personOps);
        }

        if (data.organisationOps.length > 0) {
          buffer.organisationOps.push(...data.organisationOps);
        }

        if (buffer.personOps.length > 1000 || buffer.organisationOps.length > 1000) {
          const output = buffer;
          buffer = { personOps: [], organisationOps: [] };
          callback(null, output);
        } else {
          callback();
        }
      },
      flush: function (callback) {
        callback(null, buffer);
      },
    }),

    new Transform({
      objectMode: true,
      transform: async (
        data: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] },
        _encoding,
        callback
      ) => {
        try {
          await Promise.all([bulkWritePersons(data.personOps), bulkWriteOrganisations(data.organisationOps)]);
          callback();
        } catch (error) {
          logger.error("Error importing person or organisation", { error });
          callback(error);
        }
      },
    })
  );
}

async function downloadFile(): Promise<string> {
  try {
    // @ts-expect-error
    const response = (await s3ReadAsStream("storage", s3File)) as Readable;
    return await downloadFileAsTmp(response, "recruteurslba.json");
  } catch (error) {
    throw withCause(
      internal("lba.recruteurs: unable to downloadFile", { file: config.lba.algoRecuteurs.s3File }),
      error
    );
  }
}

async function downloadFileAsTmp(stream: Readable, filename: string): Promise<string> {
  const tmpDir = await mkdtemp(join(tmpdir(), `bal-download-${config.env}-`));
  const destFile = join(tmpDir, filename);

  try {
    await writeFile(destFile, stream);

    return destFile;
  } catch (error) {
    await cleanupTmp(destFile);
    throw withCause(internal("bal.utils.downloadFileAsTmp: unable to download file"), error);
  }
}

async function cleanupTmp(filePath: string): Promise<void> {
  try {
    await rm(dirname(filePath), { force: true, recursive: true });
  } catch (error) {
    // We are ignoring the error if the file does not exist (already cleaned up)
    if (error.code === "ENOENT") {
      return;
    }

    throw withCause(internal("bal.utils: unable to cleanup downloaded file"), error);
  }
}

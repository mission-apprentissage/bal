import fs from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { Readable } from "node:stream";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { internal } from "@hapi/boom";

import type { ILbaMailingContact } from "shared/models/data/lba.mailingList.model";
import { EmailStatus, ZLbaMailingContact } from "shared/models/data/lba.mailingList.model";
import { ObjectId } from "mongodb";
import { withCause } from "../../../common/services/errors/withCause";
import { s3ReadAsStream } from "../../../common/utils/awsUtils";
import { streamJsonArray } from "../../../common/utils/streamUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import config from "@/config";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:lba:hydrate:company-email-list" });

const s3File = config.lba.companyEmailList.s3File;

export async function importCompanyEmailsForLbaMailing() {
  logger.info(`Downloading algo file from S3 Bucket...`);
  const destFile = await downloadFile();

  let buffer: ILbaMailingContact[] = [];

  await pipeline(
    fs.createReadStream(destFile),
    streamJsonArray(),
    new Transform({
      objectMode: true,
      transform: async (data: unknown, _encoding, callback) => {
        const parsed = ZLbaMailingContact.safeParse(data);

        if (!parsed.success) {
          callback();
          return;
        }

        callback(null, parsed.data);
      },
    }),

    // Regroup bulks operations to make batch of 1000
    new Transform({
      objectMode: true,
      transform: function (data: ILbaMailingContact, _encoding, callback) {
        buffer.push(data);

        if (buffer.length >= 1000) {
          logger.info(`Processing batch of ${buffer.length} contacts...`);
          const output = buffer;
          buffer = [];
          callback(null, output);
        } else {
          callback();
        }
      },
      flush: function (callback) {
        logger.info(`Flushing batch of ${buffer.length} contacts...`);
        callback(null, buffer);
      },
    }),

    new Transform({
      objectMode: true,
      transform: async (data: ILbaMailingContact[], _encoding, callback) => {
        try {
          logger.info(`Storing ${data.length} mailingList contacts...`);
          const now = new Date();

          await getDbCollection("lba.mailingLists").bulkWrite(
            data.map((lbaMailingContact) => ({
              updateOne: {
                filter: { siret: lbaMailingContact.siret },
                update: {
                  $set: { ...lbaMailingContact, updated_at: now },
                  $setOnInsert: {
                    _id: new ObjectId(),
                    nbContrats: null,
                    nbSocietesMemeNaf: null,
                    emailStatus: EmailStatus.UNVERIFIED,
                    created_at: now,
                  },
                },
                upsert: true,
              },
            })),
            {
              ordered: false,
            }
          );

          callback();
        } catch (error) {
          logger.error("Error storing mailingList contacts", { error });
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

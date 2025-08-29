import fs from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { Readable } from "node:stream";

import { internal } from "@hapi/boom";
import { compose, oleoduc, writeData } from "oleoduc";
import { extensions } from "shared/helpers/zodHelpers/zodPrimitives";
import type { ILbaRecruteursSiretEmail } from "shared/models/data/lba.recruteurs.siret.email.model";

import { withCause } from "../../../common/services/errors/withCause";
import { getS3FileLastUpdate, s3ReadAsStream } from "../../../common/utils/awsUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { streamJsonArray } from "../../../common/utils/streamUtils";
import config from "@/config";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:lba:hydrate:siret-list" });

const s3File = config.lba.algoRecuteurs.s3File;

export async function hydrateLbaSiretList() {
  const isAlgoFileUptoDate = await verifyAlgoFileDate();
  if (!isAlgoFileUptoDate) {
    logger.info(`Downloading algo file from S3 Bucket...`);
    const destFile = await downloadFile();

    await oleoduc(
      await readJson(destFile),
      writeData(async ({ siret, email }: { siret: string; email: string | null }) => {
        if (email) {
          try {
            const emailNormalized = extensions.email.parse(email);
            return getDbCollection("lba.recruteurs.siret.email").updateOne(
              { email: emailNormalized },
              {
                $set: {
                  siret,
                  email: emailNormalized,
                  updated_at: new Date(),
                },
                $setOnInsert: {
                  created_at: new Date(),
                },
              },
              { upsert: true }
            );
          } catch (_error) {
            //
          }
        }
        return;
      })
    );
  }
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

const readJson = async (filePath: string) => {
  logger.info(`Reading bonnes boites json`);

  const streamCompanies = async () => {
    const response = fs.createReadStream(filePath);
    return compose(response, streamJsonArray());
  };

  return streamCompanies();
};

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

const verifyAlgoFileDate = async () => {
  const algoFileLastModificationDate = await getS3FileLastUpdate("storage", s3File);
  if (!algoFileLastModificationDate) {
    throw new Error("Aucune date de dernière modifications disponible sur le fichier issue de l'algo.");
  }

  const currentDbCreatedDate = (
    (await getDbCollection("lba.recruteurs.siret.email").findOne(
      {},
      { projection: { created_at: 1 } }
    )) as ILbaRecruteursSiretEmail
  ).created_at;

  if (algoFileLastModificationDate.getTime() < currentDbCreatedDate.getTime()) {
    logger.info("Sociétés issues de l'algo déjà à jour");
    return true;
  }
  return false;
};

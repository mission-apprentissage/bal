import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
import type { MultipartFile } from "@fastify/multipart";
import { badRequest, conflict, notFound, unauthorized } from "@hapi/boom";
import { ObjectId } from "mongodb";
import type { IMailingListV2 } from "shared/models/mailingListV2.model";
import type { IUser } from "shared/models/user.model";
import { addDays, differenceInSeconds } from "date-fns";
import { canScheduleParse } from "shared/mailing-list/mailing-list.utils";
import { checksum, cipher, generateKey } from "../../../../common/utils/cryptoUtils";
import { getMailingListStoragePath } from "../storage/mailing-list-storage";
import { clamav } from "../../../../services";
import logger from "../../../../common/logger";
import { updateUploadTtl, uploadToStorage } from "../../../../common/utils/ovhUtils";
import { sleep } from "../../../../common/utils/asyncUtils";
import { getDbCollection } from "../../../../common/utils/mongodbUtils";
import { scheduleMailingListJob } from "../mailing-list.processor";

type IImportParams = {
  name: string;
  delimiter: string;
  expiresInDays: number;
  file: MultipartFile;
};

const validateFile = (file: MultipartFile) => {
  if (file.mimetype !== "text/csv") {
    return false;
  }

  if (!file.filename.endsWith(".csv")) {
    return false;
  }

  return true;
};

export async function createMailingList(
  { name, delimiter, expiresInDays, file }: IImportParams,
  user: IUser
): Promise<IMailingListV2> {
  if (!validateFile(file)) {
    throw unauthorized("Le fichier n'est pas au bon format");
  }

  const now = new Date();
  const mailingListWithoutSource: Omit<IMailingListV2, "source"> = {
    _id: new ObjectId(),
    name,
    encode_key: generateKey(),
    created_at: now,
    updated_at: now,
    added_by: user._id,
    ttl: addDays(now, expiresInDays),
    config: {
      email_column: "",
      output_columns: [],
      lba_columns: null,
    },
    progress: {
      parse: 0,
      generate: 0,
      export: 0,
    },
    output: {
      lines: 0,
      empty_source_lines: 0,
      blacklisted_email_count: 0,
      invalid_email_count: 0,
    },
    status: "initial",
    job_id: null,
  };

  const { source: path, account } = getMailingListStoragePath(mailingListWithoutSource._id);

  const { scanStream, getScanResults } = await clamav.getScanner();
  const { hashStream, getHash } = checksum();
  let fileSize = 0;

  await pipeline(
    file.file,
    scanStream,
    new Transform({
      transform(chunk, _encoding, callback) {
        fileSize += chunk.length;
        // Push the chunk to the next stream in the pipeline
        this.push(chunk);
        callback();
      },
    }),
    hashStream,
    cipher(mailingListWithoutSource.encode_key),
    // Initial TTL is 1 hour, will be updated later
    await uploadToStorage(path, account, 3_600, "text/csv")
  );

  logger.info(`File ${path} uploaded to storage`);

  const hash_fichier = await getHash();
  const { isInfected, viruses } = await getScanResults();

  if (isInfected) {
    const listViruses = viruses.join(",");
    logger.error(`Uploaded file ${path} is infected by ${listViruses}. Deleting file from storage...`);

    throw badRequest("Le contenu du fichier est invalide", { viruses });
  }

  await sleep(5_000); // Wait for 5 second to ensure the file is fully processed

  // Update TTL only when the file is successfully uploaded with no viruses
  await updateUploadTtl(path, "main", differenceInSeconds(mailingListWithoutSource.ttl, new Date()));

  const mailingList: IMailingListV2 = {
    ...mailingListWithoutSource,
    source: {
      file: {
        hash_fichier,
        delimiter,
        size: fileSize,
      },
      lines: 0, // Will be updated later during parsing
      columns: [], // Will be updated later during parsing
    },
  };

  await getDbCollection("mailingListsV2").insertOne(mailingList);

  await scheduleMailingListJob(mailingList._id, "parse:scheduled");

  return mailingList;
}

export async function updateMailingListParseSettings(
  id: ObjectId,
  { name, delimiter, expiresInDays }: Omit<IImportParams, "file">
) {
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: id,
  });

  if (!mailingList) {
    throw notFound("La liste de diffusion n'existe pas");
  }

  if (!canScheduleParse(mailingList)) {
    throw conflict("La liste de diffusion ne peut pas être modifiée");
  }

  const now = new Date();
  await getDbCollection("mailingListsV2").updateOne(
    {
      _id: mailingList._id,
    },
    {
      $set: {
        name,
        "source.file.delimiter": delimiter,
        "source.lines": 0,
        "source.columns": [],
        "progress.parse": 0,
        ttl: addDays(now, expiresInDays),
        updated_at: now,
      },
    }
  );

  // Clean des documents orphelins
  await getDbCollection("mailingList.source").deleteMany({ mailing_list_id: mailingList._id });

  await scheduleMailingListJob(mailingList._id, "parse:scheduled");
}

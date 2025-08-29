import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
import type { IMailingListV2 } from "shared/models/mailingListV2.model";
import type { IJobsSimple } from "job-processor";
import { internal } from "@hapi/boom";
import { ObjectId } from "mongodb";
import type { AnyBulkWriteOperation } from "mongodb";
import { parse } from "csv-parse";
import type { Info } from "csv-parse";
import { ZMailingListSource } from "shared/models/mailingList.source.model";
import type { IMailingListSource } from "shared/models/mailingList.source.model";
import { z } from "zod/v4-mini";
import { getDbCollection } from "../../../../common/utils/mongodbUtils";
import { getFromStorage } from "../../../../common/utils/ovhUtils";
import { decipher } from "../../../../common/utils/cryptoUtils";
import { withCause } from "../../../../common/services/errors/withCause";
import { createBatchTransformStream } from "../../../../common/utils/streamUtils";
import { getMailingListStoragePath } from "../storage/mailing-list-storage";

export async function parseMailingList(
  mailingList: IMailingListV2,
  job: IJobsSimple,
  signal: AbortSignal
): Promise<void> {
  const lastImported = await getDbCollection("mailingList.source").findOne(
    {
      mailing_list_id: mailingList._id,
    },
    { sort: { line_number: -1 } }
  );

  const skipCount = lastImported?.line_number ?? 0;

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: "parse:in_progress",
        job_id: job._id,
        updated_at: new Date(),
        "source.lines": lastImported?.line_number ?? 0,
      },
    }
  );

  const parser = parse({
    trim: true,
    delimiter: mailingList.source.file.delimiter,
    columns: true,
    bom: true,
    relax_column_count: true,
    info: true,
  });

  let importedSize = 0;
  let lineCount = 0;

  const { source: storagePath, account } = getMailingListStoragePath(mailingList._id);

  await pipeline(
    await getFromStorage(storagePath, account, signal),
    decipher(mailingList.encode_key),
    new Transform({
      transform(chunk, _encoding, callback) {
        importedSize += chunk.length;
        // Push the chunk to the next stream in the pipeline
        this.push(chunk);
        callback();
      },
    }),
    parser,
    new Transform({
      objectMode: true,
      async transform(chunk: { info: Info; record: unknown }, _encoding, callback) {
        try {
          lineCount++;

          if (lineCount <= skipCount) {
            return callback();
          }

          const item = ZMailingListSource.parse({
            _id: new ObjectId(),
            mailing_list_id: mailingList._id,
            line_number: lineCount,
            data: chunk.record as Record<string, unknown>,
            ttl: mailingList.ttl,
          });

          const op: AnyBulkWriteOperation<IMailingListSource> = {
            updateOne: {
              filter: {
                mailing_list_id: item.mailing_list_id,
                line_number: item.line_number,
              },
              update: { $set: item },
              upsert: true,
            },
          };

          callback(null, op);
        } catch (error) {
          callback(withCause(internal("mailing-list-parser: error while building op", { chunk }), error));
        }
      },
    }),
    createBatchTransformStream(1_000),
    new Transform({
      objectMode: true,
      async transform(batch: AnyBulkWriteOperation<IMailingListSource>[], _encoding, callback) {
        try {
          await getDbCollection("mailingList.source").bulkWrite(batch, {
            ordered: false,
          });

          await getDbCollection("mailingListsV2").updateOne(
            { _id: mailingList._id },
            {
              $set: {
                "progress.parse": Math.round((importedSize / mailingList.source.file.size) * 100),
                "source.lines": lineCount,
                updated_at: new Date(),
              },
            }
          );

          return callback();
        } catch (error) {
          callback(withCause(internal("mailing-list-parser: error while bulkWrite"), error));
        }
      },
    }),
    { signal }
  );

  const columns = z.array(z.object({ name: z.string() })).safeParse(parser.options.columns);
  if (!columns.success) {
    throw internal("mailing-list-parser: no columns found in the CSV file", { columns });
  }

  await getDbCollection("mailingListsV2").updateOne(
    {
      _id: mailingList._id,
    },
    {
      $set: {
        status: "parse:success",
        job_id: null,
        updated_at: new Date(),
        "progress.parse": 100,
        "source.lines": lineCount,
        "source.columns": Array.from(new Set(columns.data.map((col) => col.name)).values()),
      },
    }
  );
}

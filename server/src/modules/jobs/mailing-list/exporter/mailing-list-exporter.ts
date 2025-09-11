import { pipeline } from "stream/promises";
import { Readable, Transform } from "stream";
import type { IJobsSimple } from "job-processor";
import type { IMailingListV2 } from "shared/models/mailingListV2.model";
import type { Filter } from "mongodb";
import type { IMailingListComputedDatum } from "shared/models/mailingList.computed.model";
import { MAILING_LIST_COMPUTED_COLUMNS } from "shared/constants/mailingList";
import { stringify } from "csv-stringify";
import { differenceInSeconds } from "date-fns";
import { getDbCollection } from "../../../../common/utils/mongodbUtils";
import { sleep } from "../../../../common/utils/asyncUtils";
import { cipher } from "../../../../common/utils/cryptoUtils";
import { uploadToStorage } from "../../../../common/utils/ovhUtils";
import { getMailingListStoragePath } from "../storage/mailing-list-storage";

function addColumnData(
  line: Record<string, string>,
  data: IMailingListComputedDatum["data"][],
  columnName: string,
  simple: boolean,
  groupSize: number
) {
  if (simple) {
    line[columnName] = data[0]?.[columnName] ?? "";
  } else {
    for (let i = 0; i < groupSize; i++) {
      line[`${columnName}_${i + 1}`] = data[i]?.[columnName] ?? "";
    }
  }
}

async function* buildLine(mailingList: IMailingListV2, signal: AbortSignal) {
  const filter: Filter<IMailingListComputedDatum> = { mailing_list_id: mailingList._id, email_status: "valid" };

  const maxByGroup = await getDbCollection("mailingList.computed")
    .aggregate<{ _id: string; count: number }>(
      [
        { $match: filter },
        { $sort: { mailing_list_id: 1, email: 1 } },
        { $group: { _id: "$email", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ],
      { signal }
    )
    .toArray();

  const groupCount = await getDbCollection("mailingList.computed")
    .aggregate<{ count: number }>(
      [
        { $match: filter },
        { $sort: { mailing_list_id: 1, email: 1 } },
        { $group: { _id: "$email", count: { $sum: 1 } } },
        { $count: "count" },
      ],
      { signal }
    )
    .toArray();

  let groupCountProcessed = 0;
  const groupCountTotal = groupCount[0]?.count ?? 0;

  const groupSize = maxByGroup[0]?.count ?? 1;

  const cursor = getDbCollection("mailingList.computed").aggregate<{
    _id: string;
    data: IMailingListComputedDatum["data"][];
  }>(
    [
      { $match: filter },
      { $sort: { mailing_list_id: 1, email: 1 } },
      { $group: { _id: "$email", data: { $push: "$data" } } },
    ],
    { signal }
  );

  for await (const doc of cursor) {
    const line: Record<string, string> = {};
    line["email"] = doc._id;

    signal.throwIfAborted();

    for (const column of mailingList.config.output_columns) {
      if (column.input.type === "source") {
        addColumnData(line, doc.data, column.output, column.simple, groupSize);
      } else {
        for (const c of MAILING_LIST_COMPUTED_COLUMNS[column.input.name].columns) {
          addColumnData(line, doc.data, c.output, c.simple, groupSize);
        }
      }
    }

    yield line;

    groupCountProcessed++;
    if (groupCountProcessed % 1_000 === 0) {
      await getDbCollection("mailingListsV2").updateOne(
        { _id: mailingList._id },
        {
          $set: {
            // This doesn't represent the real progress so we limit it to 90%
            // There's still some work to do after the export
            "progress.export": Math.floor((groupCountProcessed / groupCountTotal) * 90),
            updated_at: new Date(),
          },
        }
      );
    }
  }

  const [empty, blacklisted, invalid] = await Promise.all([
    getDbCollection("mailingList.computed").countDocuments({
      mailing_list_id: mailingList._id,
      email_status: "empty",
    }),
    getDbCollection("mailingList.computed")
      .aggregate<{ count: number }>([
        { $match: { mailing_list_id: mailingList._id, email_status: "blacklisted" } },
        { $count: "count" },
      ])
      .toArray(),
    getDbCollection("mailingList.computed")
      .aggregate<{ count: number }>([
        { $match: { mailing_list_id: mailingList._id, email_status: "invalid" } },
        { $count: "count" },
      ])
      .toArray(),
  ]);

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        updated_at: new Date(),
        "output.lines": groupCountProcessed,
        "output.empty_source_lines": empty,
        "output.blacklisted_email_count": blacklisted[0]?.count ?? 0,
        "output.invalid_email_count": invalid[0]?.count ?? 0,
      },
    }
  );
}

export async function exportMailingList(
  mailingList: IMailingListV2,
  job: IJobsSimple,
  signal: AbortSignal
): Promise<void> {
  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: "export:in_progress",
        eta: null,
        error: null,
        "progress.export": 0,
        job_id: job._id,
        updated_at: new Date(),
      },
    }
  );

  const { account, result: path } = getMailingListStoragePath(mailingList._id);

  let exportedLines = 0;
  const totalLines = mailingList.output.lines;
  const startedAt = Date.now();

  await pipeline(
    Readable.from(buildLine(mailingList, signal), { objectMode: true }),
    new Transform({
      objectMode: true,
      async transform(line: Record<string, string>, _encoding, callback) {
        exportedLines++;

        if (exportedLines % 10_000 === 0) {
          const remainingCount = totalLines - exportedLines;
          const now = Date.now();
          const elapsed = now - startedAt;
          const eta = new Date(now + (elapsed / exportedLines) * remainingCount);

          await getDbCollection("mailingListsV2")
            .updateOne(
              { _id: mailingList._id },
              {
                $set: {
                  eta,
                  updated_at: new Date(),
                },
              }
            )
            .catch(() => {
              // Ignore errors
            });
        }

        callback(null, line);
      },
    }),
    stringify({
      header: true,
      delimiter: ",",
    }),
    cipher(mailingList.encode_key),
    await uploadToStorage(path, account, differenceInSeconds(mailingList.ttl, new Date()), "text/csv")
  );

  await sleep(5_000); // Wait for 5 second to ensure the file is fully processed

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: "export:success",
        error: null,
        job_id: null,
        "progress.export": 100,
        updated_at: new Date(),
      },
    }
  );
}

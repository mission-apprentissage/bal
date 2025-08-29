import { badRequest, conflict, notFound } from "@hapi/boom";
import type { IJobsSimple } from "job-processor";
import { isColumnReserved } from "shared/constants/mailingList";
import type { IMailingListV2, IMailingListV2ConfigUpdateQuery } from "shared/models/mailingListV2.model";
import type { IMailingListComputedDatum } from "shared/models/mailingList.computed.model";
import { assertUnreachable } from "shared/utils/assertUnreachable";
import type { IMailingListSource } from "shared/models/mailingList.source.model";
import { extensions } from "shared/helpers/zodHelpers/zodPrimitives";
import { getDbCollection } from "../../../../common/utils/mongodbUtils";
import { getTrainingLinks } from "../../../../common/apis/lba";
import type { TrainingLinkData } from "../../../../common/apis/lba";
import { verifyEmails } from "../../../../common/services/mailer/mailBouncer";

export async function validateMailingListConfiguration(mailingList: IMailingListV2) {
  if (mailingList.config.email_column === "") {
    throw badRequest("La colonne d'identification n'est pas configurée");
  }

  const seenInputNames = {
    source: new Set<string>(mailingList.config.email_column),
    computed: new Set<string>(),
  };

  for (const column of mailingList.config.output_columns) {
    if (column.input.type === "source") {
      if (seenInputNames.source.has(column.input.name)) {
        throw badRequest(`La colonne source "${column.input.name}" est dupliquée dans la configuration`);
      }

      if (column.input.name === "") {
        throw badRequest("Une colonne source n'est pas configurée");
      }

      seenInputNames.source.add(column.input.name);
    }

    if (column.input.type === "computed") {
      if (seenInputNames.computed.has(column.input.name)) {
        throw badRequest(`La colonne source "${column.input.name}" est dupliquée dans la configuration`);
      }

      seenInputNames.computed.add(column.input.name);
    }
  }

  if (
    mailingList.config.output_columns.some((i) => i.input.type === "computed" && i.input.name === "WEBHOOK_LBA") &&
    !mailingList.config.lba_columns
  ) {
    throw badRequest("La configuration des colonnes LBA est requise pour utiliser la colonne WEBHOOK_LBA");
  }

  for (const column of mailingList.config.output_columns) {
    if (column.input.type === "source") {
      if (isColumnReserved(column.output)) {
        throw badRequest(`Le nom de colonne source "${column.output}" est réservé et ne peut pas être utilisé`);
      }
    }
  }

  const seenOutputNames = new Set();
  for (const column of mailingList.config.output_columns) {
    if (column.input.type === "source") {
      if (isColumnReserved(column.output)) {
        throw badRequest(`Le nom de colonne source "${column.output}" est réservé et ne peut pas être utilisé`);
      }
    }

    if (seenOutputNames.has(column.output)) {
      throw badRequest(`Le champs de sortie "${column.output}" est dupliquée dans la configuration`);
    }

    seenOutputNames.add(column.output);
  }
}

export async function updateMailingListConfiguration(
  id: IMailingListV2["_id"],
  config: IMailingListV2ConfigUpdateQuery
): Promise<void> {
  const currentMailingList = await getDbCollection("mailingListsV2").findOne({
    _id: id,
  });

  if (!currentMailingList) {
    throw notFound("La liste de diffusion n'existe pas");
  }

  if (currentMailingList.status !== "parse:success") {
    throw conflict("La configuration de la liste ne peut pas être modifiée");
  }

  const newConfig: IMailingListV2["config"] = {
    email_column: config.email_column ?? currentMailingList.config.email_column,
    output_columns: config.output_columns ?? currentMailingList.config.output_columns,
    lba_columns: config.lba_columns ?? currentMailingList.config.lba_columns,
  };

  await getDbCollection("mailingListsV2").updateOne({ _id: id }, { $set: { config: newConfig } });
}

async function addLbaData({
  mailingList,
  sourceLines,
  computedLines,
  signal,
}: {
  mailingList: IMailingListV2;
  sourceLines: IMailingListSource[];
  computedLines: IMailingListComputedDatum[];
  signal: AbortSignal;
}) {
  const lbaColummns = mailingList.config.lba_columns;
  if (!lbaColummns) {
    throw badRequest("La configuration des colonnes LBA est requise pour utiliser la colonne WEBHOOK_LBA");
  }

  const queryData: TrainingLinkData[] = sourceLines.map(
    (line, i): TrainingLinkData => ({
      id: `${i}`,
      cle_ministere_educatif: line.data[lbaColummns.cle_ministere_educatif] ?? "",
      mef: line.data[lbaColummns.mef] ?? "",
      cfd: line.data[lbaColummns.cfd] ?? "",
      rncp: line.data[lbaColummns.rncp] ?? "",
      code_postal: line.data[lbaColummns.code_postal] ?? "",
      code_insee: line.data[lbaColummns.code_insee] ?? "",
      uai_lieu_formation: line.data[lbaColummns.uai_lieu_formation] ?? "",
      uai_formateur: line.data[lbaColummns.uai_formateur] ?? "",
      uai_formateur_responsable: line.data[lbaColummns.uai_formateur_responsable] ?? "",
    })
  );

  const trainingLinks = await getTrainingLinks(queryData, signal);

  for (const trainingLink of trainingLinks) {
    const index = parseInt(trainingLink.id, 10);

    const computedLine = computedLines[index];
    computedLine.data["lien_lba"] = trainingLink.lien_lba;
    computedLine.data["lien_prdv"] = trainingLink.lien_prdv;
  }
}

async function addBouncerData({
  computedLines,
  signal,
}: {
  computedLines: IMailingListComputedDatum[];
  signal: AbortSignal;
}) {
  const emailToIndexes = new Map<string, number[]>();
  computedLines.forEach((line, i) => {
    // Set default values to avoid undefined values
    computedLines[i].data["bounce_status"] = "unknown";
    computedLines[i].data["bounce_message"] = "Email not found in bouncer";
    computedLines[i].data["bounce_response_code"] = "";
    computedLines[i].data["bounce_response_message"] = "";

    const indexes = emailToIndexes.get(line.email) ?? [];
    indexes.push(i);
    emailToIndexes.set(line.email, indexes);
  });

  const pingResults = await verifyEmails(Array.from(emailToIndexes.keys()), signal);

  for (let i = 0; i < pingResults.length; i++) {
    const { email, ping } = pingResults[i];
    const indexes = emailToIndexes.get(email) ?? [];

    for (const index of indexes) {
      const computedLine = computedLines[index];
      computedLine.data["bounce_status"] = ping.status;
      computedLine.data["bounce_message"] = ping.message;
      computedLine.data["bounce_response_code"] = ping.responseCode ?? "";
      computedLine.data["bounce_response_message"] = ping.responseMessage ?? "";
    }
  }
}

// TODO: Stop the process if the signal is aborted
async function generateMailingListBatch(
  mailingList: IMailingListV2,
  signal: AbortSignal,
  bounds: { from: number; to: number }
) {
  const sourceLines = await getDbCollection("mailingList.source")
    .find(
      {
        mailing_list_id: mailingList._id,
        line_number: { $gte: bounds.from, $lte: bounds.to },
      },
      { signal }
    )
    .toArray();

  if (sourceLines.length === 0) {
    return;
  }

  // Initialize computed lines with email and empty data
  const computedLines = sourceLines.map((line): IMailingListComputedDatum => {
    const rawEmail = line.data[mailingList.config.email_column] ?? "";
    const parsedEmailResult = extensions.email.safeParse(rawEmail);
    const email = parsedEmailResult.success ? parsedEmailResult.data : rawEmail;

    return {
      _id: line._id,
      mailing_list_id: mailingList._id,
      line_number: line.line_number,
      email: email,
      data: {},
      ttl: line.ttl,
      email_status: !rawEmail ? "empty" : parsedEmailResult.success ? "valid" : "invalid",
    };
  });

  // Add simple columns
  for (let i = 0; i < sourceLines.length; i++) {
    const computedLine = computedLines[i];
    const sourceLine = sourceLines[i];

    for (const column of mailingList.config.output_columns) {
      if (column.input.type === "source") {
        computedLine.data[column.output] = sourceLine.data[column.input.name] ?? "";
      }
    }
  }

  // Clear Blacklist emails
  await Promise.all(
    computedLines.map(async (line) => {
      if (line.email === "") {
        return;
      }

      const isBlacklisted = await getDbCollection("lba.emailblacklists").findOne({ email: line.email }, { signal });

      if (isBlacklisted !== null) {
        line.email_status = "blacklisted";
      }
    })
  );

  // Add special columns (BOUNCER & LBA) but they are process in a whole batch
  await Promise.all(
    mailingList.config.output_columns.map(async (column) => {
      if (column.input.type === "computed") {
        const name = column.input.name;
        switch (name) {
          case "BOUNCER":
            await addBouncerData({ computedLines, signal });
            break;
          case "WEBHOOK_LBA":
            await addLbaData({ mailingList, sourceLines, computedLines, signal });
            break;
          default:
            assertUnreachable(name);
        }
      }
    })
  );

  await getDbCollection("mailingList.computed").bulkWrite(
    computedLines.map((line) => ({
      updateOne: {
        filter: { mailing_list_id: mailingList._id, line_number: line.line_number },
        update: { $set: line },
        upsert: true,
      },
    })),
    // Ordered to ensure line_number order
    { ordered: true }
  );
}

export async function forEachMailingListBatch(
  params: { start: number; total: number },
  callback: (bound: { from: number; to: number }) => Promise<void>,
  signal: AbortSignal
): Promise<void> {
  const batchSize = 10_000;

  for (let from = params.start; from <= params.total; from += batchSize) {
    const to = Math.min(from + batchSize - 1, params.total);

    if (signal.aborted) {
      throw signal.reason;
    }

    await callback({ from, to });
  }
}

export async function generateMailingList(
  mailingList: IMailingListV2,
  job: IJobsSimple,
  signal: AbortSignal
): Promise<void> {
  const [lastSource, lastImported] = await Promise.all([
    getDbCollection("mailingList.source").findOne({ mailing_list_id: mailingList._id }, { sort: { line_number: -1 } }),
    getDbCollection("mailingList.computed").findOne(
      { mailing_list_id: mailingList._id },
      { sort: { line_number: -1 } }
    ),
  ]);

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: "generate:in_progress",
        job_id: job._id,
        updated_at: new Date(),
      },
    }
  );

  const sourceLines = lastSource?.line_number ?? 0;
  const computedLines = lastImported?.line_number ?? 0;

  // Generating mailing list batch takes time to process
  // Hence we cannot user cursor as it will be limited by cursor timeout
  await forEachMailingListBatch(
    { start: computedLines + 1, total: sourceLines },
    async (bounds) => {
      await generateMailingListBatch(mailingList, signal, bounds);
      await getDbCollection("mailingListsV2").updateOne(
        { _id: mailingList._id },
        {
          $set: {
            "progress.generate": Math.floor((bounds.to / sourceLines) * 100),
            updated_at: new Date(),
          },
        }
      );
    },
    signal
  );

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: "generate:success",
        job_id: null,
        updated_at: new Date(),
        "progress.generate": 100,
      },
    }
  );
}

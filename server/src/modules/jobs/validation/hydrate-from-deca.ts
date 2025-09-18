import type { AnyBulkWriteOperation } from "mongodb";
import type { IPerson } from "shared/models/person.model";
import type { IOrganisation } from "shared/models/organisation.model";
import { bulkWritePersons, getImportPersonBulkOp } from "../../actions/persons.actions";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { bulkWriteOrganisations, getImportOrganisationBulkOp } from "../../actions/organisations.actions";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:validation:hydrate_from_deca" });

export async function importPersonFromDeca(signal: AbortSignal) {
  const totalCount = await getDbCollection("deca").countDocuments();

  const progress = {
    done: 0,
    total: totalCount,
    start: Date.now(),
  };

  const printProgress = () => {
    const now = Date.now();
    const elapsed = now - progress.start;
    const speed = elapsed === 0 ? 0 : progress.done / elapsed;
    const todo = progress.total - progress.done;
    const eta = speed === 0 ? "n/a" : new Date(now + todo / speed).toISOString();
    logger.info(`${String(progress.done).padStart(7)} / ${progress.total}: ETA ${eta}`);
  };

  printProgress();

  const cursor = getDbCollection("deca").find({}, { signal });

  let buffer: { personOps: AnyBulkWriteOperation<IPerson>[]; organisationOps: AnyBulkWriteOperation<IOrganisation>[] } =
    {
      personOps: [],
      organisationOps: [],
    };

  for await (const docDeca of cursor) {
    signal.throwIfAborted();

    const input = {
      email: docDeca.employeur.courriel,
      siret: docDeca.employeur.siret,
      source: "DECA",
    };

    const personOps = getImportPersonBulkOp(input);
    const organisationOps = getImportOrganisationBulkOp(input);

    if (personOps.length > 0) {
      buffer.personOps.push(...personOps);
    }
    if (organisationOps.length > 0) {
      buffer.organisationOps.push(...organisationOps);
    }

    if (personOps.length > 1000 || organisationOps.length > 1000) {
      await Promise.all([bulkWritePersons(buffer.personOps), bulkWriteOrganisations(buffer.organisationOps)]);

      buffer = { personOps: [], organisationOps: [] };

      printProgress();
    }

    await Promise.all([bulkWritePersons(buffer.personOps), bulkWriteOrganisations(buffer.organisationOps)]);

    progress.done++;
  }

  printProgress();
}

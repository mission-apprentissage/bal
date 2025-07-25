import { internal } from "@hapi/boom";
import { pMapIterable } from "p-map";
import type { IDeca } from "shared/models/deca.model/deca.model";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { updateOrganisationAndPerson } from "../../actions/organisations.actions";
import parentLogger from "@/common/logger";

const logger = parentLogger.child({ module: "job:validation:hydrate_from_deca" });

async function runDoc(docDeca: IDeca) {
  const courriel = docDeca.employeur.courriel || null;
  const siret = docDeca.employeur.siret || null;

  if (!courriel || !siret) return;

  const countA = (courriel.match(/@/g) || []).length;
  if (countA > 1) return; // bad data multiple email

  try {
    await updateOrganisationAndPerson(siret, courriel, "DECA", false);
  } catch (error) {
    internal(error);
  }
}

export async function run_hydrate_from_deca(offset = 0, signal: AbortSignal) {
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
    const todo = progress.total - progress.done - offset;
    const eta = speed === 0 ? "n/a" : new Date(now + todo / speed).toISOString();
    logger.info(`${String(progress.done + offset).padStart(7)} / ${progress.total}: ETA ${eta}`);
  };

  printProgress();

  const cursor = getDbCollection("deca").find({}).skip(offset);

  for await (const _r of pMapIterable(cursor, runDoc, { concurrency: 3000 })) {
    if (signal.aborted) {
      throw signal.reason;
    }

    if (progress.done % 1_000 === 0) {
      printProgress();
    }

    progress.done++;
  }

  printProgress();
}

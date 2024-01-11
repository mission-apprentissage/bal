import { pMapIterable } from "p-map";
import { IOrganisation } from "shared/models/organisation.model";

import parentLogger from "@/common/logger";

import { getDbCollection } from "../../../common/utils/mongodbUtils";

const logger = parentLogger.child({ module: "job:organisation:sanitize:domains" });

import dns from "node:dns";

import util from "util";

import { updateOrganisation } from "../../actions/organisations.actions";
const dnsLookup = util.promisify(dns.lookup);

async function runDoc(doc: IOrganisation) {
  if (!doc.email_domains || doc.email_domains?.length === 0) return;

  const sanitizedDomains = [];
  for (const domain of doc.email_domains) {
    try {
      await dnsLookup(domain);
      sanitizedDomains.push(domain);
    } catch (error) {
      //
    }
  }
  await updateOrganisation(doc, { email_domains: sanitizedDomains });
}

export const run_organisations_sanitize_domains = async () => {
  const [totalCount] = await Promise.all([getDbCollection("organisations").countDocuments()]);

  const progress = {
    total: totalCount,
    done: 0,
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

  const cursor = getDbCollection("organisations").find({});

  for await (const _r of pMapIterable(cursor, runDoc, { concurrency: 3000 })) {
    if (progress.done % 1_000 === 0) {
      printProgress();
    }

    progress.done++;
  }

  printProgress();
};

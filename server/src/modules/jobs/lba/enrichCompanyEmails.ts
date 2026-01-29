import { EmailStatus } from "shared/models/data/lba.mailingList.model";

import { addYears } from "date-fns";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import logger from "../../../common/logger";

export async function enrichCompanyEmails(): Promise<void> {
  logger.info("Starting enriching LBA mailing list with same naf company count and number of contracts...");

  const nafCache = new Map<string, number>();
  const now = new Date();
  const fromDate = addYears(new Date(), -1);

  let count = 0;

  for await (const doc of getDbCollection("lba.mailingLists").find(
    {
      emailStatus: EmailStatus.VALID,
    },
    { projection: { siret: 1, activitePrincipaleEtablissement: 1 } }
  )) {
    if (count % 500 === 0) {
      logger.info(`Enriched ${count} companies so far...`);
    }

    const naf = doc.activitePrincipaleEtablissement.replaceAll(".", "");

    const nbSocietesMemeNaf: number =
      nafCache.get(naf) ??
      (await getDbCollection("deca")
        .aggregate([
          { $match: { "employeur.naf": naf, created_at: { $gte: fromDate } } },
          { $group: { _id: "$employeur.siret" } },
          { $count: "total" },
        ])
        .toArray()
        .then((res) => res[0]?.total ?? 0));

    nafCache.set(naf, nbSocietesMemeNaf);

    const nbContrats: number = await getDbCollection("deca").countDocuments({
      "employeur.siret": doc.siret,
      created_at: { $gte: fromDate },
    });

    await getDbCollection("lba.mailingLists").updateOne(
      { siret: doc.siret },
      {
        $set: {
          nbContrats,
          nbSocietesMemeNaf,
          updated_at: now,
        },
      }
    );
    count++;
  }
  logger.info(`Done enriching ${count} companies in the LBA mailing list.`);
}

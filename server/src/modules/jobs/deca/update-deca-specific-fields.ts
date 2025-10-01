import { internal } from "@hapi/boom";
import * as Sentry from "@sentry/node";
import { addDays, format, isAfter, isBefore } from "date-fns";
import deepmerge from "deepmerge";
import { ObjectId } from "mongodb";
import type { IDeca } from "shared/models/deca.model/deca.model";
import type { IDecaImportJobResult } from "shared/models/deca.model/decaImportJobResult.model";

import z from "zod";
import { withCause } from "../../../common/services/errors/withCause";
import { asyncForEach } from "../../../common/utils/asyncUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { ifDefined, isDecaApiAvailable } from "./hydrate-deca";
import parentLogger from "@/common/logger";
import { getAllContrats } from "@/common/apis/deca";

/**
 * NB: to be run once and kept dormant until needed again
 */

const logger = parentLogger.child({ module: "job:hydrate:deca" });
const DATE_DEBUT_CONTRATS_DISPONIBLES = new Date("2022-06-07T00:00:00.000+02:00"); // Date de début de disponibilité des données dans l'API Deca
const NB_JOURS_MAX_PERIODE_FETCH = 650;

function getMaxOldestDateForFetching() {
  const date = new Date();
  date.setDate(date.getDate() - NB_JOURS_MAX_PERIODE_FETCH);
  date.setHours(0, 0, 0, 0);
  return date;
}

const parseDate = (v: string) => {
  return v ? new Date(`${v}T00:00:00.000Z`) : null;
};

export const ZDecaSpecific = z.object({
  no_contrat: z.string(),
  date_signature_contrat: z.optional(z.date()),
  alternant: z.object({
    nom: z.string(),
    handicap: z.boolean(),
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildDecaContract = (contrat: any) => {
  return {
    alternant: {
      ...ifDefined("nom", contrat.alternant.nom), // TDB, LBA
      handicap: contrat.alternant.handicap === "true" || contrat.alternant.handicap === true ? true : false, // TDB, LBA
    },
    no_contrat: contrat.detailsContrat.noContrat, // TDB, LBA
    ...ifDefined("date_signature_contrat", contrat.detailsContrat.dateConclusion, parseDate), // LBA
    ...ifDefined("type_contrat", contrat.detailsContrat.typeContrat), // TDB, LBA
  };
};

/**
 * Ce job peuple la collection contratsDeca via l'API Deca
 * L'API Deca ne permets de récupérer des données que sur une période maximum NB_JOURS_MAX_PERIODE_FETCH
 * L'API Deca ne permets de récupérer des données que jusqu'a "hier" au plus tard.
 * Le job va récupérer les données en découpant par chunks de 1 jour depuis la date la plus récente des contratsDecaDb en base jusqu'à "hier"
 * Le fonctionnement nominal est un appel quotidien de récupération des données de la veille
 */
export const updateDecaSpecificFields = async (signal: AbortSignal) => {
  const now = new Date();
  const yesterday = addDays(now, -1);
  yesterday.setHours(23);
  yesterday.setMinutes(59);
  yesterday.setSeconds(59);
  yesterday.setMilliseconds(0);

  // Récupération de la date début / fin
  const dateDebutToFetch: Date = await getLastDecaCreatedDateInDb();
  const dateFinToFetch: Date = yesterday;

  if (isAfter(dateDebutToFetch, dateFinToFetch)) {
    logger.error("La date de debut de peut pas être après la date de fin");
    return;
  } else if (dateDebutToFetch.toLocaleDateString() === dateFinToFetch.toLocaleDateString()) {
    logger.error("La date de debut doit toujours être inférieur la date de fin");
    return;
  } else if (isBefore(dateDebutToFetch, DATE_DEBUT_CONTRATS_DISPONIBLES)) {
    logger.error("Limite deca date de debut au 2022-06-07");
    return;
  }

  logger.info(
    `Récupération des contrats depuis l'API Deca du ${dateDebutToFetch.toLocaleDateString()} au ${dateFinToFetch.toLocaleDateString()} ...`
  );

  // Récupération des périodes (liste dateDebut/fin) à fetch dans l'API
  const periods = await buildPeriodsToFetch(dateDebutToFetch, dateFinToFetch);

  await asyncForEach(periods, async (period: { dateDebut: string; dateFin: string }) =>
    hydrateDecaPeriod(period, signal)
  );

  logger.info("Collection deca mise à jour avec succès !");
};

const hydrateDecaPeriod = async (
  { dateDebut, dateFin }: { dateDebut: string; dateFin: string },
  signal: AbortSignal
) => {
  return Sentry.startSpan(
    {
      name: "Hydrate DECA period specific",
      op: "queue:task",
      forceTransaction: true,
    },
    async () => {
      Sentry.getCurrentScope().setExtras({ dateDebut, dateFin });
      if (signal.aborted) {
        throw signal.reason;
      }

      if (!isDecaApiAvailable()) {
        logger.warn("L'API Deca n'est pas accessible actuellement");
        return;
      }

      try {
        logger.info(`> Fetch des données Deca du ${dateDebut} au ${dateFin}`);

        const [decaContrats_TDB, decaContrats_LBA] = await Promise.all([
          getAllContrats(dateDebut, dateFin, "TDB"),
          getAllContrats(dateDebut, dateFin, "LBA"),
        ]);

        logger.info(
          `Insertion des ${decaContrats_TDB.length} contrats dans la collection deca TDB du ${dateDebut} au ${dateFin} `
        );
        logger.info(
          `Insertion des ${decaContrats_LBA.length} contrats dans la collection deca LBA du ${dateDebut} au ${dateFin} `
        );

        const tdbMap = new Map(
          decaContrats_TDB.map((item) => [
            JSON.stringify({ noContrat: item.detailsContrat.noContrat, dateNaissance: item.alternant.dateNaissance }),
            item,
          ])
        );

        const decaContratsForPeriod = decaContrats_LBA.reduce((acc, item) => {
          let contrat = structuredClone(item);
          const tdbContrat = tdbMap.get(
            JSON.stringify({
              noContrat: item.detailsContrat.noContrat,
              dateNaissance: item.alternant.dateNaissance,
            })
          );

          if (tdbContrat) {
            contrat = deepmerge(item, tdbContrat);
            tdbMap.delete(
              JSON.stringify({ noContrat: item.detailsContrat.noContrat, dateNaissance: item.alternant.dateNaissance })
            );
          }

          const formattedContract = buildDecaContract(contrat);
          acc.push(formattedContract);

          return acc;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, [] as any[]);

        await asyncForEach(decaContratsForPeriod, async (currentContrat: IDeca) => {
          try {
            const contratFilter = {
              no_contrat: currentContrat.no_contrat,
              type_contrat: "" + currentContrat.type_contrat,
              "alternant.nom": currentContrat.alternant.nom,
            };

            /* decaHistory contient les modifs lorsque modif sur numéro de contrat + alternant.nom + type contrat identique */
            const preparedContrat = ZDecaSpecific.parse(currentContrat);

            await getDbCollection("deca").updateOne(contratFilter, {
              $set: {
                date_signature_contrat: preparedContrat.date_signature_contrat,
                "alternant.handicap": preparedContrat.alternant.handicap,
              },
            });
          } catch (err) {
            throw withCause(
              internal("Error while processing deca specific contract", {
                error: err,
                currentContrat,
                dateDebut,
                dateFin,
              }),
              err
            );
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        throw withCause(
          internal("Erreur lors de la récupération des données Deca spécifique", {
            error: err,
            dateDebut,
            dateFin,
          }),
          err
        );
      }

      await getDbCollection("deca.import.job.result.specific").insertOne({
        _id: new ObjectId(),
        has_completed: true,
        import_date_string: dateDebut,
        import_date: parseDate(dateDebut)!,
        created_at: new Date(),
      } as IDecaImportJobResult);
    }
  );
};

/**
 * Récupération de la liste des périodes (dateDébut - dateFin) par chunk de NB_DAYS_CHUNK
 * on devra l'appeler plusieurs fois si la durée que l'on souhaite est > NB_DAYS_CHUNK
 */
const buildPeriodsToFetch = async (
  dateDebut: Date,
  dateFin: Date
): Promise<Array<{ dateDebut: string; dateFin: string }>> => {
  const periods: Array<{ dateDebut: string; dateFin: string }> = [];

  let currentDate = dateDebut;

  while (isBefore(currentDate, dateFin)) {
    const dateFinPeriod = addDays(currentDate, 1);
    if (isAfter(dateFinPeriod, dateFin)) {
      if (format(currentDate, "yyyy-MM-dd") !== format(dateFin, "yyyy-MM-dd"))
        await pushPeriod(periods, dateDebut, dateFin);
    } else {
      await pushPeriod(periods, currentDate, dateFinPeriod);
    }
    currentDate = addDays(currentDate, 1);
  }

  return periods;
};

const pushPeriod = async (periods: Array<{ dateDebut: string; dateFin: string }>, dateDebut: Date, dateFin: Date) => {
  if (
    !(await getDbCollection("deca.import.job.result.specific").findOne({
      import_date_string: format(dateDebut, "yyyy-MM-dd"),
    }))
  ) {
    periods.push({ dateDebut: format(dateDebut, "yyyy-MM-dd"), dateFin: format(dateFin, "yyyy-MM-dd") });
  }
};

/**
 * Fonction de récupération de la dernière date de contrat Deca ajouté en base
 * @returns
 */
const getLastDecaCreatedDateInDb = async () => {
  const lastDecaLogEntry = await getDbCollection("deca.import.job.result.specific").findOne(
    {},
    { sort: { import_date: -1 } }
  );

  let lastCreatedAt = lastDecaLogEntry?.import_date ?? null;

  // Si la dernière date est plus tard qu'hier, on prend d'avant hier en date de debut de référence
  if (lastCreatedAt) {
    if (isAfter(lastCreatedAt, addDays(new Date(), -1))) {
      lastCreatedAt = addDays(new Date(), -2);
    }

    return lastCreatedAt;
  } else {
    return getMaxOldestDateForFetching();
  }
};

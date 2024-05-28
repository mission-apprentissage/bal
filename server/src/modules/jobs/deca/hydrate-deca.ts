import { PromisePool } from "@supercharge/promise-pool";
import { addDays, differenceInDays, format, isAfter, isBefore } from "date-fns";
import deepmerge from "deepmerge";

import { getAllContrats } from "@/common/apis/deca";
import parentLogger from "@/common/logger";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { createHistory } from "./watcher";

const logger = parentLogger.child({ module: "job:hydrate:deca" });
const DATE_DEBUT_CONTRATS_DISPONIBLES = new Date("2022-06-07T00:00:00.000Z"); // Date de début de disponibilité des données dans l'API Deca
const NB_JOURS_MAX_PERIODE_FETCH = 60;

const ifDefined = (key: string, value: any, transform = (v: any) => v) => {
  return value ? { [key]: transform(value) } : {};
};

/**
 * Ce job peuple la collection contratsDeca via l'API Deca
 * L'API Deca ne permets de récupérer des données que sur une période maximum NB_JOURS_MAX_PERIODE_FETCH
 * L'API Deca ne permets de récupérer des données que jusqu'a "hier" au plus tard.
 * Le job va récupérer les données en découpant par chunks de NB_JOURS_MAX_PERIODE_FETCH jours si besoin via 2 modes :
 *    - incrémental (si aucune option spécifiée) : depuis la date la plus récente des contratsDecaDb en base jusqu'à "hier"
 *    - from : depuis yyyy-MM-dd
 *    - to : jusqu'a yyyy-MM-dd
 */
export const hydrateDeca = async ({ from, to, chunk = 1 }: { from?: string; to?: string; chunk: number }) => {
  // Récupération de la date début / fin
  const dateDebutToFetch: Date = from
    ? new Date(`${from}T00:00:00.000Z`)
    : (await getLastDecaCreatedDateInDb()) ?? new Date(`2024-05-21T00:00:00.000Z`);
  const dateFinToFetch = to ? new Date(`${to}T00:00:00.000Z`) : addDays(new Date(), -1);

  if (isAfter(dateDebutToFetch, dateFinToFetch)) {
    logger.error("La date de debut de peut pas être après la date de fin");
    return;
  } else if (dateDebutToFetch.toLocaleDateString() === dateFinToFetch.toLocaleDateString()) {
    logger.error("La date de debut doit toujours être inférieur la date de fin");
    return;
  } else if (isBefore(dateDebutToFetch, DATE_DEBUT_CONTRATS_DISPONIBLES)) {
    logger.error("Limite deca date de debut au 2022-06-07");
    return;
  } else if (isAfter(dateFinToFetch, addDays(new Date(), -1))) {
    logger.error("Limite deca date de fin à Hier");
    return;
  } else if (chunk > NB_JOURS_MAX_PERIODE_FETCH) {
    logger.error("Limite deca de plage 60 jours");
    return;
  }

  logger.info(
    `Récupération des contrats depuis l'API Deca du ${dateDebutToFetch.toLocaleDateString()} au ${dateFinToFetch.toLocaleDateString()} ...`
  );

  // Récupération des périodes (liste dateDebut/fin) à fetch dans l'API
  const periods = buildPeriodsToFetch(dateDebutToFetch, dateFinToFetch, chunk);
  await PromisePool.for(periods).process(async ({ dateDebut, dateFin }: { dateDebut: string; dateFin: string }) => {
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
      ); // Type contrat type_contrat

      const decaContratsForPeriod = decaContrats_LBA.reduce((acc, item) => {
        let contrat = item as any;
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

        try {
          const result = {
            alternant: {
              date_naissance: contrat.alternant.dateNaissance, // TDB, LBA
              ...ifDefined("nom", contrat.alternant.nom), // TDB, LBA
              ...ifDefined("prenom", contrat.alternant.prenom), // TDB, LBA
              ...ifDefined("sexe", contrat.alternant.sexe), // TDB
              ...ifDefined("departement_naissance", contrat.alternant.departementNaissance), // TDB
              ...ifDefined("nationalite", contrat.alternant.nationalite, parseInt), // TDB
              handicap: contrat.alternant.handicap === "true" ? true : false, // TDB, LBA
              ...ifDefined("courriel", contrat.alternant.courriel), // TDB, LBA
              ...ifDefined("telephone", contrat.alternant.telephone), // TDB
              adresse: {
                ...ifDefined("numero", contrat.alternant.adresse?.numero, parseInt), // TDB
                ...ifDefined("voie", contrat.alternant.adresse?.voie), // TDB
                ...ifDefined("code_postal", contrat.alternant.adresse?.codePostal), // TDB
              },
              ...ifDefined("derniere_classe", contrat.alternant.derniereClasse), // TDB
            },
            formation: {
              ...ifDefined("date_debut_formation", contrat.formation.dateDebutFormation), // TDB
              ...ifDefined("date_fin_formation", contrat.formation.dateFinFormation), // TDB
              ...ifDefined("code_diplome", contrat.formation.codeDiplome), // TDB, LBA
              ...ifDefined("intitule_ou_qualification", contrat.formation.intituleOuQualification), // TDB, LBA
              ...ifDefined("rncp", contrat.formation.rncp), // TDB, LBA
              ...ifDefined("type_diplome", contrat.formation.typeDiplome), // LBA
            },
            etablissement_formation: {
              ...ifDefined("siret", contrat.etablissementFormation?.siret), // TDB
            },
            organisme_formation: {
              ...ifDefined("uai_cfa", contrat.organismeFormationResponsable.uaiCfa), // TDB, LBA
              ...ifDefined("siret", contrat.organismeFormationResponsable.siret), // TDB, LBA
            },
            employeur: {
              ...ifDefined("code_idcc", contrat.employeur.codeIdcc), // TDB, LBA
              ...ifDefined("siret", contrat.employeur.siret), // LBA
              adresse: {
                ...ifDefined("code_postal", contrat.employeur.adresse.codePostal), // LBA
              },
              ...ifDefined("naf", contrat.employeur.naf), // LBA
              ...ifDefined("nombre_de_salaries", contrat.employeur.nombreDeSalaries), // LBA
              ...ifDefined("courriel", contrat.employeur.courriel), // LBA
              ...ifDefined("telephone", contrat.employeur.telephone), // LBA
              ...ifDefined("denomination", contrat.employeur.denomination), // LBA
            },
            no_contrat: contrat.detailsContrat.noContrat, // TDB, LBA
            ...ifDefined("type_contrat", contrat.detailsContrat.typeContrat), // TDB, LBA
            ...ifDefined("date_effet_rupture", contrat.rupture?.dateEffetRupture), // TDB, LBA
            ...ifDefined("dispositif", contrat.detailsContrat.dispositif), // LBA
            ...ifDefined("date_debut_contrat", contrat.detailsContrat.dateDebutContrat), // TDB, LBA
            ...ifDefined("date_fin_contrat", contrat.detailsContrat.dateFinContrat), // TDB, LBA
            ...ifDefined("date_effet_avenant", contrat.detailsContrat.dateEffetAvenant), // TDB, LBA
            ...ifDefined("no_avenant", contrat.detailsContrat.noAvenant), // TDB, LBA
            ...ifDefined("statut", contrat.detailsContrat.statut), // TDB, LBA
            // flag_correction: contrat.detailsContrat.flagcorrection === "true" ? true : false,
            // ...(contrat.detailsContrat.datesuppression ? { date_suppression: contrat.detailsContrat.datesuppression } : {}),
            // ...(contrat.detailsContrat.rupture_avant_debut
            //   ? { rupture_avant_debut: contrat.detailsContrat.rupture_avant_debut === "true" ? true : false }
            //   : {}),
          };
          acc.push(result);
        } catch (error) {
          console.log(error);
        }

        return acc;
      }, [] as any[]);

      await PromisePool.for(decaContratsForPeriod)
        .handleError(async (err: any) => {
          throw new Error(`Erreur lors de la récupération des données Deca : ${JSON.stringify(err)}`);
        })
        .process(async (currentContrat: any) => {
          await getDbCollection("deca").updateOne(
            {
              no_contrat: currentContrat.no_contrat,
              "alternant.date_naissance": currentContrat.alternant.date_naissance,
            },
            {
              ...currentContrat,
              created_at: new Date(),
              updated_at: new Date(),
            },
            { upsert: true }
          );
        });

      await createHistory();
    } catch (err: any) {
      throw new Error(`Erreur lors de la récupération des données Deca : ${JSON.stringify(err)}`);
    }
  });

  logger.info("Collection deca mise à jour avec succès !");
};

/**
 * Récupération de la liste des périodes (dateDébut - dateFin) par chunk de NB_DAYS_CHUNK
 * on devra l'appeler plusieurs fois si la durée que l'on souhaite est > NB_DAYS_CHUNK
 */
export const buildPeriodsToFetch = (
  dateDebut: Date,
  dateFin: Date,
  chunkNbDays = 1
): Array<{ dateDebut: string; dateFin: string }> => {
  const periods: Array<{ dateDebut: string; dateFin: string }> = [];

  const nbDaysBetweenDebutFin = differenceInDays(dateFin, dateDebut);

  if (nbDaysBetweenDebutFin < chunkNbDays) {
    periods.push({ dateDebut: format(dateDebut, "yyyy-MM-dd"), dateFin: format(dateFin, "yyyy-MM-dd") });
  } else {
    let currentDate = dateDebut;

    while (isBefore(currentDate, dateFin)) {
      const dateFinPeriod = addDays(currentDate, chunkNbDays);
      if (isAfter(dateFinPeriod, dateFin)) {
        if (format(currentDate, "yyyy-MM-dd") !== format(dateFin, "yyyy-MM-dd"))
          periods.push({ dateDebut: format(currentDate, "yyyy-MM-dd"), dateFin: format(dateFin, "yyyy-MM-dd") });
      } else {
        periods.push({ dateDebut: format(currentDate, "yyyy-MM-dd"), dateFin: format(dateFinPeriod, "yyyy-MM-dd") });
      }
      currentDate = addDays(currentDate, chunkNbDays);
    }
  }

  return periods;
};

/**
 * Fonction de récupération de la dernière date de contrat Deca ajouté en base
 * @returns
 */
export const getLastDecaCreatedDateInDb = async (): Promise<Date | null> => {
  const lastDecaItem = await getDbCollection("deca").find().sort({ created_at: -1 }).limit(1).toArray();

  let lastCreatedAt = lastDecaItem[0]?.created_at ?? null;
  // Si la dernière date est plus tard qu'hier, on prend d'avant hier en date de debut de référence
  if (lastCreatedAt && isAfter(lastCreatedAt, addDays(new Date(), -1))) lastCreatedAt = addDays(new Date(), -2);
  return lastCreatedAt;
};

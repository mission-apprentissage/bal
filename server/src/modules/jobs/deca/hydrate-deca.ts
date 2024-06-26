import { addDays, differenceInDays, format, isAfter, isBefore } from "date-fns";
import deepmerge from "deepmerge";
import { IDeca } from "shared/models/deca.model/deca.model";

import { getAllContrats } from "@/common/apis/deca";
import parentLogger from "@/common/logger";

import { asyncForEach } from "../../../common/utils/asyncUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { saveHistory } from "./hydrate-deca-history";

const logger = parentLogger.child({ module: "job:hydrate:deca" });
const DATE_DEBUT_CONTRATS_DISPONIBLES = new Date("2022-06-07T00:00:00.000Z"); // Date de début de disponibilité des données dans l'API Deca
const NB_JOURS_MAX_PERIODE_FETCH = 60;

const ifDefined = (key: string, value: any, transform = (v: any) => v) => {
  return value ? { [key]: transform(value) } : {};
};

const parseDate = (v: string) => {
  return v ? new Date(v) : null;
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
  const now = new Date();
  const yesterday = addDays(now, -1);
  yesterday.setHours(23);
  yesterday.setMinutes(59);
  yesterday.setSeconds(59);
  yesterday.setMilliseconds(0);

  // Récupération de la date début / fin
  const dateDebutToFetch: Date = from
    ? new Date(`${from}T00:00:00.000Z`)
    : (await getLastDecaCreatedDateInDb()) ?? new Date(`2024-05-21T00:00:00.000Z`);
  const dateFinToFetch = to ? new Date(`${to}T00:00:00.000Z`) : yesterday;

  if (isAfter(dateDebutToFetch, dateFinToFetch)) {
    logger.error("La date de debut de peut pas être après la date de fin");
    return;
  } else if (dateDebutToFetch.toLocaleDateString() === dateFinToFetch.toLocaleDateString()) {
    logger.error("La date de debut doit toujours être inférieur la date de fin");
    return;
  } else if (isBefore(dateDebutToFetch, DATE_DEBUT_CONTRATS_DISPONIBLES)) {
    logger.error("Limite deca date de debut au 2022-06-07");
    return;
  } else if (isAfter(dateFinToFetch, yesterday)) {
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

  await asyncForEach(periods, async ({ dateDebut, dateFin }: { dateDebut: string; dateFin: string }) => {
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
              ...ifDefined("date_naissance", contrat.alternant.dateNaissance, parseDate), // TDB, LBA
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
              ...ifDefined("date_debut_formation", contrat.formation.dateDebutFormation, parseDate), // TDB
              ...ifDefined("date_fin_formation", contrat.formation.dateFinFormation, parseDate), // TDB
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
            ...ifDefined("type_contrat", "" + contrat.detailsContrat.typeContrat), // TDB, LBA
            ...ifDefined("date_effet_rupture", contrat.rupture?.dateEffetRupture, parseDate), // TDB, LBA
            ...ifDefined("dispositif", contrat.detailsContrat.dispositif), // LBA
            ...ifDefined("date_debut_contrat", contrat.detailsContrat.dateDebutContrat, parseDate), // TDB, LBA
            ...ifDefined("date_fin_contrat", contrat.detailsContrat.dateFinContrat, parseDate), // TDB, LBA
            ...ifDefined("date_effet_avenant", contrat.detailsContrat.dateEffetAvenant, parseDate), // TDB, LBA
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

      await asyncForEach(decaContratsForPeriod, async (currentContrat: IDeca) => {
        const oldContrat: IDeca | null = await getDbCollection("deca").findOne(
          {
            no_contrat: currentContrat.no_contrat,
          },
          {
            sort: { created_at: -1 },
          }
        );

        const now = new Date();

        /* decaHistory contient les modifs lorsque modif sur numéro de contrat + alternant.nom + type contrat identique */
        if (
          oldContrat &&
          (oldContrat.type_contrat !== currentContrat.type_contrat ||
            oldContrat.alternant.nom !== currentContrat.alternant.nom)
        ) {
          await getDbCollection("deca").insertOne({ ...currentContrat, created_at: now, updated_at: now });
        } else {
          const newContrat = await getDbCollection("deca").findOneAndUpdate(
            {
              no_contrat: currentContrat.no_contrat,
            },
            {
              $set: { ...currentContrat, created_at: oldContrat ? oldContrat.created_at : now, updated_at: now },
            },
            { sort: { created_at: -1 }, upsert: true, returnDocument: "after" }
          );

          if (oldContrat && newContrat.value) {
            await saveHistory(oldContrat, newContrat.value);
          }
        }
      });
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

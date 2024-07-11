import { internal } from "@hapi/boom";
import { addDays, format, isAfter, isBefore } from "date-fns";
import deepmerge from "deepmerge";
import { ObjectId } from "mongodb";
import { IDeca, ZDecaNew } from "shared/models/deca.model/deca.model";
import { IDecaImportJobResult } from "shared/models/deca.model/decaImportJobResult.model";

import { getAllContrats } from "@/common/apis/deca";
import parentLogger from "@/common/logger";

import { asyncForEach } from "../../../common/utils/asyncUtils";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import config from "../../../config";
import { saveHistory } from "./hydrate-deca-history";

const logger = parentLogger.child({ module: "job:hydrate:deca" });
const DATE_DEBUT_CONTRATS_DISPONIBLES = new Date("2022-06-07T00:00:00.000+02:00"); // Date de début de disponibilité des données dans l'API Deca
const NB_JOURS_MAX_PERIODE_FETCH = 60;

function getMaxOldestDateForFetching() {
  const date = new Date();
  date.setDate(date.getDate() - NB_JOURS_MAX_PERIODE_FETCH);
  date.setHours(0, 0, 0, 0);
  return date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ifDefined = (key: string, value: any, transform = (v: any) => v) => {
  return value ? { [key]: transform(value) } : {};
};

const parseDate = (v: string) => {
  return v ? new Date(`${v}T00:00:00.000+02:00`) : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildDecaContract = (contrat: any) => {
  return {
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
  };
};

export const isDecaApiAvailable = ({
  forceStartHour,
  forceProductionEnvironment,
}: {
  forceStartHour?: number;
  forceProductionEnvironment?: "forceProduction";
}) => {
  // l'api DECA est accessible exclusivement entre 19h00 et 7h00 du matin
  const SAFE_STOP_HOUR = config.env === "production" || forceProductionEnvironment ? 6 : 18;
  const SAFE_START_HOUR = config.env === "production" || forceProductionEnvironment ? 20 : 9;
  const startHour = forceStartHour ?? new Date().getHours();

  return startHour < SAFE_START_HOUR && startHour >= SAFE_STOP_HOUR ? true : false;
};

/**
 * Ce job peuple la collection contratsDeca via l'API Deca
 * L'API Deca ne permets de récupérer des données que sur une période maximum NB_JOURS_MAX_PERIODE_FETCH
 * L'API Deca ne permets de récupérer des données que jusqu'a "hier" au plus tard.
 * Le job va récupérer les données en découpant par chunks de 1 jour depuis la date la plus récente des contratsDecaDb en base jusqu'à "hier"
 * Le fonctionnement nominal est un appel quotidien de récupération des données de la veille
 */
export const hydrateDeca = async () => {
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

  await asyncForEach(periods, async ({ dateDebut, dateFin }: { dateDebut: string; dateFin: string }) => {
    if (isDecaApiAvailable({})) {
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
      ); // Type contrat type_contrat

      const decaContratsForPeriod = decaContrats_LBA.reduce((acc, item) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        const formattedContract = buildDecaContract(contrat);
        acc.push(formattedContract);

        return acc;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, [] as any[]);

      await asyncForEach(decaContratsForPeriod, async (currentContrat: IDeca) => {
        const newContratFilter = {
          no_contrat: currentContrat.no_contrat,
          type_contrat: currentContrat.type_contrat,
          "alternant.nom": currentContrat.alternant.nom,
        };

        const oldContrat: IDeca | null = await getDbCollection("deca").findOne(newContratFilter);
        const now = parseDate(dateDebut)!;

        if (oldContrat && oldContrat.updated_at && oldContrat.updated_at.getTime() > now.getTime()) {
          throw internal("contracts not imported in chronological order", { oldContrat, currentContrat, now });
        }

        /* decaHistory contient les modifs lorsque modif sur numéro de contrat + alternant.nom + type contrat identique */
        const preparedContrat = ZDecaNew.parse({ ...currentContrat, updated_at: now });

        await getDbCollection("deca").updateOne(
          newContratFilter,
          {
            $set: preparedContrat,
            $setOnInsert: { created_at: now },
          },
          { upsert: true }
        );

        if (oldContrat) {
          await saveHistory(oldContrat, preparedContrat, now);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(`Erreur lors de la récupération des données Deca : ${JSON.stringify(err)}`);
    }

    getDbCollection("deca.import.job.result").insertOne({
      _id: new ObjectId(),
      has_completed: true,
      import_date_string: dateDebut,
      import_date: parseDate(dateDebut)!,
      created_at: new Date(),
    } as IDecaImportJobResult);
  });

  logger.info("Collection deca mise à jour avec succès !");
};

/**
 * Récupération de la liste des périodes (dateDébut - dateFin) par chunk de NB_DAYS_CHUNK
 * on devra l'appeler plusieurs fois si la durée que l'on souhaite est > NB_DAYS_CHUNK
 */
export const buildPeriodsToFetch = async (
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
    !(await getDbCollection("deca.import.job.result").findOne({ import_date_string: format(dateDebut, "yyyy-MM-dd") }))
  ) {
    periods.push({ dateDebut: format(dateDebut, "yyyy-MM-dd"), dateFin: format(dateFin, "yyyy-MM-dd") });
  }
};

/**
 * Fonction de récupération de la dernière date de contrat Deca ajouté en base
 * @returns
 */
export const getLastDecaCreatedDateInDb = async () => {
  const lastDecaLogEntry = await getDbCollection("deca.import.job.result").findOne({}, { sort: { import_date: -1 } });

  console.log(" lastDecaLogEntry ", lastDecaLogEntry);

  let lastCreatedAt = lastDecaLogEntry?.import_date ?? null;
  if (!lastCreatedAt) {
    const lastDecaItem = await getDbCollection("deca").findOne(
      { created_at: { $exists: true } },
      { sort: { created_at: -1 } }
    );

    lastCreatedAt = lastDecaItem?.created_at ?? null;

    console.log(" lastCreatedAt ", lastDecaItem);
  }

  // Si la dernière date est plus tard qu'hier, on prend d'avant hier en date de debut de référence
  if (lastCreatedAt) {
    if (isAfter(lastCreatedAt, addDays(new Date(), -1))) {
      lastCreatedAt = addDays(new Date(), -2);
    }

    return lastCreatedAt;
  } else {
    console.log("retour max dans le past");

    return getMaxOldestDateForFetching();
  }
};

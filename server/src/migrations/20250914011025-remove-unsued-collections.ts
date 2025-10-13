import type { Db } from "mongodb";

export const up = async (db: Db) => {
  const collectionsToDrop = [
    "anonymized_applicants",
    "anonymized_applications",
    "anonymized_appointments",
    "anonymized_recruiters",
    "anonymized_users",
    "anonymized_userswithaccounts",
    "apicalls",
    "applicants",
    "applicants_email_logs",
    "applications",
    "appointments",
    "brevo.contacts",
    "brevo.listes",
    "cache_geolocation",
    "cache_romeo",
    "cache_siret",
    "catalogueEmailSirets",
    "cfas",
    "computed_jobs_partners",
    "credentials",
    "customemailetfas",
    "deca_stock",
    "deca-validity-rncp-cfd",
    "diplomesmetiers",
    "domainesmetiers",
    "eligible_trainings_for_appointments",
    "eligible_trainings_for_appointments_histories",
    "entreprises",
    "etablissements",
    "formationcatalogues",
    "francetravail_access",
    "geolocations",
    "jobs",
    "jobs_partners",
    "lba.recruteurs.siret.email",
    "metabase_affelnet_062023",
    "migrations",
    "opcos",
    "raw_francetravail",
    "raw_hellowork",
    "raw_kelio",
    "raw_meteojob",
    "raw_monster",
    "raw_pass",
    "raw_recruteurslba",
    "raw_rhalternance",
    "recruiters",
    "recruteurlbaupdateevents",
    "recruteurslbalegacies",
    "referentiel.communes",
    "referentieloniseps",
    "referentielopcos",
    "referentielromes",
    "reported_companies",
    "rolemanagement360",
    "rolemanagements",
    "sitemaps",
    "trafficsources",
    "unsubscribedofs",
    "unsubscribedrecruteurslba",
    "userswithaccounts",
  ];

  for (const collectionName of collectionsToDrop) {
    await db.dropCollection(collectionName).catch((e) => {
      if (e.codeName !== "NamespaceNotFound") {
        throw e;
      }
    });
  }
};

export const requireShutdown: boolean = true;

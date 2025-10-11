import type { AnyBulkWriteOperation } from "mongodb";
import type { IOrganisation } from "shared/models/organisation.model";
import type { IPerson } from "shared/models/person.model";
import { addDays } from "date-fns";
import { bulkWritePersons, getImportPersonBulkOp } from "../actions/persons.actions";
import { bulkWriteOrganisations, getImportOrganisationBulkOp } from "../actions/organisations.actions";
import logger from "@/common/logger";
import { fetchCatalogueData } from "@/common/apis/catalogue";

type Stats = {
  persons: {
    created: number;
    updated: number;
  };
  organisations: {
    created: number;
    updated: number;
  };
};

async function importCatalogueFormations(): Promise<Stats> {
  const objects = await fetchCatalogueData();
  logger.info(`got ${objects.length} objects from catalogue`);
  if (!objects.length) {
    throw new Error("aucune donnée. Abandon de l'import");
  }

  const stats: Stats = {
    persons: {
      created: 0,
      updated: 0,
    },
    organisations: {
      created: 0,
      updated: 0,
    },
  };
  const ttl = addDays(new Date(), 30);

  const personOps: AnyBulkWriteOperation<IPerson>[] = [];
  const organisationOps: AnyBulkWriteOperation<IOrganisation>[] = [];

  const writePersonOps = async () => {
    if (personOps.length === 0) {
      return;
    }
    const result = await bulkWritePersons(personOps);
    stats.persons.created += result.created ?? 0;
    stats.persons.updated += result.updated ?? 0;
    personOps.length = 0;
  };

  const writeOrganisationOps = async () => {
    if (organisationOps.length === 0) {
      return;
    }
    const result = await bulkWriteOrganisations(organisationOps);
    stats.organisations.created += result.created ?? 0;
    stats.organisations.updated += result.updated ?? 0;
    organisationOps.length = 0;
  };

  for (const obj of objects) {
    const {
      email,
      etablissement_formateur_courriel,
      etablissement_formateur_siret,
      etablissement_gestionnaire_courriel,
      etablissement_gestionnaire_siret,
    } = obj;

    const data = [
      {
        email,
        siret: etablissement_formateur_siret,
        source: "catalogue",
        ttl,
      },
      {
        email,
        siret: etablissement_gestionnaire_siret,
        source: "catalogue",
        ttl,
      },
      {
        email: etablissement_formateur_courriel,
        siret: etablissement_formateur_siret,
        source: "catalogue",
        ttl,
      },
      {
        email: etablissement_gestionnaire_courriel,
        siret: etablissement_gestionnaire_siret,
        source: "catalogue",
        ttl,
      },
    ];

    const pOps = data.flatMap(getImportPersonBulkOp);
    if (pOps.length > 0) {
      personOps.push(...pOps);
    }
    const oOps = data.flatMap(getImportOrganisationBulkOp);
    if (oOps.length > 0) {
      organisationOps.push(...oOps);
    }

    if (personOps.length > 1_000 || organisationOps.length > 1_000) {
      await Promise.all([writePersonOps(), writeOrganisationOps()]);
    }
  }

  await Promise.all([writePersonOps(), writeOrganisationOps()]);

  return stats;
}

export async function importPersonFromCatalogue() {
  try {
    logger.info("Getting Catalogue ...");
    const stats = await importCatalogueFormations();
    return stats;
  } catch (error) {
    logger.error("erreur lors de l'import du catalogue");
    throw error;
  }
}

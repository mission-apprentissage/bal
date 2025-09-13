import { importPerson } from "../actions/persons.actions";
import { fetchCatalogueData } from "@/common/apis/catalogue";
import logger from "@/common/logger";

async function importCatalogueFormations(): Promise<number> {
  const objects = await fetchCatalogueData();
  logger.info(`got ${objects.length} objects from catalogue`);
  if (!objects.length) {
    throw new Error("aucune donnée. Abandon de l'import");
  }

  let count = 0;
  for (const obj of objects) {
    const {
      email,
      etablissement_formateur_courriel,
      etablissement_formateur_siret,
      etablissement_gestionnaire_courriel,
      etablissement_gestionnaire_siret,
    } = obj;

    const [imported1, imported2, imported3, imported4] = await Promise.all([
      importPerson({
        email,
        siret: etablissement_formateur_siret,
        source: "catalogue",
      }),
      importPerson({
        email,
        siret: etablissement_gestionnaire_siret,
        source: "catalogue",
      }),
      importPerson({
        email: etablissement_formateur_courriel,
        siret: etablissement_formateur_siret,
        source: "catalogue",
      }),
      importPerson({
        email: etablissement_gestionnaire_courriel,
        siret: etablissement_gestionnaire_siret,
        source: "catalogue",
      }),
    ]);

    if (imported1) count++;
    if (imported2) count++;
    if (imported3) count++;
    if (imported4) count++;
  }

  return count;
}

export async function runCatalogueImporter() {
  try {
    logger.info("Getting Catalogue ...");
    const importedCount = await importCatalogueFormations();
    return importedCount;
  } catch (error) {
    logger.error("erreur lors de l'import du catalogue");
    throw error;
  }
}

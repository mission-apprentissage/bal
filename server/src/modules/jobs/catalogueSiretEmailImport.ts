import { ObjectId } from "mongodb";
import { ICatalogueEmailSiret } from "shared/models/catalogueEmailSiret.model";
import { z } from "zod";

import { fetchCatalogueData } from "@/common/apis/catalogue";
import logger from "@/common/logger";
import { getDbCollection } from "@/common/utils/mongodbUtils";

import { asyncGrouped } from "../../common/utils/asyncUtils";

const zodEmail = z.string().email();

async function importCatalogueFormations(importDate: Date): Promise<number> {
  const collectionName = "catalogueEmailSirets";

  const objects = await fetchCatalogueData();
  logger.info(`got ${objects.length} objects from catalogue`);
  if (!objects.length) {
    throw new Error("aucune donnée. Abandon de l'import");
  }

  const couplesSiretEmails = objects.flatMap((obj) => {
    const {
      email,
      etablissement_formateur_courriel,
      etablissement_formateur_siret,
      etablissement_gestionnaire_courriel,
      etablissement_gestionnaire_siret,
    } = obj;

    const emailOpts = [email, etablissement_formateur_courriel, etablissement_gestionnaire_courriel].flatMap(
      (email) => {
        if (!email) {
          return [];
        }
        const parsedEmails = parseEmail(email);
        if (!parsedEmails.length) {
          logger.warn(`email ${email} non valide`);
        }
        return parsedEmails;
      }
    );
    const siretOpts = [etablissement_formateur_siret, etablissement_gestionnaire_siret];
    const coupleSiretEmails: { siret: string; email: string }[] = emailOpts.flatMap((email) => {
      return siretOpts.flatMap((siret) => (siret ? [{ email, siret }] : []));
    });
    return coupleSiretEmails;
  });

  const deduplicatedCouples = deduplicateBy(couplesSiretEmails, ({ siret, email }) => `${siret}|${email}`);
  logger.info(`${deduplicatedCouples.length} deduplicated couples siret/email`);

  const entities = deduplicatedCouples.map(({ email, siret }) => {
    const entity: ICatalogueEmailSiret = {
      _id: new ObjectId(),
      email,
      siret,
      created_at: importDate,
      updated_at: importDate,
    };
    return entity;
  });
  logger.info(`inserting ${entities.length} documents into ${collectionName}...`);
  await asyncGrouped(entities, 1000, async (entityGroup, index) => {
    logger.info(`index ${index}`);
    await getDbCollection(collectionName).insertMany(entityGroup);
  });
  logger.info(`deleting old data`);
  await getDbCollection(collectionName).deleteMany({
    created_at: { $ne: importDate },
  });
  return await getDbCollection(collectionName).countDocuments({ created_at: importDate });
}

export async function runCatalogueImporter() {
  const importDate = new Date();

  try {
    logger.info("Geting Catalogue ...");
    const importedCount = await importCatalogueFormations(importDate);
    return importedCount;
  } catch (error) {
    logger.error("erreur lors de l'import du catalogue");
    throw error;
  }
}

const deduplicateBy = <T>(array: T[], keyFct: (item: T) => string): T[] => {
  const keys = new Set<string>();
  const deduplicated: T[] = [];
  array.forEach((item) => {
    const key = keyFct(item);
    if (!keys.has(key)) {
      deduplicated.push(item);
      keys.add(key);
    }
  });
  return deduplicated;
};

const parseEmail = (email: string): string[] => {
  if (!email) {
    return [];
  }
  if (email.includes("#")) {
    return email.split("#").flatMap(parseEmail);
  }
  if (zodEmail.safeParse(email).success) {
    return [email];
  }
  return [];
};

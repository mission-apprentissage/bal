import { ObjectId } from "mongodb";
import { ICatalogueEmailSiret } from "shared/models/catalogueEmailSiret.model";
import { z } from "zod";

import { fetchCatalogueData, ZCatalogueData } from "../../common/apis/catalogue";
import { getDbCollection } from "../../common/utils/mongodbUtils";

const zodEmail = z.string().email();

async function importCatalogueFormations(importDate: Date): Promise<number> {
  const collectionName = "catalogueEmailSirets";

  const objects: object[] = await fetchCatalogueData();
  console.info(`got ${objects.length} objects from catalogue`);

  const couplesSiretEmails = objects.flatMap((obj) => {
    const parseResult = ZCatalogueData.passthrough().safeParse(obj);
    if (!parseResult.success) {
      const {
        email,
        etablissement_formateur_courriel,
        etablissement_formateur_siret,
        etablissement_gestionnaire_courriel,
        etablissement_gestionnaire_siret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = obj as any;

      console.warn(
        `objet ${JSON.stringify({
          email,
          etablissement_formateur_courriel,
          etablissement_formateur_siret,
          etablissement_gestionnaire_courriel,
          etablissement_gestionnaire_siret,
        })} non valide`
      );
      return [];
    }

    const {
      email,
      etablissement_formateur_courriel,
      etablissement_formateur_siret,
      etablissement_gestionnaire_courriel,
      etablissement_gestionnaire_siret,
    } = parseResult.data;

    const emailOpts = [email, etablissement_formateur_courriel, etablissement_gestionnaire_courriel].flatMap(
      (email) => {
        if (!email) {
          return [];
        }
        const parsedEmails = parseEmail(email);
        if (!parsedEmails.length) {
          console.warn(`email ${email} non valide`);
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
  console.info(`${deduplicatedCouples.length} deduplicated couples siret/email`);

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
  console.info(`inserting ${entities.length} documents into ${collectionName}...`);
  await getDbCollection(collectionName).insertMany(entities);
  console.info(`deleting old data`);
  await getDbCollection(collectionName).deleteMany({
    created_at: { $ne: importDate },
  });
  return await getDbCollection(collectionName).countDocuments({ created_at: importDate });
}

export async function runCatalogueImporter() {
  const importDate = new Date();

  try {
    console.info("Geting Catalogue ...");
    const importedCount = await importCatalogueFormations(importDate);
    return importedCount;
  } catch (error) {
    console.error("erreur lors de l'import du catalogue");
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

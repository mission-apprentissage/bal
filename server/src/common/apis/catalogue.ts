import { zFormationCatalogue } from "shared/models/catalogue.api.model";
import type { z } from "zod";

import logger from "../logger";
import getApiClient from "./client";
import config from "@/config";

const catalogueClient = getApiClient(
  {
    baseURL: config.catalogue.baseUrl,
  },
  { cache: false }
);

export async function fetchCatalogueData(): Promise<CatalogueData[]> {
  const projectKeys: (keyof CatalogueData)[] = Object.keys(ZCatalogueData.shape) as (keyof CatalogueData)[];
  const projectObject = Object.fromEntries(projectKeys.map((key) => [key, 1]));
  const now = new Date();
  const tags: number[] = [now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + (now.getMonth() < 8 ? -1 : 2)];
  const query = JSON.stringify({ published: true, catalogue_published: true, tags: { $in: tags.map(String) } });

  const countResponse = await catalogueClient.get<number>("/api/v1/entity/formations/count", { params: { query } });
  const formationCount = countResponse.data;
  logger.info(`${formationCount} formation(s) à importer du catalogue`);

  if (!formationCount) {
    return [];
  }

  const response = await catalogueClient.get("/api/v1/entity/formations.json", {
    responseType: "json",
    params: {
      query,
      limit: formationCount,
      select: JSON.stringify(projectObject),
    },
  });
  const data = (response.data as object[]).flatMap((obj) => {
    const parseResult = ZCatalogueData.strip().safeParse(obj);
    if (!parseResult.success) {
      logger.warn(`objet ${JSON.stringify(obj)} non valide`);
      return [];
    }
    return [parseResult.data];
  });
  return data;
}

const ZCatalogueData = zFormationCatalogue.pick({
  email: true,
  etablissement_formateur_courriel: true,
  etablissement_gestionnaire_courriel: true,
  etablissement_formateur_siret: true,
  etablissement_gestionnaire_siret: true,
});

export type CatalogueData = z.output<typeof ZCatalogueData>;

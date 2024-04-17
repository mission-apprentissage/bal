import { zFormationCatalogue } from "shared/models/catalogue.api.model";
import { z } from "zod";

import config from "@/config";

import getApiClient from "./client";

const catalogueClient = getApiClient(
  {
    baseURL: config.catalogue.baseUrl,
  },
  { cache: false }
);

export async function fetchCatalogueData(): Promise<CatalogueData[]> {
  const projectKeys: (keyof CatalogueData)[] = Object.keys(ZCatalogueData.shape) as (keyof CatalogueData)[];
  const projectObject = Object.fromEntries(projectKeys.map((key) => [key, 1]));
  const query = JSON.stringify({ catalogue_published: true });

  const countResponse = await catalogueClient.get<number>("/api/v1/entity/formations/count", { params: { query } });
  const formationCount = countResponse.data;
  console.info(`${formationCount} formation(s) à importer du catalogue`);

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
      console.warn(`objet ${JSON.stringify(obj)} non valide`);
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

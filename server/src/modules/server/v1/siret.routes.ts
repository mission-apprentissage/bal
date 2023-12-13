import { zSiretRoutes } from "shared/routes/v1/siret.route";

import { getOrganisme } from "../../../common/apis/referentiel";
import { Server } from "../server";
import { getDataFromSiret } from "../utils/siret.utils";

interface Uai {
  sources: string[];
  uai: string;
}

const lookupUaiCatalogue = (uai_potentiels: Uai[]) => {
  return uai_potentiels.find((uaiPotentiel) => uaiPotentiel.sources.includes("catalogue-etablissements"))?.uai ?? null;
};

export const siretRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/siret",
    {
      schema: zSiretRoutes.post["/v1/siret"],
    },
    async (request, response) => {
      const { siret, organismeFormation } = request.body;
      const data = await getDataFromSiret(siret);

      const referentielData: Record<string, string> = {};

      if (organismeFormation) {
        const refResult = await getOrganisme(siret);

        if (refResult) {
          if (!data.result.enseigne && refResult.enseigne) {
            data.result.enseigne = refResult.enseigne;
          }
          if (!data.result.entreprise_raison_sociale && refResult.raison_sociale) {
            data.result.entreprise_raison_sociale = refResult.raison_sociale;
          }
          if (!data.result.entreprise_forme_juridique_code && refResult.forme_juridique) {
            data.result.entreprise_forme_juridique_code = refResult.forme_juridique.code;
          }
          if (!data.result.entreprise_forme_juridique && refResult.forme_juridique) {
            data.result.entreprise_forme_juridique = refResult.forme_juridique.label;
          }
          if (refResult.label) {
            // @ts-expect-error: TODO
            data.result.label = refResult.label;
          }
          if (refResult.uai) {
            referentielData.uai = refResult.uai;
          } else if (refResult.uai_potentiels.length > 0) {
            // @ts-expect-error: TODO
            referentielData.uai = lookupUaiCatalogue(refResult.uai_potentiels);
          }
        }
      }

      let dataResult = data.result;
      if (Object.keys(dataResult).length > 0) {
        dataResult = { ...data.result, ...referentielData };
      }

      return response.status(200).send({ ...data, result: dataResult });
    }
  );
};

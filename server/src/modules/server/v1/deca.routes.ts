import Boom from "@hapi/boom";
import { zRoutes } from "shared";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import type { Server } from "../server";

export const decaRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/v1/deca/search/organisme",
    {
      schema: zRoutes.post["/v1/deca/search/organisme"],
      onRequest: [server.auth(zRoutes.post["/v1/deca/search/organisme"])],
    },
    async (request, response) => {
      const { siret } = request.body;

      try {
        const dbContrats = await getDbCollection("deca")
          .find(
            { $or: [{ "organisme_formation.siret": siret }, { "etablissement_formation.siret": siret }] },
            { sort: { date_debut_contrat: 1 } }
          )
          .toArray();

        if (!dbContrats.length) {
          return response.status(200).send({
            contrats: {
              total: 0,
              appr: 0,
              prof: 0,
            },
            premier_contrat: null,
            dernier_contrat: null,
          });
        }

        const contratsAppr = dbContrats.filter((c) => c.dispositif === "APPR");

        return response.status(200).send({
          contrats: {
            total: dbContrats.length,
            appr: contratsAppr.length,
            prof: dbContrats.length - contratsAppr.length,
          },
          premier_contrat: {
            date_debut_contrat: dbContrats.at(0)?.date_debut_contrat,
            date_fin_contrat: dbContrats.at(0)?.date_fin_contrat,
          },
          dernier_contrat: {
            date_debut_contrat: dbContrats.at(-1)?.date_debut_contrat,
            date_fin_contrat: dbContrats.at(-1)?.date_fin_contrat,
          },
        });
      } catch (error) {
        throw Boom.badImplementation(error as Error);
      }
    }
  );
};

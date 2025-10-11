import { notFound } from "@hapi/boom";
import { zUserPrivateRoutes } from "shared/routes/_private/user.routes";
import type { Server } from "../server";
import { getDbCollection } from "../../../common/utils/mongodbUtils";

export const userPrivateRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/_private/users/:id",
    {
      schema: zUserPrivateRoutes.get["/_private/users/:id"],
      onRequest: [server.auth(zUserPrivateRoutes.get["/_private/users/:id"])],
    },
    async (request, response) => {
      const user = await getDbCollection("users").findOne({ _id: request.params.id });

      if (!user) {
        throw notFound();
      }

      // Fixme: maybe we return too much data!!
      return response.status(200).send(user);
    }
  );
};

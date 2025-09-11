import Boom from "@hapi/boom";
import { zUserPrivateRoutes } from "shared/routes/_private/user.routes";
import { findUser } from "../../actions/users.actions";
import type { Server } from "../server";

export const userPrivateRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/_private/users/:id",
    {
      schema: zUserPrivateRoutes.get["/_private/users/:id"],
      onRequest: [server.auth(zUserPrivateRoutes.get["/_private/users/:id"])],
    },
    async (request, response) => {
      const user = await findUser({ _id: request.params.id });

      if (!user) {
        throw Boom.notFound();
      }

      // Fixme: maybe we return too much data!!
      return response.status(200).send(user);
    }
  );
};

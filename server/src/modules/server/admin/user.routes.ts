import Boom from "@hapi/boom";
import { RootFilterOperators } from "mongodb";
import { IUser, toPublicUser } from "shared/models/user.model";
import { zUserAdminRoutes } from "shared/routes/user.routes";

import { createUser, findUser, findUsers } from "../../actions/users.actions";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const userAdminRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/admin/user",
    {
      schema: zUserAdminRoutes.post["/admin/user"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const user = await createUser(request.body);

      if (!user) {
        throw Boom.badImplementation("Impossible de créer l'utilisateur");
      }

      return response.status(200).send(toPublicUser(user));
    }
  );

  server.get(
    "/admin/users",
    {
      schema: zUserAdminRoutes.get["/admin/users"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const filter: RootFilterOperators<IUser> = {};

      const { q } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const users = await findUsers(filter);

      return response.status(200).send(users.map(toPublicUser));
    }
  );

  server.get(
    "/admin/users/:id",
    {
      schema: zUserAdminRoutes.get["/admin/users/:id"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const user = await findUser({ _id: request.params.id });

      if (!user) {
        throw Boom.notFound();
      }

      // Fixme: maybe we return too much data!!
      return response.status(200).send(toPublicUser(user));
    }
  );
};

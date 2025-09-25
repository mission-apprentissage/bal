import Boom, { notFound } from "@hapi/boom";
import type { RootFilterOperators } from "mongodb";
import type { IUser } from "shared/models/user.model";
import { zUserAdminRoutes } from "shared/routes/user.routes";

import { createUser } from "../../actions/users.actions";
import type { Server } from "../server";
import { getDbCollection } from "../../../common/utils/mongodbUtils";

export const userAdminRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/admin/user",
    {
      schema: zUserAdminRoutes.post["/admin/user"],
      onRequest: [server.auth(zUserAdminRoutes.post["/admin/user"])],
    },
    async (request, response) => {
      const user = await createUser(request.body);

      if (!user) {
        throw Boom.badImplementation("Impossible de créer l'utilisateur");
      }

      return response.status(200).send(user);
    }
  );

  server.get(
    "/admin/users",
    {
      schema: zUserAdminRoutes.get["/admin/users"],
      onRequest: [server.auth(zUserAdminRoutes.get["/admin/users"])],
    },
    async (request, response) => {
      const filter: RootFilterOperators<IUser> = {};

      const { q } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const users = await getDbCollection("users").find(filter).toArray();

      return response.status(200).send(users);
    }
  );

  server.get(
    "/admin/users/:id",
    {
      schema: zUserAdminRoutes.get["/admin/users/:id"],
      onRequest: [server.auth(zUserAdminRoutes.get["/admin/users/:id"])],
    },
    async (request, response) => {
      const user = await getDbCollection("users").findOne({ _id: request.params.id });

      if (!user) {
        throw notFound();
      }

      return response.status(200).send(user);
    }
  );

  server.delete(
    "/admin/users/:id",
    {
      schema: zUserAdminRoutes.delete["/admin/users/:id"],
      onRequest: [server.auth(zUserAdminRoutes.delete["/admin/users/:id"])],
    },
    async (request, response) => {
      const result = await getDbCollection("users").deleteOne({ _id: request.params.id });

      if (result.deletedCount === 0) {
        throw notFound();
      }

      return response.status(200).send({ success: true });
    }
  );
};

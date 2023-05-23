import { Filter, ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";
import { SReqParamsSearchPagination } from "shared/routes/common.routes";
import {
  IResGetUser,
  IResGetUsers,
  IResPostUser,
  SReqPostUser,
  SResGetUser,
  SResGetUsers,
  SResPostUser,
} from "shared/routes/user.routes";

import { createUser, findUser, findUsers } from "../../actions/users.actions";
import { Server } from "..";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const userAdminRoutes = ({ server }: { server: Server }) => {
  /**
   * Créer un utilisateur
   */
  server.post(
    "/admin/user",
    {
      schema: {
        body: SReqPostUser,
        response: { 200: SResPostUser },
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const user = await createUser(request.body);

        if (!user) {
          throw new Error("User not created");
        }

        return response.status(200).send(user as IResPostUser);
      } catch (error) {
        response.log.error(error);
      }
    }
  );

  server.get(
    "/admin/users",
    {
      schema: {
        response: { 200: SResGetUsers },
        querystring: SReqParamsSearchPagination,
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const filter: Filter<IUser> = {};

        const { q } = request.query;

        if (q) {
          filter.$text = { $search: q };
        }

        const users = await findUsers(filter);

        return response.status(200).send(users as IResGetUsers);
      } catch (error) {
        response.log.error(error);
      }
    }
  );

  server.get(
    "/admin/users/:id",
    {
      schema: {
        response: { 200: SResGetUser },
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const user = await findUser({ _id: new ObjectId(request.params.id) });

        return response.status(200).send(user as IResGetUser);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};

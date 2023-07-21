import Boom from "@hapi/boom";
import { ObjectId, RootFilterOperators } from "mongodb";
import { IUserDocument } from "shared/models/user.model";
import {
  IReqParamsSearchPagination,
  SReqParamsSearchPagination,
} from "shared/routes/common.routes";
import {
  IReqPostUser,
  SReqPostUser,
  SResGetUser,
  SResGetUsers,
  SResPostUser,
} from "shared/routes/user.routes";

import { createUser, findUser, findUsers } from "../../actions/users.actions";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const userAdminRoutes = ({ server }: { server: Server }) => {
  /**
   * Créer un utilisateur
   */
  server.post<{
    Body: IReqPostUser;
  }>(
    "/admin/user",
    {
      schema: {
        body: SReqPostUser,
        response: { 200: SResPostUser },
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      const user = await createUser(request.body);

      if (!user) {
        throw Boom.badImplementation("Impossible de créer l'utilisateur");
      }

      return response.status(200).send(user as any); //IResPostUser
    }
  );

  server.get<{
    Querystring: IReqParamsSearchPagination;
  }>(
    "/admin/users",
    {
      schema: {
        response: { 200: SResGetUsers },
        querystring: SReqParamsSearchPagination,
      } as const,
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const filter: RootFilterOperators<IUserDocument> = {};

      const { q } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const users = await findUsers(filter);

      // Fixme: maybe we return too much data!!
      return response.status(200).send(users); //IResGetUsers
    }
  );

  server.get<{
    Params: { id: string };
  }>(
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
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const user = await findUser({ _id: new ObjectId(request.params.id) });

      // Fixme: maybe we return too much data!!
      return response.status(200).send(user); //IResGetUser
    }
  );
};

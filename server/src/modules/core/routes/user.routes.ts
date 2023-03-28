import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";
import {
  SReqPostUser,
  SResGetUser,
  SResPostUser,
} from "shared/routes/user.routes";

import { getDbCollection } from "../../../db/mongodb";
import { Server } from "../../../server";
import { createUser } from "../../../services/userService";

export const userRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/user",
    {
      schema: {
        response: { 200: SResGetUser },
      } as const,
      preHandler: server.auth([server.validateJWT]),
    },
    async (request, response) => {
      const decoded = request.server.jwt.decode<{ userId: string }>(
        request.raw.headers.auth as string
      );

      const user = await getDbCollection("users").findOne<IUser>({
        _id: new ObjectId(decoded?.userId),
      });

      return response.status(200).send(user);
    }
  );
  /**
   * Créer un utilisateur
   */
  server.post(
    "/user",
    {
      schema: {
        body: SReqPostUser,
        response: { 200: SResPostUser },
      } as const,
    },
    async (request, response) => {
      try {
        const user = await createUser(request.body);

        if (!user) {
          throw new Error("User not created");
        }

        return response.status(200).send(user);
      } catch (error) {
        console.error(error);
      }
    }
  );
};

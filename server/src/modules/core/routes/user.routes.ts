import { IUser } from "shared/models/user.model";
import { SReqPostUser, SResPostUser } from "shared/routes/user.routes";

import { getDbCollection } from "../../../db/mongodb";
import { Server } from "../../../server";

export const userRoutes = ({ server }: { server: Server }) => {
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
        const { insertedId: userId } = await getDbCollection("users").insertOne(
          request.body
        );

        const user = await getDbCollection("users").findOne<IUser>({
          _id: userId,
        });

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

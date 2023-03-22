import { User, userSchema } from "shared/models/users.model";
import { createUserSchema } from "shared/routes/users";

import { getDbCollection } from "../../../db/mongodb";
import { Server } from "../../../server";

export const userRoutes = ({ server }: { server: Server }) => {
  /**
   * Créer un utilisateur
   */
  server.post(
    "/users",
    {
      schema: {
        body: createUserSchema,
        response: { 200: userSchema },
      } as const,
    },
    async (request, response) => {
      try {
        const { insertedId: userId } = await getDbCollection("users").insertOne(
          request.body
        );

        const user = await getDbCollection("users").findOne<User>({
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

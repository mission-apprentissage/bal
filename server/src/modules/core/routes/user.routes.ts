import { getDbCollection } from "../../../db/mongodb";
import usersModel, { User } from "../../../models/users.model";
import { Server } from "../../../server";

export const userRoutes = ({ server }: { server: Server }) => {
  /**
   * Créer un utilisateur
   */
  server.post(
    "/users",
    {
      schema: {
        body: usersModel.schema,
        response: { 200: usersModel.schema },
      } as const,
    },
    async (request, response) => {
      try {
        const { insertedId: userId } = await getDbCollection("users").insertOne(
          {
            name: request.body.name,
          }
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

import {
  SReqHeadersOrganisation,
  SReqPostOrganisationValidation,
  SResPostOrganisationValidation,
} from "shared/routes/v1/organisation.routes";
import { extensions } from "shared/validations/zodPrimitives";
import { z } from "zod";

import { validation } from "../../actions/organisations.actions";
import { Server } from "../server";
async function validateFullZodObjectSchema<Shape extends z.ZodRawShape>(
  object: any,
  schemaShape: Shape
): Promise<z.infer<z.ZodObject<Shape>>> {
  // const test = z
  // .strictObject({ siret: extensions.siret() })
  // .safeParse({ siret });
  return await z.strictObject(schemaShape).parseAsync(object);
}

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/organisation/validation",
    {
      schema: {
        body: SReqPostOrganisationValidation,
        response: { 200: SResPostOrganisationValidation },
        headers: SReqHeadersOrganisation,
      } as const,
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
        const { email, siret } = request.body;
        await validateFullZodObjectSchema(
          { siret },
          { siret: extensions.siret() }
        );

        const res = await validation({ email: email.toLowerCase(), siret });
        return response.status(200).send(res);
      } catch (error) {
        response.log.error(error);
        throw new Error(error.message);
      }
    }
  );
};

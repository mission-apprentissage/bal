import { ObjectId } from "mongodb";

import { config } from "../../../../config/config";
import {
  createOrganisation,
  findOrganisationBySiret,
} from "../../actions/organisations.actions";
import { createUser, findUser } from "../../actions/users.actions";

export const seed = async () => {
  let dinumOrganisationId = (await findOrganisationBySiret("13002526500013"))
    ?._id as ObjectId | undefined;

  if (!dinumOrganisationId) {
    dinumOrganisationId = await createOrganisation({
      nom: "Beta gouv",
      email_domains: [
        "beta.gouv.fr",
        "recette.bal.apprentissage.beta.gouv.fr",
        "preview.bal.apprentissage.beta.gouv.fr",
        "test.fr",
      ],
      etablissements: [
        {
          nom: "Dinum",
          siret: "13002526500013", // Siret Dinum
          is_hq: true,
          is_close: false,
        },
      ],
    });
  }

  if (config.env !== "production") {
    const testUser = await findUser({ email: config.tests.testUserName });
    if (!testUser) {
      await createUser({
        email: config.tests.testUserName,
        password: config.tests.testUserPwd,
        organisation_id: dinumOrganisationId.toString(),
      });
    }

    const testAdmin = await findUser({ email: config.tests.testAdminName });
    if (!testAdmin) {
      await createUser({
        email: config.tests.testAdminName,
        password: config.tests.testAdminPwd,
        organisation_id: dinumOrganisationId.toString(),
        is_admin: true,
      });
    }
  }
};

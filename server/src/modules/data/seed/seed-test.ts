import { config } from "../../../../config/config";
import { createOrganisation } from "../../actions/organisations.actions";
import { createUser } from "../../actions/users.actions";

export const seedTest = async () => {
  const organisationId = await createOrganisation({
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
  await createUser({
    email: config.tests.testUserName,
    password: config.tests.testUserPwd,
    organisation_id: organisationId.toString(),
  });
  await createUser({
    email: config.tests.testAdminName,
    password: config.tests.testAdminPwd,
    organisation_id: organisationId.toString(),
    is_admin: true,
  });
};

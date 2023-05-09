import { ObjectId } from "mongodb";

import { config } from "../../../../config/config";
import { getDbCollection } from "../../../utils/mongodb";
import {
  createOrganisation,
  findOrganisationBySiret,
} from "../../actions/organisations.actions";

// Dirty shame fast

export const migration1 = async () => {
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

  if (config.env === "production") {
    const users = (await getDbCollection("users").find()) as any;
    for (const user of users) {
      const { insertedId: personId } = await getDbCollection(
        "persons"
      ).insertOne({
        email: user.email,
        organisation_id: dinumOrganisationId.toString(),
        _meta: {
          source: "bal",
        },
      });

      await getDbCollection("users").updateMany(
        {},
        {
          $set: {
            person_id: personId,
          },
        }
      );
    }
  }
};

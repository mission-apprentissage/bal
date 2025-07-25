import companyEmailValidator from "company-email-validator";
import type { IPostRoutes, IResponse } from "shared";
import { getSirenFromSiret } from "shared/helpers/common";

import { getDbCollection } from "../../common/utils/mongodbUtils";

export const getCatalogueEmailVerification = async (
  siret: string,
  email: string
): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const siren = getSirenFromSiret(siret);
  if (
    // TODO: Importer la liste des emails catalogue dans la base de données
    await getDbCollection("catalogueEmailSirets").findOne({
      email,
      siret: { $regex: `^${siren}` },
    })
  ) {
    return {
      is_valid: true,
      on: "email",
      // TODO: identify as CFA
    };
  }
  const isBlacklisted = !companyEmailValidator.isCompanyEmail(email);
  if (isBlacklisted) {
    return { is_valid: false };
  }
  const [_, domain] = email.split("@");

  if (
    await getDbCollection("catalogueEmailSirets").findOne({
      email: { $regex: `@${domain}$` },
      siret: { $regex: `^${siren}` },
    })
  ) {
    return {
      is_valid: true,
      on: "domain",
    };
  }
  return { is_valid: false };
};

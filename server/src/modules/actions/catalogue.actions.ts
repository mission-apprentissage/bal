import companyEmailValidator from "company-email-validator";
import { IPostRoutes, IResponse } from "shared";
import { getSirenFromSiret } from "shared/helpers/common";

import { getDbCollection } from "../../common/utils/mongodbUtils";

export const getCatalogueEmailVerification = async (
  siret: string,
  email: string
): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const siren = getSirenFromSiret(siret);
  if (
    (await getDbCollection("catalogueEmailSirets").findOne({
      email,
      siret: { $regex: `^${siren}` },
    }))
  ) {
    return {
      is_valid: true,
      on: "email",
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

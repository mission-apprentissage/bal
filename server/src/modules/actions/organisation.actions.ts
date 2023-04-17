import companyEmailValidator from "company-email-validator"
import { IResOrganisationValidation } from "shared/routes/organisation.routes";

import { getAktoVerification } from "../common/apis/akto";

const isBlackListedDomains = (email: string)=>{
  return !companyEmailValidator.isCompanyEmail(email);
}

// TODO WIP
export const validation = async ({ email, siret } : { email: string, siret: string} ): Promise<IResOrganisationValidation> =>  {
  if(isBlackListedDomains(email)) {
    return {
      is_valid: false,
    };
  }

  // const [user,domain] = email.split('@');

  const siren = siret.substring(0, 9);

  const testAkto = await getAktoVerification(siren, email);
  if(testAkto) {
    return {
      is_valid: true,
      on: "email"
    };
  }

  // return {
  //   is_valid: true,
  //   on: "domain"
  // };

  return {
    is_valid: false,
  };
};

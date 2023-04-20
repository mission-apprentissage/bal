import companyEmailValidator from "company-email-validator";
import { IResOrganisationValidation } from "shared/routes/organisation.routes";

import { getAktoVerification } from "../apis/akto";
import { getOpcoEpVerification } from "../apis/opcoEp";

const isBlackListedDomains = (email: string) => {
  return !companyEmailValidator.isCompanyEmail(email);
};

// TODO WIP
export const validation = async ({
  email,
  siret,
}: {
  email: string;
  siret: string;
}): Promise<IResOrganisationValidation> => {
  if (isBlackListedDomains(email)) {
    return {
      is_valid: false,
    };
  }

  // const [user,domain] = email.split('@');

  const siren = siret.substring(0, 9);

  const testAkto = await getAktoVerification(siren, email);
  if (testAkto) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  const testOpcoEp = await getOpcoEpVerification(siret, email);
  console.log(testOpcoEp);
  //   1-	SIRET et courriel connus
  // {
  //     "codeRetour": 1,
  //     "detailRetour": "Email trouvé"
  // }

  // 2-	SIRET connu et domaine courriel connu
  // {
  //     "codeRetour": 2,
  //     "detailRetour": "Domaine identique"
  // }

  // 3-	SIRET connu et domaine courriel inconnu
  // {
  //     "codeRetour": 3,
  //     "detailRetour": "Email ou domaine inconnu"
  // }

  // 4-	SIRET inconnu
  // {
  //     "codeRetour": 4,
  //     "detailRetour": "Siret inconnu"
  // }

  // return {
  //   is_valid: true,
  //   on: "domain"
  // };

  return {
    is_valid: false,
  };
};

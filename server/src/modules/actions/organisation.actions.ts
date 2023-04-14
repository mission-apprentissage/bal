import companyEmailValidator from "company-email-validator"

export const validation = async (email: string) =>  {
  return companyEmailValidator.isCompanyEmail(email);
};

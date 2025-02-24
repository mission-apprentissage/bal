import { isCompanyDomain } from "company-email-validator";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { updateOrganisation } from "../../actions/organisations.actions";

export const sanitizeOrganisationDomains = async () => {
  const cursor = getDbCollection("organisations").find();

  for await (const organisation of cursor) {
    const domains = new Set(organisation.email_domains?.filter((d) => isCompanyDomain(d)) ?? []);

    if (domains.size !== organisation.email_domains?.length) {
      await updateOrganisation(organisation, { email_domains: [...domains], updated_at: new Date() });
    }
  }
};

import companyEmailValidator from "company-email-validator";
import { DOCUMENT_TYPES } from "shared/constants/documents";
import { getSirenFromSiret } from "shared/helpers/common";

import { findOrCreateOrganisation } from "./organisations.actions";
import { createPerson } from "./persons.actions";

export interface IOcapiatParsedContentLine {
  "RÈgion INSEE"?: string;
  "GUH Etablissement"?: string;
  "Code OPSI"?: string;
  Siret?: string;
  "Raison sociale"?: string;
  DÈpartement?: string;
  "Etablissement Sous Contrat"?: string;
  "Nom du groupe"?: string;
  "Effectif Etab moyen annuel"?: string;
  "Effectif Etab"?: string;
  "Taille Collecte"?: string;
  Branche?: string;
  "Branche Secteur"?: string;
  "Type Branche"?: string;
  Conseiller?: string;
  Civilite?: string;
  "Nom du contact"?: string;
  "PrÈnom du contact"?: string;
  "Titre du contact"?: string;
  "Fonction du contact"?: string;
  "TÈl contact"?: string;
  "Mobile contact"?: string;
  "Email du contact": string;
}

export const importOcapiatContent = async (
  content: IOcapiatParsedContentLine
) => {
  const siret = content?.Siret ?? "";
  const siren = getSirenFromSiret(siret);
  const email = content?.["Email du contact"];
  let domains: string[] = [];

  if (companyEmailValidator.isCompanyEmail(email)) {
    domains = [email.split("@")[1]];
  }

  // create organisation
  const organisation = await findOrCreateOrganisation(
    { siren },
    {
      siren,
      etablissements: [{ siret }],
      email_domains: domains,
      _meta: {
        source: DOCUMENT_TYPES.OCAPIAT,
      },
    }
  );

  // create person
  await createPerson({
    email: email,
    organisations: [organisation?._id.toString()],
    _meta: {
      source: DOCUMENT_TYPES.OCAPIAT,
    },
  });

  // todo handle already existing resources
};

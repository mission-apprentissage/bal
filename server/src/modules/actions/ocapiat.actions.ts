import companyEmailValidator from "company-email-validator";
import { DOCUMENT_TYPES } from "shared/constants/documents";
import { getSirenFromSiret } from "shared/helpers/common";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import { updateOrganisationData } from "./organisations.actions";

export interface IOcapiatParsedContentLine {
  "Région INSEE"?: string;
  "GUH Etablissement"?: string;
  "Code OPSI"?: string;
  Siret?: string;
  "Raison sociale"?: string;
  Département?: string;
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
  "Prénom du contact"?: string;
  "Titre du contact"?: string;
  "Fonction du contact"?: string;
  "Tél contact"?: string;
  "Mobile contact"?: string;
  "Email du contact"?: string;
}

export const parseOcapiatContentLine = (line: IOcapiatParsedContentLine): IOcapiatParsedContentLine | undefined => {
  // remove attributes where value is "-" considered empty
  const content = Object.entries(line).reduce<IOcapiatParsedContentLine>(
    (acc, [key, value]) => ({
      ...acc,
      ...(value === "-" ? {} : { [key]: value }),
    }),
    {}
  );

  return content;
};

export const importOcapiatContent = async (content: IOcapiatParsedContentLine) => {
  const siret = content?.Siret ?? "";
  const siren = getSirenFromSiret(siret);
  const email = content?.["Email du contact"];
  let domains: string[] = [];

  if (email && companyEmailValidator.isCompanyEmail(email)) {
    domains = [email.split("@")[1]];
  }

  const organisation = await updateOrganisationData({
    siren,
    sirets: [siret],
    email_domains: domains,
    source: DOCUMENT_TYPES.OCAPIAT,
  });

  if (!email) return;

  const date = new Date();

  getDbCollection("persons").updateOne(
    {
      email,
    },
    {
      $set: {
        updated_at: date,
      },
      $addToSet: {
        ...(organisation && { organisations: organisation._id.toString() }),
        sirets: siret,
        "_meta.sources": DOCUMENT_TYPES.OCAPIAT,
      },
      $setOnInsert: {
        email,
        ...(content?.["Nom du contact"] && {
          nom: content?.["Nom du contact"],
        }),
        ...(content?.["Prénom du contact"] && {
          prenom: content?.["Prénom du contact"],
        }),
        created_at: date,
      },
    },
    {
      upsert: true,
    }
  );
};

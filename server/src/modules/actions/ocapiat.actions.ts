import { DOCUMENT_TYPES } from "shared/constants/documents";

import { updateOrganisationAndPerson } from "./organisations.actions";

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
  const email = content?.["Email du contact"];

  if (!email) return;

  await updateOrganisationAndPerson(siret, email, DOCUMENT_TYPES.OCAPIAT, false, {
    nom: content?.["Nom du contact"] ?? "",
    prenom: content?.["Prénom du contact"] ?? "",
  });
};

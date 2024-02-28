import { CerfaFields } from "../types/cerfa.types";

export const signaturesSchema: CerfaFields = {
  "signatures.attestationPiecesJustificatives": {
    label: "L'employeur atteste disposer de l'ensemble des pièces justificatives nécessaires au dépôt du contrat.",
    fieldType: "consent",
    required: true,
    requiredMessage:
      "Il est obligatoire d'attester disposer de l'ensemble des pièces justificatives nécessaires au dépôt du contrat.",
    messages: [
      {
        type: "assistive",
        content: `Pendant la durée du contrat d’apprentissage, et après son terme, il peut vous être demandé de fournir :
        
- l’original du contrat signé,
- les pièces permettant d’attester du respect des déclarations figurant dans le contrat d’apprentissage
- la convention de formation, et le cas échéant la convention d'allongement ou réduction de durée du contrat (fournie par l'organisme de formation)

Vous devez donc conserver l’ensemble de ces documents originaux.`,
      },
    ],
  },
  "signatures.lieu": {
    label: "Fait à",
    placeholder: "Exemple : Paris",
    required: true,
    requiredMessage: "Le lieu de signature est obligatoire",
  },
};

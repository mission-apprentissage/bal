import { FC } from "react";
import { InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

import CerfaApprenti from "../components/blocks/apprenti/CerfaApprenti";
import CerfaContrat from "../components/blocks/contrat/CerfaContrat";
import CerfaEmployeur from "../components/blocks/employeur/CerfaEmployeur";
import CerfaFormation from "../components/blocks/formation/CerfaFormation";
import CerfaMaitreApprentissage from "../components/blocks/maitreApprentissage/CerfaMaitreApprentissage";
import CerfaSignatures from "../components/blocks/signatures/CerfaSignatures";

export interface CerfaStep {
  label: string;
  id: string;
  order: number;
  component: FC;
  messages?: InformationMessage[];
}

export type CerfaStepType = "EMPLOYEUR" | "APPRENTI" | "MAITRE_APPRENTISSAGE" | "CONTRAT" | "FORMATION" | "SIGNATURES";

export const CERFA_STEPS: Record<CerfaStepType, CerfaStep> = {
  EMPLOYEUR: {
    label: "Employeur",
    id: "employeur",
    order: 1,
    component: CerfaEmployeur,
  },
  APPRENTI: {
    label: "Apprenti",
    id: "apprenti",
    order: 2,
    component: CerfaApprenti,
  },
  MAITRE_APPRENTISSAGE: {
    label: "Maître d'apprentissage",
    id: "maitre-d-apprentissage",
    order: 3,
    component: CerfaMaitreApprentissage,
    messages: [
      {
        type: "regulatory",
        content: `Un maître d'apprentissage peut encadrer jusqu'à deux apprentis plus un redoublant maximum sur une même période [(code du travail, art. R6223-6)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037813430/). 

La commission départementale de l'emploi et de l'insertion peut accorder des dérogations à ce plafond.`,
      },
      {
        type: "bonus",
        content: `Il est possible pour le maître d'apprentissage d'obtenir une certification : plus d'informations sur le [site du ministère du Travail](https://travail-emploi.gouv.fr/formation-professionnelle/certification-competences-pro/certification-matu#:~:text=La%20certification%20relative%20aux%20comp%C3%A9tences%20de%20ma%C3%AEtre%20d%E2%80%99apprentissage%2Ftuteur,d%E2%80%99apprentissage%2Ftuteur%20en%20lien%20avec%20le%20r%C3%A9f%C3%A9rentiel%20de%20comp%C3%A9tences).`,
      },
    ],
  },
  CONTRAT: {
    label: "Contrat",
    id: "contrat",
    order: 4,
    component: CerfaContrat,
  },
  FORMATION: {
    label: "Formation",
    id: "formation",
    order: 5,
    component: CerfaFormation,
  },
  SIGNATURES: {
    label: "Visa, signatures",
    id: "signatures",
    order: 6,
    component: CerfaSignatures,
  },
};

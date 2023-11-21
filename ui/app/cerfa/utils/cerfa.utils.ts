import { FC } from "react";

import CerfaApprenti from "../components/blocks/apprenti/CerfaApprenti";
import CerfaContrat from "../components/blocks/contrat/CerfaContrat";
import CerfaEmployeur from "../components/blocks/employeur/CerfaEmployeur";
import CerfaFormation from "../components/blocks/formation/CerfaFormation";
import CerfaMaitreApprentissage from "../components/blocks/maitreApprentissage/CerfaMaitreApprentissage";

export interface CerfaStep {
  label: string;
  id: string;
  order: number;
  component: FC;
}

export type CerfaStepType = "EMPLOYEUR" | "APPRENTI" | "MAITRE_APPRENTISSAGE" | "CONTRAT" | "FORMATION";

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
};

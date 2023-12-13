import { Box } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../../CheckEmptyFields";
import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";
import { AvantagesNatures } from "./AvantagesNatures";
import { shouldAskDateEffetAvenant } from "./domain/shouldAskDateEffetAvenant";
import NumeroContratPrecedentField from "./NumeroContratPrecedentField";
import { Remunerations } from "./Remunerations";
import TypeDerogationField from "./TypeDerogationField";

const CerfaContrat: FC = () => {
  return (
    <Box>
      <InputController name="contrat.typeContratApp" />

      <InputController name="contrat.dateDebutContrat" />
      <InputController name="contrat.dateDebutFormationPratique" />
      <InputController name="contrat.dateFinContrat" />
      <InputController name="contrat.dateSignature" />

      <TypeDerogationField />
      <NumeroContratPrecedentField />

      <CollapseController show={shouldAskDateEffetAvenant}>
        <InputController name="contrat.dateEffetAvenant" />
      </CollapseController>

      <InputGroupTitle fontWeight={700}>Durée hebdomadaire du travail</InputGroupTitle>

      <InputController name="contrat.dureeTravailHebdoHeures" />
      <InputController name="contrat.dureeTravailHebdoMinutes" />

      <InputController name="contrat.travailRisque" />
      <Remunerations />

      <InputController name="contrat.caisseRetraiteSupplementaire" />
      <AvantagesNatures />

      <CheckEmptyFields blockName="contrat" />
    </Box>
  );
};

export default CerfaContrat;
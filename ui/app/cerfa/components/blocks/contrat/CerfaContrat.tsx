import { Box } from "@mui/material";
import { FC } from "react";

import CollapseController from "../../CollapseController";
import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
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
      <TypeDerogationField />
      <NumeroContratPrecedentField />

      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="contrat.dateSignature" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="contrat.dateFinContrat" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="contrat.dateDebutContrat" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="contrat.dateDebutFormationPratique" />
        </InputGroupItem>
      </InputGroupContainer>

      <CollapseController show={shouldAskDateEffetAvenant}>
        <InputController name="contrat.dateEffetAvenant" />
      </CollapseController>

      <InputGroupTitle fontWeight={700}>Durée hebdomadaire du travail</InputGroupTitle>

      <InputGroupContainer>
        <InputGroupItem size={3}>
          <InputController name="contrat.dureeTravailHebdoHeures" />
        </InputGroupItem>
        <InputGroupItem size={3}>
          <InputController name="contrat.dureeTravailHebdoMinutes" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="contrat.travailRisque" />
      <Remunerations />
      <AvantagesNatures />

      <CheckEmptyFields schema={{}} blockName="contrat" />
    </Box>
  );
};

export default CerfaContrat;

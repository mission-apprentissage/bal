import { Box, Collapse, Typography } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";
import { AvantagesNatures } from "./AvantagesNatures";
import { shouldAskDateEffetAvenant } from "./domain/shouldAskDateEffetAvenant";
import { Remunerations } from "./Remunerations";
import TypeDerogationField from "./TypeDerogationField";

const CerfaContrat: FC = () => {
  const values = useFormContext().getValues();
  return (
    <Box>
      <Box>
        <InputController name="contrat.typeContratApp" />
        <TypeDerogationField />
        {/* <TypeDerogationField />
        <NumeroContratPrecedentField /> */}
      </Box>
      <Box>
        <InputController name="contrat.dateDebutContrat" />
        <Collapse in={shouldAskDateEffetAvenant({ values })}>
          <InputController name="contrat.dateEffetAvenant" />
        </Collapse>
        <InputController name="contrat.dateFinContrat" />
      </Box>

      <Box pt={4}>
        <Typography fontWeight={700}>Durée hebdomadaire du travail :</Typography>
        <InputController name="contrat.dureeTravailHebdoHeures" type="number" />
        <InputController name="contrat.dureeTravailHebdoMinutes" type="number" />
        <InputController name="contrat.travailRisque" />
        <Remunerations />
        <AvantagesNatures />
      </Box>
      <CheckEmptyFields schema={{}} blockName="contrat" />
    </Box>
  );
};

export default CerfaContrat;

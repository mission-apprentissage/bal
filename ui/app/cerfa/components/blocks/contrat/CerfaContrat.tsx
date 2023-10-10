import { Box, Typography } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";

const CerfaContrat: FC = () => {
  return (
    <Box>
      <Box>
        <InputController name="contrat.typeContratApp" />
        {/* <TypeDerogationField />
        <NumeroContratPrecedentField /> */}
      </Box>
      <Box>
        <InputController name="contrat.dateDebutContrat" />
        {/* <CollapseController show={shouldAskDateEffetAvenant}> */}
        <InputController name="contrat.dateEffetAvenant" />
        {/* </CollapseController> */}
        <InputController name="contrat.dateFinContrat" />
      </Box>

      <Box pt={4}>
        <Box>
          <Typography fontWeight={700}>Durée hebdomadaire du travail :</Typography>
          <Box>
            <InputController name="contrat.dureeTravailHebdoHeures" type="number" />
            <InputController name="contrat.dureeTravailHebdoMinutes" type="number" />
          </Box>
        </Box>
        <InputController name="contrat.travailRisque" />
        {/* <Remunerations />
        <AvantagesNatures /> */}
      </Box>
      <CheckEmptyFields schema={{}} blockName="contrat" />
    </Box>
  );
};

export default CerfaContrat;

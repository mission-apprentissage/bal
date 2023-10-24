import { Box, Collapse, Typography } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";

import InputController from "../inputs/InputController";
import { shouldAskAvantageNature } from "./domain/shouldAskAvantageNature";

export const AvantagesNatures = () => {
  const { getValues } = useFormContext();
  const values = getValues();
  //   const missingFieldAvantages = cerfaStatus.global.errors.avantageNature?.touched;
  const missingFieldAvantages = true;
  return (
    <Box mt={6}>
      <InputController name="contrat.avantageNature" type="radio" />

      <Collapse in={shouldAskAvantageNature({ values })}>
        <Typography>Avantages en nature, le cas échéant :</Typography>
        {missingFieldAvantages && (
          <Typography>
            Si l&apos;apprenti(e) bénéficie d&apos;avantages en nature, veuillez saisir au moins un des champs
            ci-dessous.
          </Typography>
        )}
        <Box>
          <InputController name="contrat.avantageNourriture" type="number" />
          <InputController name="contrat.avantageLogement" type="number" />
          <InputController name="contrat.autreAvantageEnNature" type="consent" />
        </Box>
      </Collapse>
    </Box>
  );
};

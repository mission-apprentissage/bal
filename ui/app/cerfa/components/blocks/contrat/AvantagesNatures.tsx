import { Box } from "@mui/material";
import React from "react";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import { shouldAskAvantageNature } from "./domain/shouldAskAvantageNature";

export const AvantagesNatures = () => {
  return (
    <Box mt={6}>
      <InputController name="contrat.avantageNature" />

      <CollapseController show={shouldAskAvantageNature}>
        <InputGroupContainer>
          <InputGroupItem size={3}>
            <InputController name="contrat.avantageNourriture" />
          </InputGroupItem>
          <InputGroupItem size={3}>
            <InputController name="contrat.avantageLogement" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputController name="contrat.autreAvantageEnNature" />
      </CollapseController>
    </Box>
  );
};

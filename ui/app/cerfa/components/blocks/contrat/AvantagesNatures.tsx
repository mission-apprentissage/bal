import React from "react";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import { shouldAskAvantageNature } from "./domain/shouldAskAvantageNature";

export const AvantagesNatures = () => {
  return (
    <>
      <InputController name="contrat.avantageNature" />

      <CollapseController show={shouldAskAvantageNature}>
        <InputController name="contrat.avantageNourriture" />
        <InputController name="contrat.avantageLogement" />

        <InputController name="contrat.autreAvantageEnNature" />
      </CollapseController>
    </>
  );
};

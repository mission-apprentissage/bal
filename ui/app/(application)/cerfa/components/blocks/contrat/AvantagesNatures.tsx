import React from "react";
import { shouldAskAvantageNature } from "shared/helpers/cerfa/domains/contrat/shouldAskAvantageNature";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";

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

import { Box } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";

const CerfaEmployeur: FC = () => {
  return (
    <Box>
      <InputController name="employeur.siret" fieldType="text" />

      <Box>
        <InputController name="employeur.denomination" />

        <Box>
          <InputController name="employeur.adresse.numero" fieldType="number" />
          <InputController name="employeur.adresse.repetitionVoie" />
        </Box>
        <InputController name="employeur.adresse.voie" fieldType="text" />
        <InputController name="employeur.adresse.complement" />
        <InputController name="employeur.adresse.codePostal" />
        <InputController name="employeur.adresse.commune" />
        <InputController name="employeur.adresse.departement" />
        <InputController name="employeur.adresse.region" />
        <InputController name="employeur.telephone" />
        <InputController name="employeur.courriel" />
      </Box>
      <Box>
        <InputController name="employeur.typeEmployeur" fieldType="select" />
        <InputController name="employeur.employeurSpecifique" fieldType="select" />
        <InputController name="employeur.naf" fieldType="text" />
        <InputController name="employeur.nombreDeSalaries" fieldType="number" />
        <InputController name="employeur.codeIdcc" fieldType="text" />
        <InputController name="employeur.codeIdcc_special" fieldType="radio" />
        <InputController name="employeur.libelleIdcc" fieldType="text" />
        <InputController name="employeur.regimeSpecifique" fieldType="radio" />
      </Box>
      <CheckEmptyFields schema={{}} blockName="employeur" />
    </Box>
  );
};

export default CerfaEmployeur;

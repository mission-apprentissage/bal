import { Box } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../../CheckEmptyFields";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";
import EmployeurType from "./EmployeurType";

const CerfaEmployeur: FC = () => {
  return (
    <Box>
      <EmployeurType />

      <InputController name="employeur.siret" />
      <InputController name="employeur.denomination" />

      <InputGroupTitle>Adresse et contact de l’établissement d’exécution du contrat</InputGroupTitle>

      <InputGroupContainer>
        <InputGroupItem size={3}>
          <InputController name="employeur.adresse.numero" />
        </InputGroupItem>
        <InputGroupItem size={4}>
          <InputController name="employeur.adresse.repetitionVoie" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="employeur.adresse.voie" />
      <InputController name="employeur.adresse.complement" />
      <InputController name="employeur.adresse.codePostal" />
      <InputController name="employeur.adresse.commune" />

      <InputController name="employeur.telephone" />
      <InputController name="employeur.courriel" />

      <InputGroupTitle>Établissement d’exécution du contrat</InputGroupTitle>

      <InputController name="employeur.typeEmployeur" />
      <InputController name="employeur.employeurSpecifique" />
      <InputController name="employeur.naf" />
      <InputController name="employeur.nombreDeSalaries" />

      <InputController name="employeur.codeIdcc_special" />
      <InputController name="employeur.codeIdcc" />
      <InputController name="employeur.libelleIdcc" />

      <CheckEmptyFields blockName="employeur" />
    </Box>
  );
};

export default CerfaEmployeur;

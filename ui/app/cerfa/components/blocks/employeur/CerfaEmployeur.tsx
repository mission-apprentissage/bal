import { Box } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";

const CerfaEmployeur: FC = () => {
  return (
    <Box>
      <InputController name="employeur.siret" />
      <InputController name="employeur.denomination" />

      <InputGroupTitle>Adresse et contact de l’établissement d’exécution du contrat</InputGroupTitle>

      <InputGroupContainer>
        <InputGroupItem size={2}>
          <InputController name="employeur.adresse.numero" />
        </InputGroupItem>
        <InputGroupItem size={3}>
          <InputController name="employeur.adresse.repetitionVoie" />
        </InputGroupItem>
        <InputGroupItem size={7}>
          <InputController name="employeur.adresse.voie" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="employeur.adresse.complement" />

      <InputGroupContainer>
        <InputGroupItem size={2}>
          <InputController name="employeur.adresse.codePostal" />
        </InputGroupItem>
        <InputGroupItem size={10}>
          <InputController name="employeur.adresse.commune" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="employeur.adresse.departement" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="employeur.adresse.region" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="employeur.telephone" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="employeur.courriel" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupTitle>Établissement d’exécution du contrat</InputGroupTitle>

      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="employeur.typeEmployeur" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="employeur.employeurSpecifique" />
        </InputGroupItem>
      </InputGroupContainer>
      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="employeur.naf" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="employeur.nombreDeSalaries" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="employeur.codeIdcc" />
      <InputController name="employeur.codeIdcc_special" />
      <InputController name="employeur.libelleIdcc" />
      <InputController name="employeur.regimeSpecifique" />

      <CheckEmptyFields schema={{}} blockName="employeur" />
    </Box>
  );
};

export default CerfaEmployeur;

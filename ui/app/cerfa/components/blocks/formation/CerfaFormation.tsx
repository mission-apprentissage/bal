import { Box } from "@mui/material";
import { FC } from "react";

import CollapseController from "../../CollapseController";
import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";
import { shouldAskEtablissementFormation } from "./domain/shouldAskEtablissementFormation";

const CerfaFormation: FC = () => {
  return (
    <Box>
      <Box>
        <InputController name="organismeFormation.formationInterne" />
        <InputController name="organismeFormation.siret" />

        <InputGroupContainer>
          <InputGroupItem size={6}>
            <InputController name="organismeFormation.denomination" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="organismeFormation.uaiCfa" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputGroupTitle>Adresse du CFA responsable</InputGroupTitle>

        <InputGroupContainer>
          <InputGroupItem size={2}>
            <InputController name="organismeFormation.adresse.numero" />
          </InputGroupItem>
          <InputGroupItem size={3}>
            <InputController name="organismeFormation.adresse.repetitionVoie" />
          </InputGroupItem>
          <InputGroupItem size={7}>
            <InputController name="organismeFormation.adresse.voie" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="organismeFormation.adresse.complement" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="organismeFormation.adresse.codePostal" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="organismeFormation.adresse.commune" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputController name="etablissementFormation.memeResponsable" />

        <InputGroupContainer>
          <InputGroupItem size={6}>
            <InputController name="formation.rncp" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="formation.codeDiplome" />
          </InputGroupItem>
        </InputGroupContainer>
        <InputController name="formation.typeDiplome" />
        <InputController name="formation.intituleQualification" />

        <InputGroupTitle>Organisation de la formation en CFA</InputGroupTitle>

        <InputGroupContainer>
          <InputGroupItem size={6}>
            <InputController name="formation.dateDebutFormation" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="formation.dateFinFormation" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="formation.dureeFormation" />
          </InputGroupItem>
        </InputGroupContainer>
      </Box>

      <CollapseController show={shouldAskEtablissementFormation}>
        <InputGroupTitle>Le lieu de formation</InputGroupTitle>

        <InputController name="etablissementFormation.siret" />

        <InputGroupContainer>
          <InputGroupItem size={6}>
            <InputController name="etablissementFormation.denomination" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="etablissementFormation.uaiCfa" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputGroupTitle>Adresse du lieu de formation</InputGroupTitle>

        <InputGroupContainer>
          <InputGroupItem size={2}>
            <InputController name="etablissementFormation.adresse.numero" />
          </InputGroupItem>
          <InputGroupItem size={3}>
            <InputController name="etablissementFormation.adresse.repetitionVoie" />
          </InputGroupItem>
          <InputGroupItem size={7}>
            <InputController name="etablissementFormation.adresse.voie" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="etablissementFormation.adresse.complement" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="etablissementFormation.adresse.codePostal" />
          </InputGroupItem>
          <InputGroupItem size={6}>
            <InputController name="etablissementFormation.adresse.commune" />
          </InputGroupItem>
        </InputGroupContainer>
      </CollapseController>

      <CheckEmptyFields schema={{}} blockName="formation" />
    </Box>
  );
};

export default CerfaFormation;

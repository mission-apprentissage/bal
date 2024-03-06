import { Box } from "@mui/material";
import { FC } from "react";
import { shouldAskEtablissementFormation } from "shared/helpers/cerfa/domains/formation/shouldAskEtablissementFormation";

import CheckEmptyFields from "../../CheckEmptyFields";
import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";

const CerfaFormation: FC = () => {
  return (
    <Box>
      <Box>
        <InputController name="organismeFormation.formationInterne" />
        <InputController name="organismeFormation.siret" />

        <InputController name="organismeFormation.uaiCfa" />
        <InputController name="organismeFormation.denomination" />
        <InputController name="formation.rncp" />
        <InputController name="formation.codeDiplome" />

        <InputController name="formation.intituleQualification" />
        <InputController name="formation.typeDiplome" />

        <InputGroupTitle>Adresse et contact du CFA responsable</InputGroupTitle>

        <InputGroupContainer>
          <InputGroupItem size={4}>
            <InputController name="organismeFormation.adresse.numero" />
          </InputGroupItem>
          <InputGroupItem size={5}>
            <InputController name="organismeFormation.adresse.repetitionVoie" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputController name="organismeFormation.adresse.voie" />
        <InputController name="organismeFormation.adresse.complement" />
        <InputController name="organismeFormation.adresse.codePostal" />
        <InputController name="organismeFormation.adresse.commune" />

        <InputController name="etablissementFormation.memeResponsable" />

        <CollapseController show={shouldAskEtablissementFormation}>
          <InputGroupTitle>Le lieu de formation</InputGroupTitle>

          <InputController name="etablissementFormation.siret" />

          <InputController name="etablissementFormation.uaiCfa" />
          <InputController name="etablissementFormation.denomination" />

          <InputGroupTitle>Adresse du lieu de formation</InputGroupTitle>

          <InputGroupContainer>
            <InputGroupItem size={3}>
              <InputController name="etablissementFormation.adresse.numero" />
            </InputGroupItem>
            <InputGroupItem size={4}>
              <InputController name="etablissementFormation.adresse.repetitionVoie" />
            </InputGroupItem>
          </InputGroupContainer>
          <InputController name="etablissementFormation.adresse.voie" />
          <InputController name="etablissementFormation.adresse.complement" />
          <InputController name="etablissementFormation.adresse.codePostal" />
          <InputController name="etablissementFormation.adresse.commune" />
        </CollapseController>

        <InputGroupTitle>Organisation de la formation en CFA</InputGroupTitle>

        <InputController name="formation.dateDebutFormation" />
        <InputController name="formation.dateFinFormation" />
        <InputController name="formation.dureeFormation" />
      </Box>

      <CheckEmptyFields blockName={["formation", "organismeFormation", "etablissementFormation"]} />
    </Box>
  );
};

export default CerfaFormation;

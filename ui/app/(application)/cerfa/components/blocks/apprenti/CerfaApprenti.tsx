import { Box } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { shouldAskRepresentantLegal } from "shared/helpers/cerfa/domains/apprenti/shouldAskRepresentantLegal";
import { shouldAskResponsableLegalAdresse } from "shared/helpers/cerfa/domains/apprenti/shouldAskResponsableLegalAdresse";

import CheckEmptyFields from "../../CheckEmptyFields";
import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";
import DateNaissanceField from "./DateNaissanceField";

const CerfaApprenti: FC = () => {
  const values = useFormContext().getValues();

  const ignoreBlocks: string[] = [];

  if (!shouldAskRepresentantLegal({ values })) {
    ignoreBlocks.push("apprenti.responsableLegal");
  }

  if (!shouldAskResponsableLegalAdresse({ values })) {
    ignoreBlocks.push("apprenti.responsableLegal.adresse");
  }

  return (
    <Box>
      <InputController name="apprenti.nom" />
      <InputController name="apprenti.nomUsage" />
      <InputController name="apprenti.prenom" />
      <DateNaissanceField />
      <InputController name="apprenti.sexe" />
      <InputController name="apprenti.lieuNaissanceFrance" />
      <InputController name="apprenti.communeNaissance" />
      <InputController name="apprenti.departementNaissance" />
      <InputController name="apprenti.nir" />
      <InputController name="apprenti.nationalite" />
      <InputController name="apprenti.regimeSocial" />

      <InputGroupTitle>Adresse et contact de l’apprenti(e)</InputGroupTitle>
      <InputGroupContainer>
        <InputGroupItem size={4}>
          <InputController name="apprenti.adresse.numero" />
        </InputGroupItem>
        <InputGroupItem size={5}>
          <InputController name="apprenti.adresse.repetitionVoie" />
        </InputGroupItem>
      </InputGroupContainer>
      <InputController name="apprenti.adresse.voie" />
      <InputController name="apprenti.adresse.complement" />
      <InputController name="apprenti.adresse.codePostal" />
      <InputController name="apprenti.adresse.commune" />
      <InputController name="apprenti.telephone" />
      <InputController name="apprenti.courriel" />

      <InputGroupTitle>Informations supplémentaires sur l’apprenti(e)</InputGroupTitle>

      <InputController name="apprenti.projetCreationRepriseEntreprise" />
      <InputController name="apprenti.inscriptionSportifDeHautNiveau" />
      <InputController name="apprenti.handicap" />
      <InputController name="apprenti.situationAvantContrat" />

      <InputController name="apprenti.diplomePrepare" />
      <InputController name="apprenti.derniereClasse" />
      <InputController name="apprenti.intituleDiplomePrepare" />
      <InputController name="apprenti.diplome" />

      <InputController name="apprenti.apprentiMineur" />
      <InputController name="apprenti.apprentiMineurNonEmancipe" />

      <CollapseController show={shouldAskRepresentantLegal}>
        <InputGroupTitle>Représentant légal</InputGroupTitle>
        <InputController name="apprenti.responsableLegal.nom" />
        <InputController name="apprenti.responsableLegal.courriel" />
        <InputController name="apprenti.responsableLegal.memeAdresse" />

        <CollapseController show={shouldAskResponsableLegalAdresse}>
          <InputGroupContainer>
            <InputGroupItem size={4}>
              <InputController name="apprenti.responsableLegal.adresse.numero" />
            </InputGroupItem>
            <InputGroupItem size={5}>
              <InputController name="apprenti.responsableLegal.adresse.repetitionVoie" />
            </InputGroupItem>
          </InputGroupContainer>
          <InputController name="apprenti.responsableLegal.adresse.voie" />
          <InputController name="apprenti.responsableLegal.adresse.complement" />
          <InputController name="apprenti.responsableLegal.adresse.codePostal" />
          <InputController name="apprenti.responsableLegal.adresse.commune" />
        </CollapseController>
      </CollapseController>

      <CheckEmptyFields blockName="apprenti" ignoreBlocks={ignoreBlocks} />
    </Box>
  );
};

export default CerfaApprenti;

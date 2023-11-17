import { Box } from "@mui/material";
import { FC } from "react";

import CollapseController from "../../CollapseController";
import CheckEmptyFields from "../CheckEmptyFields";
import { shouldAskRepresentantLegal } from "../domain/shouldAskRepresentantLegal";
import { shouldAskResponsableLegalAdresse } from "../domain/shouldAskResponsableLegalAdresse";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";

const CerfaApprenti: FC = () => {
  return (
    <Box>
      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="apprenti.nom" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.nomUsage" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.prenom" />
        </InputGroupItem>
        <InputGroupItem size={6} />
        <InputGroupItem size={6}>
          <InputController name="apprenti.dateNaissance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.sexe" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.lieuNaissanceFrance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.communeNaissance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.departementNaissance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.nir" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.nationalite" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.regimeSocial" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupTitle>Adresse et contact de l’apprenti(e)</InputGroupTitle>
      <InputGroupContainer>
        <InputGroupItem size={2}>
          <InputController name="apprenti.adresse.numero" />
        </InputGroupItem>
        <InputGroupItem size={3}>
          <InputController name="apprenti.adresse.repetitionVoie" />
        </InputGroupItem>
        <InputGroupItem size={7}>
          <InputController name="apprenti.adresse.voie" />
        </InputGroupItem>
        <InputGroupItem size={12}>
          <InputController name="apprenti.adresse.complement" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.adresse.codePostal" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.adresse.commune" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.adresse.pays" />
        </InputGroupItem>
        <InputGroupItem size={6} />
        <InputGroupItem size={6}>
          <InputController name="apprenti.telephone" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.courriel" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupTitle>Informations supplémentaires sur l’apprenti(e)</InputGroupTitle>

      <InputController name="apprenti.projetCreationRepriseEntreprise" />
      <InputController name="apprenti.inscriptionSportifDeHautNiveau" />
      <InputController name="apprenti.handicap" />
      <InputController name="apprenti.situationAvantContrat" />

      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="apprenti.diplomePrepare" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.derniereClasse" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.intituleDiplomePrepare" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="apprenti.diplome" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="apprenti.apprentiMineur" />
      <InputController name="apprenti.apprentiMineurNonEmancipe" />

      <CollapseController show={shouldAskRepresentantLegal}>
        <InputGroupTitle>Représentant légal</InputGroupTitle>
        <InputGroupContainer>
          <InputGroupItem size={6}>
            <InputController name="apprenti.responsableLegal.nom" />
          </InputGroupItem>
        </InputGroupContainer>

        <InputController name="apprenti.responsableLegal.memeAdresse" />

        <CollapseController show={shouldAskResponsableLegalAdresse}>
          <InputGroupContainer>
            <InputGroupItem size={2}>
              <InputController name="apprenti.responsableLegal.adresse.numero" />
            </InputGroupItem>
            <InputGroupItem size={3}>
              <InputController name="apprenti.responsableLegal.adresse.repetitionVoie" />
            </InputGroupItem>
            <InputGroupItem size={7}>
              <InputController name="apprenti.responsableLegal.adresse.voie" />
            </InputGroupItem>
            <InputGroupItem size={12}>
              <InputController name="apprenti.responsableLegal.adresse.complement" />
            </InputGroupItem>
            <InputGroupItem size={6}>
              <InputController name="apprenti.responsableLegal.adresse.codePostal" />
            </InputGroupItem>
            <InputGroupItem size={6}>
              <InputController name="apprenti.responsableLegal.adresse.commune" />
            </InputGroupItem>
            <InputGroupItem size={6}>
              <InputController name="apprenti.responsableLegal.courriel" />
            </InputGroupItem>
          </InputGroupContainer>
        </CollapseController>
      </CollapseController>

      <CheckEmptyFields schema={{}} blockName="apprenti" />
    </Box>
  );
};

export default CerfaApprenti;

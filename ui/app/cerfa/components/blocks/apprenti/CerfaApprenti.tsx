import { Box, Typography } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";

const CerfaApprenti: FC = () => {
  return (
    <Box>
      <Box>
        <InputController name="apprenti.nom" />
        <InputController name="apprenti.prenom" />

        <Box>
          <InputController name="apprenti.adresse.numero" />
          <InputController name="apprenti.adresse.repetitionVoie" />
        </Box>
        <InputController name="apprenti.adresse.voie" />
        <InputController name="apprenti.adresse.complement" />
        <InputController name="apprenti.adresse.codePostal" />
        <InputController name="apprenti.adresse.commune" />
        <InputController name="apprenti.adresse.pays" />
        <InputController name="apprenti.telephone" />
        <InputController name="apprenti.courriel" />
        <Box mt={5}>
          <InputController name="apprenti.apprentiMineur" />
          <InputController name="apprenti.apprentiMineurNonEmancipe" fieldType="radio" />
        </Box>
        <Box mt={5}>
          <Typography>Représentant légal</Typography>
          <InputController name="apprenti.responsableLegal.nom" />
          <InputController name="apprenti.responsableLegal.prenom" />
          <Typography>Adresse du représentant légal :</Typography>
          <InputController name="apprenti.responsableLegal.memeAdresse" fieldType="radio" />

          <InputController name="apprenti.responsableLegal.adresse.numero" />
          <Box>
            <InputController name="apprenti.responsableLegal.adresse.numero" />
            <InputController name="apprenti.responsableLegal.adresse.repetitionVoie" />
          </Box>
          <InputController name="apprenti.responsableLegal.adresse.voie" />
          <InputController name="apprenti.responsableLegal.adresse.complement" />
          <InputController name="apprenti.responsableLegal.adresse.codePostal" />
          <InputController name="apprenti.responsableLegal.adresse.commune" />
          <InputController name="apprenti.responsableLegal.adresse.pays" />
        </Box>
      </Box>
      <Box>
        <InputController name="apprenti.dateNaissance" />
        <InputController name="apprenti.sexe" />
        <InputController name="apprenti.departementNaissance" />
        <InputController name="apprenti.communeNaissance" />
        <InputController name="apprenti.nationalite" />
        <InputController name="apprenti.regimeSocial" />
        <InputController name="apprenti.inscriptionSportifDeHautNiveau" />
        <InputController name="apprenti.handicap" />
        <InputController name="apprenti.situationAvantContrat" />
        <InputController name="apprenti.diplomePrepare" />
        <InputController name="apprenti.derniereClasse" />
        <InputController name="apprenti.intituleDiplomePrepare" />
        <InputController name="apprenti.diplome" />
      </Box>

      <CheckEmptyFields schema={{}} blockName="apprenti" />
    </Box>
  );
};

export default CerfaApprenti;

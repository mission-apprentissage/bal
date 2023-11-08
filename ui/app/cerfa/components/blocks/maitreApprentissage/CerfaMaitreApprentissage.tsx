import { Box } from "@mui/material";
import { FC } from "react";

import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";

const CerfaMaitreApprentissage: FC = () => {
  return (
    <Box>
      <InputGroupTitle fontWeight={700}>Maître d&apos;apprentissage n°1 </InputGroupTitle>
      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="maitre1.nom" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.prenom" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.dateNaissance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.nir" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.emploiOccupe" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.diplome" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.niveauDiplome" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre1.courriel" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputGroupTitle fontWeight={700}>Maître d&apos;apprentissage n°2 (Optionnel)</InputGroupTitle>
      <InputGroupContainer>
        <InputGroupItem size={6}>
          <InputController name="maitre2.nom" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.prenom" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.dateNaissance" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.nir" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.emploiOccupe" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.diplome" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.niveauDiplome" />
        </InputGroupItem>
        <InputGroupItem size={6}>
          <InputController name="maitre2.courriel" />
        </InputGroupItem>
      </InputGroupContainer>

      <InputController name="employeur.attestationEligibilite" />
    </Box>
  );
};

export default CerfaMaitreApprentissage;

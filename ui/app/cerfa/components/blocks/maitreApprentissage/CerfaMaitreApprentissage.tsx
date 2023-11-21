import { Box } from "@mui/material";
import { FC } from "react";

import InputController from "../inputs/InputController";
import InputGroupTitle from "../inputs/inputGroup/InputGroupTitle";

const CerfaMaitreApprentissage: FC = () => {
  return (
    <Box>
      <InputGroupTitle fontWeight={700}>Maître d&apos;apprentissage n°1 </InputGroupTitle>
      <InputController name="maitre1.nom" />
      <InputController name="maitre1.prenom" />
      <InputController name="maitre1.dateNaissance" />
      <InputController name="maitre1.nir" />
      <InputController name="maitre1.emploiOccupe" />
      <InputController name="maitre1.niveauDiplome" />
      <InputController name="maitre1.diplome" />
      <InputController name="maitre1.courriel" />

      <InputGroupTitle fontWeight={700}>Maître d&apos;apprentissage n°2 (Optionnel)</InputGroupTitle>
      <InputController name="maitre2.nom" />
      <InputController name="maitre2.prenom" />
      <InputController name="maitre2.dateNaissance" />
      <InputController name="maitre2.nir" />
      <InputController name="maitre2.emploiOccupe" />
      <InputController name="maitre2.niveauDiplome" />
      <InputController name="maitre2.diplome" />
      <InputController name="maitre2.courriel" />

      <InputController name="employeur.attestationEligibilite" />
    </Box>
  );
};

export default CerfaMaitreApprentissage;

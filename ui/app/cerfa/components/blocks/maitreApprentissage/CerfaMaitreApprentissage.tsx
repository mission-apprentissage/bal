import { Box, Typography } from "@mui/material";
import { FC } from "react";

import InputController from "../inputs/InputController";

const CerfaMaitreApprentissage: FC = () => {
  return (
    <Box>
      <Box>
        <Typography fontWeight={700}>Maître d&apos;apprentissage n°1 </Typography>
        <InputController name="maitre1.nom" />
        <InputController name="maitre1.prenom" />
        <InputController name="maitre1.dateNaissance" />
      </Box>
      <Box>
        <Typography fontWeight={700}>Maître d&apos;apprentissage n°2 (Optionnel)</Typography>
        <InputController name="maitre2.nom" />
        <InputController name="maitre2.prenom" />
        <InputController name="maitre2.dateNaissance" />
      </Box>

      <InputController name="employeur.attestationEligibilite" />
    </Box>
  );
};

export default CerfaMaitreApprentissage;

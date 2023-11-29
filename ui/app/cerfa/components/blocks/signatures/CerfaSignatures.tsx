import { Box, Typography } from "@mui/material";
import { FC } from "react";

import InputController from "../inputs/InputController";

const CerfaSignatures: FC = () => {
  return (
    <Box>
      <Box mb={2}>
        <Typography gutterBottom>
          Si vous êtes un CFA, vous devrez ajouter votre cachet et la signature du directeur sur le document final.
        </Typography>
      </Box>
      <InputController name="signatures.attestationPiecesJustificatives" />
      <InputController name="signatures.lieu" />
    </Box>
  );
};

export default CerfaSignatures;

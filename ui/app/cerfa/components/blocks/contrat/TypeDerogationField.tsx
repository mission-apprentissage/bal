import { Box, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import InputController from "../inputs/InputController";

const TypeDerogationField = () => {
  const {
    contrat: { dateDebutContrat },
    apprenti: { dateNaissance: apprentiDateNaissance },
  } = useFormContext().getValues();

  const dateDebutContratEmpty = dateDebutContrat === "";
  const apprentiDateNaissanceEmpty = apprentiDateNaissance === "";

  return (
    <Box mb={2}>
      <Box>
        <InputController name="contrat.typeDerogation" />
      </Box>
      {(dateDebutContratEmpty || apprentiDateNaissanceEmpty) && (
        <Typography component="span" variant="caption">
          Pour renseigner une dérogation, vous devez renseigner au préalable les champs : date de naissance de
          l’apprenti, date de début d&apos;exécution du contrat
        </Typography>
      )}
    </Box>
  );
};

export default TypeDerogationField;

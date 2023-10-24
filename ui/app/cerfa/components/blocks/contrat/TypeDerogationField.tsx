import { Typography } from "@mui/material";
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
    <>
      <InputController name="contrat.typeDerogation" />
      {(dateDebutContratEmpty || apprentiDateNaissanceEmpty) && (
        <Typography component="span">
          Pour renseigner une dérogation, vous devez renseigner au préalable les champs : champs :{" "}
          <Typography sx={{ textDecoration: apprentiDateNaissanceEmpty ? "underline" : "none" }} component="span">
            date de naissance de l’apprenti
          </Typography>
          ,{" "}
          <Typography sx={{ textDecoration: dateDebutContratEmpty ? "underline" : "none" }} component="span">
            date de début d&apos;exécution du contrat
          </Typography>
        </Typography>
      )}
    </>
  );
};

export default TypeDerogationField;

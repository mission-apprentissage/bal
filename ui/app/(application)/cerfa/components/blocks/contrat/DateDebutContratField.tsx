import Notice from "@codegouvfr/react-dsfr/Notice";
import { Box } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import InputController from "../inputs/InputController";

const DateDebutContratField: FC = () => {
  const {
    apprenti: { dateNaissance },
    contrat: { dateDebutContrat },
  } = useFormContext().getValues();

  if (!dateNaissance || !dateDebutContrat) {
    return <InputController name="contrat.dateDebutContrat" />;
  }

  const { exactAge: age } = caclAgeAtDate(dateNaissance, dateDebutContrat);
  let message: string | undefined;

  if (age) {
    if (age < 16) {
      message = `Votre apprenti(e) aura moins de 16 ans à la date de début de contrat. Le code du travail prévoit des cas de dérogation au seuil minimum d’âge du contrat vous permettant d’embaucher un apprenti de 15 ans. Vous devrez sélectionner un type de dérogation 11 dans le champ “Type de dérogation”.`;
    }

    if (age > 29) {
      message = `Votre apprenti(e) aura plus de 29 ans à la date de début de contrat. Le code du travail prévoit des cas de dérogation au seuil maximum d’âge du contrat vous permettant d’embaucher un apprenti de plus de 29 ans. Vous devrez sélectionner un type de dérogation 12 dans le champs “Type de dérogation”.`;
    }
  }

  return (
    <>
      <InputController name="contrat.dateDebutContrat" />
      {message && (
        <Box mb={3}>
          <Notice title={message} />
        </Box>
      )}
    </>
  );
};

export default DateDebutContratField;

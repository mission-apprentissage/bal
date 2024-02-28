import Notice from "@codegouvfr/react-dsfr/Notice";
import { Box } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import InputController from "../inputs/InputController";

const DateNaissanceField: FC = () => {
  const { getValues } = useFormContext(); // retrieve those props
  const values = getValues();

  const {
    apprenti: { dateNaissance },
  } = values;

  if (!dateNaissance) {
    return <InputController name="apprenti.dateNaissance" />;
  }

  const { exactAge } = caclAgeAtDate(dateNaissance, new Date().toISOString());

  return (
    <>
      <InputController name="apprenti.dateNaissance" />
      {exactAge < 15 && (
        <Box mb={3}>
          <Notice
            title={`Votre apprenti(e) a ${exactAge} ans aujourd’hui, le contrat ne pourra débuter que lorsqu’il ou elle aura 15 ans.`}
          />
        </Box>
      )}
    </>
  );
};

export default DateNaissanceField;

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";

import cerfaSchema from "../utils/cerfaSchema";
import { countBlockErrors } from "../utils/form.utils";
import ListErrors from "./ListErrors";

interface Props {
  blockName: string | string[];
}

const CheckEmptyFields: FC<Props> = ({ blockName }) => {
  const isArray = Array.isArray(blockName);
  const [showErrors, setShowErrors] = useState(false);

  const fields = Object.entries(cerfaSchema.fields)
    .filter(([key]) => {
      if (isArray) return blockName.some((name) => key.startsWith(name));
      return key.startsWith(blockName);
    })
    .map(([key]) => key);

  const {
    formState: { errors },
    trigger,
  } = useFormContext();

  const triggerBlockValidation = () => {
    setShowErrors(true);
    trigger(fields);
  };

  let blockErrors = {};

  if (isArray) {
    blockName.forEach((name) => {
      blockErrors = { ...blockErrors, ...errors?.[name] };
    });
  } else {
    blockErrors = { ...blockErrors, ...errors?.[blockName] };
  }

  const numberOfErrors = countBlockErrors(blockErrors);

  return (
    <Box>
      <Box mb={2}>
        <Button type="button" priority="secondary" onClick={triggerBlockValidation}>
          Est-ce que tous mes champs sont remplis ?
        </Button>
      </Box>
      {showErrors && (
        <Alert
          small
          closable
          description={
            <Box ml={2} mt={2}>
              <Typography
                gutterBottom
                color={fr.colors.decisions.text.default.error.default}
              >{`Il y a ${numberOfErrors} champs non remplis :`}</Typography>
              <Box component="ul" ml={1}>
                {isArray ? (
                  blockName.map((name) => <ListErrors key={name} name={name} errors={blockErrors} />)
                ) : (
                  <ListErrors name={blockName} errors={blockErrors} />
                )}
              </Box>
            </Box>
          }
          onClose={() => setShowErrors(false)}
          severity="error"
        />
      )}
    </Box>
  );
};

export default CheckEmptyFields;

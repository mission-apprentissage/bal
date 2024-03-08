import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { get } from "lodash";
import { FC, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";

import cerfaSchema from "../utils/cerfaSchema";
import ListError from "./ListError";

interface Props {
  blockName: string | string[];
  ignoreBlocks?: string[];
}

const CheckEmptyFields: FC<Props> = ({ blockName, ignoreBlocks }) => {
  const isArray = Array.isArray(blockName);
  const [showErrors, setShowErrors] = useState(false);

  const fields = Object.entries(cerfaSchema.fields)
    .filter(([key]) => {
      if (isArray)
        return blockName.some((name) => key.startsWith(name) && !ignoreBlocks?.some((name) => key.startsWith(name)));
      return key.startsWith(blockName) && !ignoreBlocks?.some((name) => key.startsWith(name));
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

  const displayErrors: { name: string; error: FieldError }[] = [];

  fields.forEach((field) => {
    const error = get(errors, field) as FieldError | undefined;

    if (error) {
      displayErrors.push({ name: field, error: get(errors, field) as FieldError });
    }
  });

  const numberOfErrors = displayErrors.length;

  return (
    <Box>
      <Box mb={2}>
        <Button type="button" priority="secondary" onClick={triggerBlockValidation}>
          Est-ce que tous mes champs sont remplis ?
        </Button>
      </Box>
      {showErrors && numberOfErrors === 0 && (
        <Alert
          small
          closable
          description="Tous les champs sont remplis"
          onClose={() => setShowErrors(false)}
          severity="success"
        />
      )}
      {showErrors && !!numberOfErrors && (
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
                {displayErrors.map(({ name, error }) => (
                  <ListError key={name} name={name} error={error} />
                ))}
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

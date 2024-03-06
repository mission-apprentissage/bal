import { fr } from "@codegouvfr/react-dsfr";
import { Box, styled } from "@mui/material";
import { FC } from "react";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

import { isFieldError } from "../utils/form.utils";

interface Props {
  name?: string;
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const StyledListItem = styled("li")(() => ({
  cursor: "pointer",
  color: fr.colors.decisions.text.default.error.default,
  "&:hover": {
    textDecoration: "underline",
  },
}));

const ListErrors: FC<Props> = ({ errors, name }) => {
  const { setFocus } = useFormContext();
  if (!errors) {
    return null;
  }

  if (isFieldError(errors)) {
    return (
      <StyledListItem
        onClick={() => {
          name && setFocus(name);
        }}
      >
        {errors.message}
      </StyledListItem>
    );
  }

  return (
    <Box>
      {Object.entries(errors).map(([key, value]) => {
        return <ListErrors key={key} name={`${name}.${key}`} errors={value} />;
      })}
    </Box>
  );
};

export default ListErrors;

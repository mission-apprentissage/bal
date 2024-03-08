import { fr } from "@codegouvfr/react-dsfr";
import { styled } from "@mui/material";
import { FC } from "react";
import { FieldError, useFormContext } from "react-hook-form";

interface Props {
  name?: string;
  error: FieldError;
}

const StyledListItem = styled("li")(() => ({
  cursor: "pointer",
  color: fr.colors.decisions.text.default.error.default,
  "&:hover": {
    textDecoration: "underline",
  },
}));

const ListError: FC<Props> = ({ error, name }) => {
  const { setFocus } = useFormContext();

  if (!error) {
    return null;
  }

  return (
    <StyledListItem
      onClick={() => {
        name && setFocus(name);
      }}
    >
      {error.message}
    </StyledListItem>
  );
};

export default ListError;

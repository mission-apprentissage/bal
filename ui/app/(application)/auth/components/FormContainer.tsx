import { fr } from "@codegouvfr/react-dsfr";
import { styled } from "@mui/material";

const FormContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: "1px solid",
  borderColor: fr.colors.decisions.border.actionLow.blueFrance.default,

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

export default FormContainer;

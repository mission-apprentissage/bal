import { fr } from "@codegouvfr/react-dsfr";
import { Box, styled } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props {
  active: boolean;
}

const StyledBox = styled(Box, { shouldForwardProp: (propName) => propName !== "active" })<Props>(({ active }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: 8,
  minWidth: 32,
  width: 32,
  height: 32,
  border: "1px solid",
  borderRadius: "50%",
  borderColor: fr.colors.decisions.background.flat.blueFrance.default,
  color: fr.colors.decisions.background.flat.blueFrance.default,
  ...(active && {
    backgroundColor: fr.colors.decisions.background.flat.blueFrance.default,
    color: fr.colors.decisions.text.inverted.info.default,
  }),
}));

const StepNumber: FC<PropsWithChildren<Props>> = ({ children, active }) => {
  return <StyledBox active={active}>{children}</StyledBox>;
};

export default StepNumber;

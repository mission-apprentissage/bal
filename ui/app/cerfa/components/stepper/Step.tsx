import { fr } from "@codegouvfr/react-dsfr";
import { Box, BoxProps, Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";

import StepNumber from "./StepNumber";

interface Props extends BoxProps {
  active: boolean;
  stepNumber: number;
}

const Step: FC<PropsWithChildren<Props>> = ({ active, stepNumber, children, ...boxProps }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={2}
      borderLeft={active ? `4px solid ${fr.colors.decisions.background.flat.blueFrance.default}` : undefined}
      {...boxProps}
      sx={{ cursor: "pointer" }}
    >
      <StepNumber active={active}>{stepNumber}</StepNumber>
      <Typography variant="h6" color={active ? fr.colors.decisions.background.flat.blueFrance.default : undefined}>
        {children}
      </Typography>
    </Box>
  );
};
export default Step;

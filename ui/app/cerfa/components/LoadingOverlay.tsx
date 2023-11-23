import { Box, Dialog, styled } from "@mui/material";
import { FC } from "react";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    borderRadius: 4,
  },
}));

const LoadingOverlay: FC = () => {
  return (
    <StyledDialog open>
      <Box p={4}>Récupération des informations en cours...</Box>
    </StyledDialog>
  );
};
export default LoadingOverlay;

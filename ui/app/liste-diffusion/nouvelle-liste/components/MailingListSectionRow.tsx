import { fr } from "@codegouvfr/react-dsfr";
import type { GridProps } from "@mui/material";
import { Grid } from "@mui/material";
import type { FC, PropsWithChildren } from "react";

const MailingListSectionRow: FC<PropsWithChildren<GridProps>> = ({ children, ...props }) => {
  return (
    <Grid container spacing={2} mb={2} p={2} bgcolor={fr.colors.decisions.background.alt.blueFrance.default} {...props}>
      {children}
    </Grid>
  );
};

export default MailingListSectionRow;

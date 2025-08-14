import type { GridProps } from "@mui/material";
import { Grid } from "@mui/material";
import type { FC, PropsWithChildren } from "react";

const MailingListSectionCell: FC<PropsWithChildren<GridProps>> = ({ children, ...props }) => {
  return (
    <Grid
      size={{ xs: 4 }}
      display="flex"
      alignItems="center"
      style={{
        wordBreak: "break-word",
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export default MailingListSectionCell;

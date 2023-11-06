import { Grid, GridProps } from "@mui/material";
import { FC, PropsWithChildren } from "react";

const MailingListSectionCell: FC<PropsWithChildren<GridProps>> = ({ children, ...props }) => {
  return (
    <Grid
      item
      xs={4}
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

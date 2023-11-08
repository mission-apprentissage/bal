import { Grid, GridProps } from "@mui/material";
import { FC, PropsWithChildren } from "react";

const InputGroupContainer: FC<PropsWithChildren<GridProps>> = ({ children, ...rest }) => {
  return (
    <Grid container spacing={2} pb={3} {...rest}>
      {children}
    </Grid>
  );
};

export default InputGroupContainer;

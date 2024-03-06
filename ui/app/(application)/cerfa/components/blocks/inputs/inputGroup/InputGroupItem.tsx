import { Grid, GridProps } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props extends GridProps {
  size: number;
}

const InputGroupItem: FC<PropsWithChildren<Props>> = ({ children, size, ...rest }) => {
  return (
    <Grid item sm={size} {...rest}>
      {children}
    </Grid>
  );
};

export default InputGroupItem;

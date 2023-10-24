import { Typography, TypographyProps } from "@mui/material";
import { FC } from "react";

const InputGroupTitle: FC<TypographyProps> = ({ children }) => (
  <Typography variant="h4" gutterBottom>
    {children}
  </Typography>
);

export default InputGroupTitle;

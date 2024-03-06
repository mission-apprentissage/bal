import { Typography, TypographyProps } from "@mui/material";
import { FC } from "react";

const InputGroupTitle: FC<TypographyProps> = ({ children }) => (
  <Typography variant="h4" mb="1.5rem" mt={2}>
    {children}
  </Typography>
);

export default InputGroupTitle;

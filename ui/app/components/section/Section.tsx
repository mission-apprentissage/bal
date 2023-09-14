import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface Props extends BoxProps {
  children: React.ReactNode;
}

const Section: FC<Props> = ({ children }) => {
  return <Box my={3}>{children}</Box>;
};

export default Section;

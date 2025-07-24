import type { BoxProps } from "@mui/material";
import { Box } from "@mui/material";
import type { FC } from "react";

interface Props extends BoxProps {
  children: React.ReactNode;
}

const Section: FC<Props> = ({ children }) => {
  return <Box my={3}>{children}</Box>;
};

export default Section;

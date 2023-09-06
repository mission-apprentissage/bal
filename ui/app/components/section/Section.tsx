import { Container, ContainerProps } from "@mui/material";
import { FC } from "react";

interface Props extends ContainerProps {
  children: React.ReactNode;
}

const Section: FC<Props> = ({ children }) => {
  return <Container maxWidth="xl">{children}</Container>;
};

export default Section;

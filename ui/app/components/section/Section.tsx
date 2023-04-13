import { Container, ContainerProps } from "@chakra-ui/react";
import { FC } from "react";

interface Props extends ContainerProps {
  children: React.ReactNode;
}

const Section: FC<Props> = ({ children, ...props }) => {
  return (
    <Container maxWidth={"container.xl"} {...props}>
      {children}
    </Container>
  );
};

export default Section;

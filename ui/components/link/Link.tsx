import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NavLink from "next/link";
import React, { FC } from "react";

interface Props extends LinkProps {
  shallow?: boolean;
}

const Link: FC<Props> = ({ children, shallow = false, ...rest }) => {
  return (
    <ChakraLink {...rest} as={NavLink} shallow={shallow}>
      {children}
    </ChakraLink>
  );
};

export default Link;

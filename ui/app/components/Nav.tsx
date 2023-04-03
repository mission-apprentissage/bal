"use client";
import { HStack } from "@chakra-ui/react";

import { NavLink } from "./NavLink";

export const Nav = () => {
  return (
    <HStack spacing={4}>
      <NavLink href="/" segment={null}>
        Accueil
      </NavLink>
    </HStack>
  );
};

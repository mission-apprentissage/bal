"use client";
import { HStack } from "@chakra-ui/react";

import { useAuth } from "../../context/AuthContext";
import { NavLink } from "./NavLink";

export const Nav = () => {
  const { user } = useAuth();
  return (
    <HStack spacing={4}>
      <NavLink href="/" segment={null}>
        Accueil
      </NavLink>
      {user && (
        <>
          <NavLink href="/usage" segment="usage">
            API
          </NavLink>
          <NavLink href="/liste-diffusion" segment="liste-diffusion">
            Liste de diffusion
          </NavLink>
        </>
      )}
    </HStack>
  );
};

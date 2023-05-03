"use client";
import { Container, HStack } from "@chakra-ui/react";

import { NavLink } from "../components/NavLink";

// TODO layout
const UsagePage = () => {
  return (
    <Container maxWidth={"container.xl"}>
      <HStack spacing={4}>
        <NavLink href="/usage/verification" segment="verification">
          Vérification
        </NavLink>
      </HStack>
    </Container>
  );
};

export default UsagePage;

"use client";

import { Heading } from "@chakra-ui/react";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import PersonList from "./components/PersonList";

const AdminPersonsPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminPersons()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Gestion des personnes
      </Heading>
      <PersonList />
    </>
  );
};

export default AdminPersonsPage;

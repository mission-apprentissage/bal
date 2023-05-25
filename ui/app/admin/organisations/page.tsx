"use client";

import { Heading } from "@chakra-ui/react";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import OrganisationList from "./components/OrganisationList";

const AdminOrganisationsPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminOrganisations()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Gestion des organisations
      </Heading>
      <OrganisationList />
    </>
  );
};

export default AdminOrganisationsPage;

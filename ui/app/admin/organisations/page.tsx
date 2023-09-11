"use client";

import { Typography } from "@mui/material";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import OrganisationList from "./components/OrganisationList";

const AdminOrganisationsPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminOrganisations()]} />
      <Typography variant="h2" gutterBottom>
        Gestion des organisations
      </Typography>
      <OrganisationList />
    </>
  );
};

export default AdminOrganisationsPage;

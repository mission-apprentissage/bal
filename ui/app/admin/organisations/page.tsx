"use client";

import { Typography } from "@mui/material";

import OrganisationList from "./components/OrganisationList";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

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

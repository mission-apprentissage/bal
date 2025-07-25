"use client";

import { Typography } from "@mui/material";

import PersonList from "./components/PersonList";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const AdminPersonsPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminPersons()]} />
      <Typography variant="h2" gutterBottom>
        Gestion des personnes
      </Typography>
      <PersonList />
    </>
  );
};

export default AdminPersonsPage;

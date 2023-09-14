"use client";

import { Typography } from "@mui/material";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import PersonList from "./components/PersonList";

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

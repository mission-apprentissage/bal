"use client";

import { Typography } from "@mui/material";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import UserList from "./components/UserList";

const AdminUsersPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.adminUsers()]} />
      <Typography variant="h2" gutterBottom>
        Gestion des utilisateurs
      </Typography>
      <UserList />
    </>
  );
};

export default AdminUsersPage;

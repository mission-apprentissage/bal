"use client";

import { Typography } from "@mui/material";

import UserList from "./components/UserList";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

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

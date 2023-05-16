"use client";

import { Heading } from "@chakra-ui/react";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import UserList from "./components/UserList";

const AdminUsersPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminUsers()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Gestion des utilisateurs
      </Heading>
      <UserList />
    </>
  );
};

export default AdminUsersPage;

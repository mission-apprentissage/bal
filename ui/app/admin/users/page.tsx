"use client";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";

const AdminUsersPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminUsers()]} />
    </>
  );
};

export default AdminUsersPage;

"use client";
import { Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import { useAuth } from "../../context/AuthContext";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user?.is_admin) {
    push("/auth/connexion");
    return null;
  }

  return <Container maxWidth="xl">{children}</Container>;
};

export default AdminLayout;

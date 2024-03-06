"use client";
import { Container } from "@mui/material";
import { useAuth } from "context/AuthContext";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const ProfilLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return <Container maxWidth="xl">{children}</Container>;
};

export default ProfilLayout;

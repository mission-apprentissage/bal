"use client";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import { useAuth } from "../../context/AuthContext";

const ProfilLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return <>{children}</>;
};

export default ProfilLayout;

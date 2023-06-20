"use client";
import { useRouter } from "next/navigation";
import React, { FC, PropsWithChildren } from "react";

import { useAuth } from "../../context/AuthContext";

const ListeDiffusionLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return <>{children}</>;
};

export default ListeDiffusionLayout;

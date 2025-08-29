"use client";

import type { PropsWithChildren } from "react";

import { ConnexionComponent } from "./ConnexionComponent";
import { useAuth } from "@/context/AuthContext";

export function LoggedUser({ children }: PropsWithChildren) {
  const { user } = useAuth();

  if (!user) {
    return <ConnexionComponent />;
  }

  return <>{children}</>;
}

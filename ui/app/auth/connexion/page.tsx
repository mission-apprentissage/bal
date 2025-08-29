"use client";

import { useRouter } from "next/navigation";
import { ConnexionComponent } from "@/components/connexion/ConnexionComponent";
import { useAuth } from "@/context/AuthContext";

const ConnexionPage = () => {
  const { push } = useRouter();
  const { user } = useAuth();

  if (user) {
    return push("/");
  }

  return <ConnexionComponent />;
};
export default ConnexionPage;

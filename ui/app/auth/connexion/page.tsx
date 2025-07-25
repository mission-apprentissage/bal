"use client";

import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { IBody, IPostRoutes } from "shared";
import type { IStatus } from "shared/routes/auth.routes";

import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import FormContainer from "@/app/auth/components/FormContainer";

type Route = IPostRoutes["/auth/login"];

const ConnexionPage = () => {
  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState<IStatus>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBody<Route>>();

  const onSubmit: SubmitHandler<IBody<Route>> = async (data) => {
    try {
      setUser(await apiPost("/auth/login", { body: data }));
    } catch (error) {
      const errorMessage = (error as Record<string, string>)?.message;

      setStatus({
        error: true,
        message: errorMessage ?? "Impossible de se connecter.",
      });

      console.error(error);
    }
  };

  if (user) {
    return push("/");
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.connexion()]} />
      <FormContainer>
        <Typography variant="h2" gutterBottom>
          Connectez-vous
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email (votre identifiant)"
            state={errors.email ? "error" : "default"}
            stateRelatedMessage={errors.email?.message}
            nativeInputProps={{
              placeholder: "prenom.nom@courriel.fr",
              ...register("email", { required: "Email obligatoire" }),
            }}
          />
          <PasswordInput
            label="Mot de passe"
            messagesHint="Mot de passe incorrect"
            messages={
              errors.password?.message
                ? [
                    {
                      message: errors.password?.message,
                      severity: "error",
                    },
                  ]
                : []
            }
            nativeInputProps={{
              placeholder: "****************",
              ...register("password", {
                required: "Mot de passe obligatoire",
              }),
            }}
          />
          {status?.message && <Alert description={status.message} severity="error" small />}
          <Box mt={2}>
            <Button type="submit">Connexion</Button>
            <Button
              linkProps={{
                href: PAGES.motDePasseOublie().path,
              }}
              priority="tertiary no outline"
            >
              Mot de passe oublié
            </Button>
          </Box>
        </form>
      </FormContainer>
    </>
  );
};
export default ConnexionPage;

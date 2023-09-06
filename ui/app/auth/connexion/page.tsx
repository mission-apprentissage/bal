"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Box, styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IBody, IPostRoutes } from "shared";
import { IStatus } from "shared/routes/auth.routes";

import { useAuth } from "../../../context/AuthContext";
import { apiPost } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";

type Route = IPostRoutes["/auth/login"];

const StyledBox = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: "1px solid",
  borderColor: fr.colors.decisions.border.actionLow.blueFrance.default,

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

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
      <StyledBox>
        <Typography variant="h2" gutterBottom>
          Connectez-vous
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            hintText=""
            label="Email (votre identifiant)"
            state={errors.email ? "error" : "default"}
            stateRelatedMessage={errors.email?.message}
            nativeInputProps={{
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
              ...register("password", {
                required: "Mot de passe obligatoire",
              }),
            }}
          />
          {status?.message && (
            <Alert description={status.message} severity="error" small />
          )}
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
      </StyledBox>
    </>
  );
};
export default ConnexionPage;

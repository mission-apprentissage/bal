"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IBody, IPostRoutes, IResponse } from "shared";

import { apiPost } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import ViewData from "../components/ViewData";

type Route = IPostRoutes["/v1/organisation/validation"];
type Req = IBody<Route>;
type Res = IResponse<Route>;

const UsageVerificationPage = () => {
  const [requestData, setRequestData] = useState<Req>();
  const [responseData, setResponseData] = useState<Res | Error>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Req>();

  const onSubmit = async (body: Req) => {
    try {
      setRequestData(body);
      const data = await apiPost("/v1/organisation/validation", {
        body,
        headers: { Authorization: "" },
      });

      setResponseData(data);
    } catch (error) {
      if (error instanceof Error) {
        setResponseData(error);
      }

      console.error(error);
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.usageApi(), PAGES.usageApiValidation()]} />

      <Typography variant="h2" gutterBottom>
        Tester l'API
      </Typography>
      <Typography variant="h4" gutterBottom>
        POST api/v1/organisation/validation
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          state={errors.email ? "error" : "default"}
          stateRelatedMessage={errors.email?.message}
          nativeInputProps={{
            placeholder: "prenom.nom@courriel.fr",
            ...register("email", { required: "Email obligatoire" }),
          }}
        />
        <Input
          label="Un SIRET au format valide est composé de 14 chiffres"
          state={errors.email ? "error" : "default"}
          stateRelatedMessage={errors.siret?.message}
          nativeInputProps={{
            placeholder: "98765432400019",
            ...register("siret", { required: "SIRET obligatoire" }),
          }}
        />

        <Box mb={2}>
          <Button type="submit">Envoyer</Button>
        </Box>

        <ViewData title="Requête" data={requestData} />
        <ViewData title="Réponse" data={responseData} />
      </form>
    </>
  );
};

export default UsageVerificationPage;

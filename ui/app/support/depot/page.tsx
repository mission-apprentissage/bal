"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Upload as DSFRUpload } from "@codegouvfr/react-dsfr/Upload";
import { Box, styled, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IPostRoutes } from "shared";

import Toast, { useToast } from "../../../components/toast/Toast";
import { apiPost } from "../../../utils/api.utils";

interface FormValues extends Zod.input<IPostRoutes["/admin/upload"]["querystring"]> {
  file: FileList;
  email: string;
  verified_key: string;
}

const FormContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

const SupportDepotPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      verified_key: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ email, verified_key, file }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file[0]);

      await apiPost("/support/upload", {
        querystring: {
          email,
          verified_key,
        },
        body: formData,
      });

      setToast({
        severity: "success",
        message: "Fichier importé avec succès",
      });
      reset();
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        setError("file", { message });
      } else {
        setToast({ severity: "error", message: "Une erreur s'est produite pendant le téléversement du fichier." });
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h2">Déposer un fichier</Typography>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            state={errors.email ? "error" : "default"}
            stateRelatedMessage={errors.email?.message}
            nativeInputProps={{
              placeholder: "exemple: prenom.nom@courriel.fr",
              ...register("email", { required: "Email obligatoire" }),
            }}
          />

          <Input
            label="Clé de vérification"
            disabled={isSubmitting}
            state={errors.verified_key ? "error" : "default"}
            stateRelatedMessage={errors.verified_key?.message}
            nativeInputProps={{
              placeholder: "exemple: mp5HYffCRyeR4FhyuLvei4BbfmxOPd5c",
              ...register("verified_key", {
                required: "Veuillez saisir votre clé de vérification",
              }),
            }}
          />

          <Box mb={2}>
            <DSFRUpload
              hint="(.xlsx, .xls, .csv, maximum 100mb)"
              disabled={isSubmitting}
              state={errors.file ? "error" : "default"}
              stateRelatedMessage={errors.file?.message}
              nativeInputProps={{
                accept: ".csv, .xlsx, .xls",
                ...register("file", {
                  required: "Obligatoire: Vous devez ajouter un fichier à importer",
                  validate: {
                    notEmpty: (value) => {
                      return (value && value.length > 0) || "Obligatoire: Vous devez ajouter un fichier à importer";
                    },
                    extension: (value) => {
                      return (
                        value[0]?.name?.endsWith(".csv") ||
                        value[0]?.name?.endsWith(".xlsx") ||
                        value[0]?.name?.endsWith(".xls") ||
                        "Le fichier doit être au format .csv"
                      );
                    },
                  },
                }),
              }}
            />
          </Box>

          <Box my={4}>
            <Button type="submit" disabled={isSubmitting}>
              Importer le fichier
            </Button>
          </Box>
        </form>
        <Toast
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          severity={toast?.severity}
          message={toast?.message}
          handleClose={handleClose}
        />
      </FormContainer>
    </Box>
  );
};
export default SupportDepotPage;

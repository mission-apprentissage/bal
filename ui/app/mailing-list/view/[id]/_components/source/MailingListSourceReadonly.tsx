"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Box, styled } from "@mui/material";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { fr } from "@codegouvfr/react-dsfr";
import type { IUserPublic } from "shared/models/user.model";
import { MailingListResetSource } from "./MailingListResetSource";
import { queryClient } from "@/utils/query.utils";
import Toast, { useToast } from "@/components/toast/Toast";
import { apiPut, generateUrl } from "@/utils/api.utils";

const FormContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

const DELIMITER_OPTIONS = [
  { value: ";", label: "point-virgule ( ; )" },
  { value: ",", label: "virgule ( , )" },
  { value: "|", label: "barre verticale ( | )" },
];

interface FormValues {
  name: string;
}

export function MailingListSourceReadonly(props: { mailingList: IMailingListV2Json; user: IUserPublic }) {
  const { toast, setToast, handleClose } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      name: props.mailingList.name,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ name }) => {
    setIsSubmitting(true);
    try {
      if (!name || name.trim() === "") {
        setError("name", { message: "Veuillez saisir le nom de votre liste de diffusion." });
        return;
      }

      await apiPut("/_private/mailing-list/:id/name", {
        params: { id: props.mailingList._id },
        body: {
          name,
        },
      });

      setToast({
        severity: "success",
        message: "Liste de diffusion renommée avec succès.",
      });
    } catch (error) {
      setToast({ severity: "error", message: "Une erreur s'est produite lors du renommage de la liste de diffusion." });
      captureException(error);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"] });
    }
  };

  return (
    <>
      <MailingListResetSource mailingList={props.mailingList} />
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <a
              className={fr.cx("fr-link", "fr-link--icon-left", "fr-icon-download-line")}
              href={generateUrl(`/_private/mailing-list/:id/source/download`, {
                params: { id: props.mailingList._id },
              })}
              download
            >
              Télécharger le fichier source
            </a>
          </Box>

          <Input
            label="Nom de votre liste de diffusion"
            disabled={isSubmitting}
            state={errors.name ? "error" : "default"}
            addon={
              <Button
                iconId="fr-icon-pencil-line"
                disabled={isSubmitting}
                priority="secondary"
                title="Renommer"
                type="submit"
              />
            }
            nativeInputProps={{
              ...register("name", {
                required: "Veuillez saisir le nom de votre liste de diffusion",
              }),
            }}
          />

          <Input
            label="Importé par"
            disabled
            nativeInputProps={{
              value: props.user.email,
              readOnly: true,
              type: "text",
            }}
          />

          <Input
            label="Date d'import"
            disabled
            nativeInputProps={{
              value: props.mailingList.created_at.substring(0, 16), // Keep up to minutes
              readOnly: true,
              type: "datetime-local",
            }}
          />
          <Input
            label="Date de suppression automatique"
            disabled
            nativeInputProps={{
              value: props.mailingList.ttl.substring(0, 16), // Keep up to minutes
              readOnly: true,
              type: "datetime-local",
            }}
          />
          <Input
            label="Séparateur"
            disabled
            nativeInputProps={{
              value:
                DELIMITER_OPTIONS.find((d) => d.value === props.mailingList.source.file.delimiter)?.label ?? "Inconnu",
              readOnly: true,
            }}
          />
        </form>
        <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
      </FormContainer>
    </>
  );
}

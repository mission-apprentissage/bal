"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, styled } from "@mui/material";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
import { fr } from "@codegouvfr/react-dsfr";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { differenceInDays } from "date-fns";
import type { IUserPublic } from "shared/models/user.model";
import Toast, { useToast } from "@/components/toast/Toast";
import { apiPut, generateUrl } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";

interface FormValues {
  name: string | null;
  delimiter: string;
  expiresInDays: number;
}

const FormContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

export function MailingListEditSourceForm(props: { mailingList: IMailingListV2Json; user: IUserPublic }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      name: props.mailingList.name,
      delimiter: props.mailingList.source.file.delimiter,
      expiresInDays: differenceInDays(props.mailingList.ttl, new Date()),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ delimiter, name, expiresInDays }) => {
    setIsSubmitting(true);
    try {
      if (!name || name.trim() === "") {
        setError("name", { message: "Veuillez saisir le nom de votre liste de diffusion." });
        return;
      }

      await apiPut("/_private/mailing-list/:id/source", {
        params: { id: props.mailingList._id },
        body: {
          name,
          delimiter,
          expiresInDays: parseInt(expiresInDays.toString(), 10),
        },
      });

      setToast({
        severity: "success",
        message: "Liste de diffusion mise à jour avec succès.",
      });
    } catch (error) {
      setToast({ severity: "error", message: "Une erreur s'est produite pendant la mise à jour." });
      captureException(error);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"] });
    }
  };

  return (
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
          stateRelatedMessage={errors.name?.message}
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
          label="Durée de conservation (en jours)"
          disabled={isSubmitting}
          state={errors.name ? "error" : "default"}
          stateRelatedMessage={errors.name?.message}
          nativeInputProps={{
            ...register("expiresInDays"),
            inputMode: "numeric",
            pattern: "[0-9]*",
            type: "number",
            min: 1,
            max: 365,
          }}
        />
        <Select
          label="Séparateur"
          disabled={isSubmitting}
          state={errors.delimiter ? "error" : "default"}
          stateRelatedMessage={errors.delimiter?.message}
          nativeSelectProps={{
            ...register("delimiter", {
              required: "Obligatoire",
            }),
          }}
        >
          <option value=";">point-virgule ( ; )</option>
          <option value=",">virgule ( , )</option>
          <option value="|">barre verticale ( | )</option>
        </Select>

        <Box my={4}>
          <Button type="submit" disabled={isSubmitting}>
            Extraire le fichier
          </Button>
        </Box>
      </form>
      <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
    </FormContainer>
  );
}

"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Upload as DSFRUpload } from "@codegouvfr/react-dsfr/Upload";
import { Box, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
import { formatDate } from "date-fns";
import Toast, { useToast } from "@/components/toast/Toast";
import { apiPost } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";
import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

interface FormValues {
  name: string | null;
  delimiter: string;
  file: FileList | null;
  expiresInDays: number;
}

const FormContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

export function MailingListCreateSource() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: null,
      delimiter: ";",
      file: null,
      expiresInDays: 30,
    },
  });

  const fileName = watch("file")?.[0]?.name ?? null;
  const name = watch("name");

  useEffect(() => {
    if (fileName && name === null) {
      setValue(
        "name",
        `${formatDate(new Date(), "yyyyMMdd")}_${fileName.replaceAll(/\s/g, "_").replace(/\.csv$/, "")}`
      );
    }
  }, [fileName, name, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async ({ file, delimiter, name, expiresInDays }) => {
    setIsSubmitting(true);
    try {
      if (!file || file.length === 0) {
        setError("file", { message: "Vous devez ajouter un fichier à importer." });
        return;
      }

      if (!name || name.trim() === "") {
        setError("name", { message: "Veuillez saisir le nom de votre liste de diffusion." });
        return;
      }

      const formData = new FormData();
      formData.append("file", file[0]);

      const { _id } = await apiPost("/_private/mailing-list", {
        querystring: {
          name,
          delimiter,
          expiresInDays: expiresInDays.toString(),
        },
        body: formData,
      });

      setToast({
        severity: "success",
        message: "Fichier importé avec succès.",
      });

      router.push(PAGES.mailingListView(_id).path);
    } catch (error) {
      if (error instanceof Error) {
        const { message } = error;
        setError("file", { message });
      }

      setToast({
        severity: "error",
        message: "Une erreur s'est produite pendant le téléversement du fichier.",
      });
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
          <DSFRUpload
            hint="Taille maximale: 2 Go. Formats supportés: csv"
            label="Ajouter le fichier à importer"
            disabled={isSubmitting}
            state={errors.file ? "error" : "default"}
            stateRelatedMessage={errors.file?.message}
            nativeInputProps={{
              accept: ".csv, text/csv",
              ...register("file", {
                required: "Obligatoire: Vous devez ajouter un fichier à importer",
                validate: {
                  notEmpty: (value) => {
                    return (value && value.length > 0) || "Obligatoire: Vous devez ajouter un fichier à importer";
                  },
                  extension: (value) => {
                    return value?.[0]?.name?.endsWith(".csv") || "Le fichier doit être au format .csv";
                  },
                },
              }),
            }}
          />
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
            Importer le fichier
          </Button>
        </Box>
      </form>
      <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
    </FormContainer>
  );
}

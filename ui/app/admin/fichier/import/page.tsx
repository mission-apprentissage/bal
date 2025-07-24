"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Upload as DSFRUpload } from "@codegouvfr/react-dsfr/Upload";
import { Box, styled, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { IGetRoutes, IPostRoutes, IResponse } from "shared";

import ToggleSwitchInput from "@/components/form/ToggleSwitchInput";
import Toast, { useToast } from "@/components/toast/Toast";
import { apiGet, apiPost } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { z } from "zod";

interface FormValues extends z.input<IPostRoutes["/admin/upload"]["querystring"]> {
  file: FileList;
  has_new_type_document: boolean;
  new_type_document: string;
  delimiter_other: string;
}

const FormContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));

const AdminImportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const router = useRouter();

  const { data: types = [] } = useQuery<IResponse<IGetRoutes["/admin/documents/types"]>>({
    queryKey: ["documentTypes"],
    queryFn: async () => apiGet("/admin/documents/types", {}),
    throwOnError: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    control,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      type_document: "",
      has_new_type_document: false,
    },
  });

  const hasNewTypeDocument = watch("has_new_type_document");
  const delimiter = watch("delimiter");
  const askDelimiterOther = delimiter === "other";

  const onSubmit: SubmitHandler<FormValues> = async ({
    file,
    type_document,
    has_new_type_document,
    new_type_document,
    delimiter,
    delimiter_other,
  }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file[0]);

      await apiPost("/admin/upload", {
        querystring: {
          type_document: has_new_type_document ? new_type_document : type_document,
          delimiter: askDelimiterOther ? delimiter_other : delimiter,
        },
        body: formData,
      });

      setToast({
        severity: "success",
        message: "Fichier importé avec succès.",
      });
      router.push(PAGES.adminFichier().path);
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
      clearErrors();
      queryClient.invalidateQueries({ queryKey: ["/admin/documents"] });
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.adminFichier(), PAGES.adminImport()]} />
      <Typography variant="h2">Importer un fichier</Typography>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Type de document"
            disabled={hasNewTypeDocument || isSubmitting}
            state={errors.type_document ? "error" : "default"}
            stateRelatedMessage={errors.type_document?.message}
            nativeSelectProps={{
              ...register("type_document", {
                required: !hasNewTypeDocument && "Obligatoire",
              }),
            }}
          >
            <option value="" disabled hidden>
              Choisir un type de document
            </option>
            {types?.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </Select>

          <ToggleSwitchInput
            control={control}
            {...register("has_new_type_document")}
            toggleSwitchProps={{
              showCheckedHint: false,
              disabled: isSubmitting,
              label: "Je souhaite ajouter un nouveau type de document",
              inputTitle: "Je souhaite ajouter un nouveau type de document",
            }}
          />

          {hasNewTypeDocument && (
            <Input
              label="Nom de votre type de document"
              disabled={isSubmitting}
              state={errors.new_type_document ? "error" : "default"}
              stateRelatedMessage={errors.new_type_document?.message}
              nativeInputProps={{
                placeholder: "Source de données",
                ...register("new_type_document", {
                  required: "Veuillez saisir le nom de votre type de document",
                  validate: {
                    regex: (value) => {
                      if (!/^[A-Za-z0-9 _-]*$/.test(value)) {
                        return "Le nom doit contenir uniquement lettres, chiffres, tirets (-) et underscores (_), sans espaces.";
                      }
                    },
                  },
                }),
              }}
            />
          )}

          <Box mb={2}>
            <DSFRUpload
              hint="(.csv, maximum 100MB, nom du fichier sans accent ni espace (séparateurs - ou _ admis))"
              disabled={isSubmitting}
              state={errors.file ? "error" : "default"}
              stateRelatedMessage={errors.file?.message}
              nativeInputProps={{
                accept: ".csv, text/csv",
                ...register("file", {
                  required: "Obligatoire: Vous devez ajouter un fichier à importer",
                  validate: {
                    regex: (value) => {
                      const fileName = value[0].name;
                      if (!/^[A-Za-z0-9 _-]+\.csv$/.test(fileName)) {
                        return "Le nom du fichier doit contenir uniquement lettres, chiffres, tirets (-) et underscores (_), sans espaces.";
                      }
                    },
                    notEmpty: (value) => {
                      return (value && value.length > 0) || "Obligatoire: Vous devez ajouter un fichier à importer";
                    },
                    extension: (value) => {
                      return value[0]?.name?.endsWith(".csv") || "Le fichier doit être au format .csv";
                    },
                  },
                }),
              }}
            />
          </Box>

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
            <option value="other">autre</option>
          </Select>

          {askDelimiterOther && (
            <Input
              label="Séparateur personnalisé"
              disabled={isSubmitting}
              state={errors.delimiter_other ? "error" : "default"}
              stateRelatedMessage={errors.delimiter_other?.message}
              nativeInputProps={{
                placeholder: "Séparateur personnalisé",
                ...register("delimiter_other", {
                  required: askDelimiterOther && "Obligatoire",
                }),
              }}
            />
          )}

          <Box my={4}>
            <Button type="submit" disabled={isSubmitting}>
              Importer le fichier
            </Button>
          </Box>
        </form>
        <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
      </FormContainer>
    </>
  );
};
export default AdminImportPage;

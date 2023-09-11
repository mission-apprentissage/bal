"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { Upload as DSFRUpload } from "@codegouvfr/react-dsfr/Upload";
import { Box, styled, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IGetRoutes, IPostRoutes, IResponse } from "shared";

import ToggleSwitchInput from "../../../../components/form/ToggleSwitchInput";
import Toast, { useToast } from "../../../../components/toast/Toast";
import { apiGet, apiPost } from "../../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../../components/breadcrumb/Breadcrumb";

interface FormValues
  extends Zod.input<IPostRoutes["/admin/upload"]["querystring"]> {
  file: FileList;
  should_import_content: boolean;
  has_new_type_document: boolean;
  new_type_document: string;
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
  const { toast, setToast } = useToast();

  const router = useRouter();

  const { data: types = [] } = useQuery<IResponse<IGetRoutes["/admin/documents/types"]>>({
    queryKey: ["documentTypes"],
    queryFn: async () => apiGet("/admin/documents/types", {}),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },

    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      type_document: "",
      should_import_content: true,
      has_new_type_document: false,
    },
  });

  const hasNewTypeDocument = watch("has_new_type_document");

  const onSubmit: SubmitHandler<FormValues> = async ({
    file,
    type_document,
    has_new_type_document,
    new_type_document,
    should_import_content,
  }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file[0]);

      await apiPost("/admin/upload", {
        querystring: {
          type_document: has_new_type_document ? new_type_document : type_document,
          ...(should_import_content && { import_content: "true" }),
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
        setToast({ severity: "error", message: error.message });
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
                }),
              }}
            />
          )}
          <ToggleSwitchInput
            control={control}
            {...register("should_import_content")}
            toggleSwitchProps={{
              showCheckedHint: false,
              disabled: isSubmitting,
              label: "Importer le contenu",
              inputTitle: "Importer le contenu",
            }}
          />

          <DSFRUpload
            hint="(.csv, maximum 100mb)"
            disabled={isSubmitting}
            state={errors.file ? "error" : "default"}
            stateRelatedMessage={errors.file?.message}
            nativeInputProps={{
              accept:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,application/vnd.ms-excel,.xls,.csv, text/csv",
              ...register("file", {
                required:
                  "Obligatoire: Vous devez ajouter un fichier à importer",
                validate: {
                  notEmpty: (value) => {
                    return (
                      (value && value.length > 0) ||
                      "Obligatoire: Vous devez ajouter un fichier à importer"
                    );
                  },
                },
              }),
            }}
          />

          <Box my={4}>
            <Button type="submit" disabled={isSubmitting}>
              Importer le fichier
            </Button>
          </Box>
        </form>
        <Toast severity={toast?.severity} message={toast?.message} />
      </FormContainer>
    </>
  );
};
export default AdminImportPage;

"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IGetRoutes, IPostRoutes, IResponse } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";

// import { AlertRounded } from "../../../../theme/icons/AlertRounded";
import { apiGet, apiPost } from "../../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../../components/breadcrumb/Breadcrumb";
import useToaster from "../../../components/hooks/useToaster";
import { Dropzone } from "./components/Dropzone";

interface FormValues
  extends Zod.input<IPostRoutes["/admin/upload"]["querystring"]> {
  file: File;
  has_new_type_document: boolean;
  new_type_document: string;
}

const AdminImportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const router = useRouter();

  const { data: types = [] } = useQuery<
    IResponse<IGetRoutes["/admin/documents/types"]>
  >({
    queryKey: ["documentTypes"],
    queryFn: async () => apiGet("/admin/documents/types", {}),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>();

  const hasNewTypeDocument = watch("has_new_type_document");

  const onSubmit: SubmitHandler<FormValues> = async ({
    file,
    type_document,
    has_new_type_document,
    new_type_document,
  }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiPost("/admin/upload", {
        querystring: {
          type_document: has_new_type_document
            ? new_type_document
            : type_document,
        },
        body: formData,
      });
      toastSuccess("Fichier importé avec succès.");
      router.push(PAGES.adminFichier().path);
    } catch (error) {
      if (error instanceof Error) {
        toastError(error.message);
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb
        pages={[PAGES.homepage(), PAGES.adminFichier(), PAGES.adminImport()]}
      />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "65%" }}
        h="100%"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Importer un fichier
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl
              isInvalid={!!errors.type_document}
              mb={5}
              isDisabled={hasNewTypeDocument || isSubmitting}
            >
              <FormLabel>Type de document</FormLabel>
              <Select
                isInvalid={!!errors.type_document}
                placeholder="Choisir un type de document"
                {...register("type_document", {
                  required: !hasNewTypeDocument,
                })}
              >
                {types?.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              <FormErrorMessage>
                Obligatoire: Vous devez choisir le type de fichier que vous
                souhaitez importer
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={5} isDisabled={isSubmitting}>
              <Checkbox {...register("has_new_type_document")}>
                Je souhaite ajouter un nouveau type de document
              </Checkbox>
            </FormControl>

            {hasNewTypeDocument && (
              <FormControl
                isInvalid={!!errors.new_type_document}
                mb={5}
                isDisabled={isSubmitting}
              >
                <FormLabel>Nom de votre type de document</FormLabel>
                <Input
                  placeholder="Source de données"
                  {...register("new_type_document", {
                    required:
                      "Obligatoire: Veuillez saisir le nom de votre type de document",
                  })}
                />
                <FormErrorMessage>
                  {errors.new_type_document?.message}
                </FormErrorMessage>
              </FormControl>
            )}

            <FormControl
              isInvalid={!!errors.file}
              mb={5}
              isDisabled={isSubmitting}
            >
              <FormLabel>Fichier</FormLabel>
              <Input
                {...register("file", {
                  required:
                    "Obligatoire: Vous devez ajouter un fichier à importer",
                })}
                hidden
              />
              <Dropzone
                options={{
                  maxFiles: 1,
                  onDrop: (files) => {
                    setValue("file", files[0]);
                  },
                  onDropRejected: () => {
                    console.log("rejected");
                  },
                  accept: {
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      [".xlsx"],
                    "application/vnd.ms-excel": [".xls", ".csv"],
                    "text/csv": [".csv"],
                  },
                  maxSize: FILE_SIZE_LIMIT,
                }}
                isDisabled={isSubmitting}
              />
              <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
            </FormControl>
          </Box>
          <HStack spacing="4w" mt={8}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              loadingText="En cours d'import"
            >
              Importer le fichier
            </Button>
          </HStack>
        </form>
      </Flex>
    </>
  );
};
export default AdminImportPage;

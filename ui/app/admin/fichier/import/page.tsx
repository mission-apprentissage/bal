"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// import { AlertRounded } from "../../../../theme/icons/AlertRounded";
import { api } from "../../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../../components/breadcrumb/Breadcrumb";
import useToaster from "../../../components/hooks/useToaster";
import { FILE_SIZE_LIMIT } from "shared/constants/index";
import { IResError } from "shared/routes/common.routes";
import {
  DOCUMENT_TYPES,
  IReqQueryPostAdminUpload,
} from "shared/routes/upload.routes";
import { Dropzone } from "./components/Dropzone";

interface FormValues extends IReqQueryPostAdminUpload {
  file: File;
}

const AdminImportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({
    file,
    type_document,
  }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/admin/upload", formData, {
        params: { type_document },
      });
      toastSuccess("Fichier importé avec succès.");
      router.push(PAGES.adminFichier().path);
    } catch (error) {
      const axiosError = error as AxiosError<IResError>;
      toastError(axiosError.response?.data.message);
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
              isDisabled={isSubmitting}
            >
              <FormLabel>Type de document</FormLabel>
              <Select
                isInvalid={!!errors.type_document}
                placeholder="Choisir un type de document"
                {...register("type_document", {
                  required:
                    "Obligatoire: Vous devez choisir le type de fichier que vous souhaitez importer",
                  validate: (value) => {
                    return (
                      value && Object.values(DOCUMENT_TYPES).includes(value)
                    );
                  },
                })}
              >
                {Object.values(DOCUMENT_TYPES).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.type_document?.message}
              </FormErrorMessage>
            </FormControl>

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

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
  Text,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FILE_SIZE_LIMIT } from "../../../../shared/constants";
import { IStatus } from "../../../../shared/routes/auth.routes";
import { IResError } from "../../../../shared/routes/common.routes";
import {
  IReqQueryPostAdminUpload,
  UPLOAD_TYPES,
} from "../../../../shared/routes/upload.routes";
import { AlertRounded } from "../../../theme/icons/AlertRounded";
import { api } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import { Dropzone } from "./components/Dropzone";

interface FormValues extends IReqQueryPostAdminUpload {
  file: File;
}

const AdminImportPage = () => {
  const [status, setStatus] = useState<IStatus>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file);

      await api.post("/admin/upload", formData, {
        params: { type: data.type_document },
      });

      setStatus({ error: false, message: "Fichier importé avec succès." });
    } catch (error) {
      const axiosError = error as AxiosError<IResError>;
      setStatus({ error: true, message: axiosError.response?.data.message });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminImport()]} />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "50%" }}
        h="100%"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Importer un fichier
        </Heading>

        {status?.message && !status.error ? (
          <Text>{status.message}</Text>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <FormControl isInvalid={!!errors.type_document} mb={5}>
                <FormLabel>Type de document</FormLabel>
                <Select
                  isInvalid={!!errors.type_document}
                  placeholder="Choisir un type de document"
                  {...register("type_document", {
                    required: "Obligatoire",
                    validate: (value) => {
                      return value && UPLOAD_TYPES.includes(value);
                    },
                  })}
                >
                  {UPLOAD_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.type_document?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.file} mb={5}>
                <FormLabel>Fichier</FormLabel>
                <Input
                  {...register("file", {
                    required: "Obligatoire",
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
                  isLoading={isSubmitting}
                />
                <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
              </FormControl>

              {status?.error && (
                <Text color="error" mt={8}>
                  <AlertRounded mb="0.5" /> {status?.message}
                </Text>
              )}
            </Box>
            <HStack spacing="4w" mt={8}>
              <Button variant="primary" type="submit">
                Envoyer
              </Button>
            </HStack>
          </form>
        )}
      </Flex>
    </>
  );
};
export default AdminImportPage;

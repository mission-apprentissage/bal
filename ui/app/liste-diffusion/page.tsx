"use client";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { DOCUMENT_TYPES } from "../../../shared/routes/upload.routes";
import { IReqGetMailingList } from "../../../shared/routes/v1/mailingList.routes";
import { api } from "../../utils/api.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";

const ListeDiffusionPage = () => {
  const toast = useToast();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<IReqGetMailingList>();

  const onSubmit = async (data: IReqGetMailingList) => {
    await api.post("/v1/mailing-list", { source: data.source });

    toast({
      title:
        "La liste de diffusion est en cours de génération. Vous pouvez revenir sur cette page dans quelques minutes.",
      status: "success",
      duration: 10000,
      isClosable: true,
    });
  };

  console.log(errors);
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.listeDiffusion()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Liste de diffusion
      </Heading>

      <Box w={{ base: "100%", md: "50%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl
              isInvalid={!!errors.source}
              mb={5}
              isDisabled={isSubmitting}
            >
              <FormLabel>Source</FormLabel>
              <Select
                isInvalid={!!errors.source}
                placeholder="Choisir la source"
                {...register("source", {
                  required: "Obligatoire: Vous devez choisir la source",
                  validate: (value) => {
                    console.log({
                      value,
                      in: Object.values(DOCUMENT_TYPES).includes(value),
                      DOCUMENT_TYPES,
                    });
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
              <FormErrorMessage>{errors.source?.message}</FormErrorMessage>
            </FormControl>
          </Box>

          <HStack spacing="4w" mt={8}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Générer la liste
            </Button>
          </HStack>
        </form>
      </Box>
    </>
  );
};

export default ListeDiffusionPage;

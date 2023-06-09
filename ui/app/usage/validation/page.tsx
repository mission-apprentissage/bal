"use client";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IReqPostOrganisationValidation,
  IResOrganisationValidation,
} from "shared/routes/v1/organisation.routes";

import { api } from "../../../utils/api.utils";

const UsageVerificationPage = () => {
  const [requestData, setRequestData] =
    useState<IReqPostOrganisationValidation>();
  const [responseData, setResponseData] =
    useState<IResOrganisationValidation>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReqPostOrganisationValidation>();

  const onSubmit = async (data: IReqPostOrganisationValidation) => {
    try {
      setRequestData(data);
      const response = await api.post("/v1/organisation/validation", data);

      setResponseData(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<IResOrganisationValidation>;
      setResponseData(axiosError.response?.data);
      console.error(error);
    }
  };

  return (
    <>
      <Heading as="h3" fontSize="lg" mb={[3, 6]}>
        POST api/v1/organisation/validation
      </Heading>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.email} mb={5}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="prenom.nom@courriel.fr"
              {...register("email", { required: "Email obligatoire" })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.siret} mb={5}>
            <FormLabel>
              Un SIRET au format valide est composé de 14 chiffres
            </FormLabel>
            <InputGroup size="md">
              <Input
                placeholder="98765432400019"
                {...register("siret", {
                  required: "Siret obligatoire",
                })}
              />
            </InputGroup>

            <FormErrorMessage>
              <>{errors.siret?.message}</>
            </FormErrorMessage>
          </FormControl>

          <Button variant="primary" type="submit">
            Envoyer
          </Button>

          {requestData && (
            <Box mt={4}>
              <Heading size="sm" mb={2}>
                Requête
              </Heading>
              <Box mt={2} p={2} bgColor="grey.975">
                <pre>
                  <p>{JSON.stringify(requestData, null, "\t")}</p>
                </pre>
              </Box>
            </Box>
          )}
          {responseData && (
            <Box mt={4}>
              <Heading size="sm" mb={2}>
                Réponse
              </Heading>
              <Box mt={2} p={2} bgColor="grey.975">
                <pre>
                  <p>{JSON.stringify(responseData, null, "\t")}</p>
                </pre>
              </Box>
            </Box>
          )}
        </form>
      </Box>
    </>
  );
};

export default UsageVerificationPage;

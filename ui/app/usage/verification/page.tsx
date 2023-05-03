"use client";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { IReqPostOrganisationValidation } from "../../../../shared/routes/v1/organisation.routes";
import { api } from "../../../utils/api.utils";

const UsageVerificationPage = () => {
  const [responseData, setResponseData] =
    useState<IReqPostOrganisationValidation>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReqPostOrganisationValidation>();

  const onSubmit = async (data: IReqPostOrganisationValidation) => {
    try {
      const response = await api.post("/v1/organisation/validation", data);

      setResponseData(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<IReqPostOrganisationValidation>;
      setResponseData(axiosError.response?.data);
      console.error(error);
    }
  };

  return (
    <>
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
            <FormLabel>Siret</FormLabel>
            <InputGroup size="md">
              <Input
                placeholder="1234567891234"
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

          {responseData && (
            <Box mt={4} p={2} bgColor="grey.100">
              <pre>
                <p>{JSON.stringify(responseData, null, "\t")}</p>
              </pre>
            </Box>
          )}
        </form>
      </Box>
    </>
  );
};

export default UsageVerificationPage;

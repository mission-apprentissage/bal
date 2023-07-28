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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IBody, IPostRoutes, IResponse } from "shared";

import { apiPost } from "../../../utils/api.utils";

type Route = IPostRoutes["/v1/organisation/validation"];
type Req = IBody<Route>;
type Res = IResponse<Route>;

const UsageVerificationPage = () => {
  const [requestData, setRequestData] = useState<Req>();
  const [responseData, setResponseData] = useState<Res | Error>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Req>();

  const onSubmit = async (body: Req) => {
    try {
      setRequestData(body);
      const data = await apiPost("/v1/organisation/validation", {
        body,
        headers: { Authorization: "" },
      });

      setResponseData(data);
    } catch (error) {
      if (error instanceof Error) {
        setResponseData(error);
      }

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

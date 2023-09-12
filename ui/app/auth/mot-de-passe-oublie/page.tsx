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
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IGetRoutes, IQuery } from "shared";
import { IStatus } from "shared/routes/auth.routes";

import Link from "../../../components/link/Link";
import { apiGet } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import { NavLink } from "../../components/NavLink";

type Route = IGetRoutes["/auth/reset-password"];

const MotDePasseOubliePage = () => {
  const [status, setStatus] = useState<IStatus>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IQuery<Route>>();

  const onSubmit: SubmitHandler<IQuery<Route>> = async (data) => {
    try {
      await apiGet("/auth/reset-password", {
        querystring: data,
      });

      setStatus({
        error: false,
        message: "Vous allez recevoir un lien vous permettant de réinitialiser votre mot de passe.",
      });
      reset();
    } catch (error) {
      setStatus({
        error: true,
        message:
          "Impossible de réinitialiser votre mot de passe. Vérifiez que vous avez bien saisi votre adresse email.",
      });
      console.error(error);
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.connexion(), PAGES.motDePasseOublie()]} />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "50%" }}
        h="100%"
        border="1px solid"
        borderColor="blue_france.light"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Mot de passe oublié
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl isInvalid={!!errors.email} isRequired mb={5}>
              <FormLabel>Votre email</FormLabel>
              <Input placeholder="prenom.nom@courriel.fr" {...register("email", { required: "Email obligatoire" })} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <Text color={status?.error ? "error_main" : "info_main"} mt={2}>
              {status?.message}
            </Text>
          </Box>
          <HStack spacing="4w" mt={8}>
            <Button variant="primary" type="submit">
              Recevoir un courriel de ré-initialisation
            </Button>
            <Link href="/auth/connexion" as={NavLink} color="grey.425">
              Annuler
            </Link>
          </HStack>
        </form>
      </Flex>
    </>
  );
};
export default MotDePasseOubliePage;

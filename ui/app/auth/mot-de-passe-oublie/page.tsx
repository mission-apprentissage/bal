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
import { IReqGetResetPassword, IStatus } from "shared/routes/auth.routes";

import Link from "../../../components/link/Link";
import { api } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import { NavLink } from "../../components/NavLink";

const MotDePasseOubliePage = () => {
  const [status, setStatus] = useState<IStatus>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IReqGetResetPassword>();

  const onSubmit: SubmitHandler<IReqGetResetPassword> = async (data) => {
    try {
      await api.get("/auth/reset-password", {
        params: data,
      });

      setStatus({
        error: false,
        message:
          "Vous allez recevoir un lien vous permettant de réinitialiser votre mot de passe.",
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
      <Breadcrumb
        pages={[PAGES.homepage(), PAGES.connexion(), PAGES.motDePasseOublie()]}
      />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "50%" }}
        h="100%"
        border="1px solid"
        borderColor="bluefrance.925"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Mot de passe oublié
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl isInvalid={!!errors.email} isRequired mb={5}>
              <FormLabel>Votre email</FormLabel>
              <Input
                placeholder="prenom.nom@courriel.fr"
                {...register("email", { required: "Email obligatoire" })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <Text color={status?.error ? "error" : "info"} mt={2}>
              {status?.message}
            </Text>
          </Box>
          <HStack spacing="4w" mt={8}>
            <Button variant="primary" type="submit">
              Recevoir un courriel de ré-initialisation
            </Button>
            <Link href="/auth/connexion" as={NavLink} color="grey.600">
              Annuler
            </Link>
          </HStack>
        </form>
      </Flex>
    </>
  );
};
export default MotDePasseOubliePage;

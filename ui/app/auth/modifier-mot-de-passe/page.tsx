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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IPostRoutes } from "shared";
import { IStatus } from "shared/routes/auth.routes";

import Link from "../../../components/link/Link";
import { apiPost } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import { NavLink } from "../../components/NavLink";

interface IFormValues
  extends Zod.input<IPostRoutes["/auth/reset-password"]["body"]> {
  password_confirmation: string;
}

const ModifierMotDePassePage = () => {
  const [status, setStatus] = useState<IStatus>();
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormValues>();

  const onSubmit: SubmitHandler<IFormValues> = async ({ password }) => {
    try {
      await apiPost("/auth/reset-password", {
        body: {
          password,
          token,
        },
      });

      setStatus({
        error: false,
        message: "Votre mot de passe a bien été modifié",
      });
      reset();

      setTimeout(() => {
        push("/auth/connexion");
      }, 3000);
    } catch (error) {
      setStatus({
        error: true,
        message: "Impossible de modifier votre mot de passe.",
      });
      console.error(error);
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.motDePasseOublie()]} />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "50%" }}
        h="100%"
        border="1px solid"
        borderColor="blue_france.light"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Modifiez votre mot de passe {token}
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl isInvalid={!!errors.password} mb={5}>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type={"password"}
                placeholder="************************"
                {...register("password", {
                  required: "Mot de passe obligatoire",
                })}
              />
              <FormErrorMessage>
                <>{errors.password?.message}</>
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password_confirmation} mb={5}>
              <FormLabel>Confirmation de mot de passe</FormLabel>
              <Input
                type={"password"}
                placeholder="************************"
                {...register("password_confirmation", {
                  required: "Confirmation de mot de passe obligatoire",
                })}
              />
              <FormErrorMessage>
                <>{errors.password_confirmation?.message}</>
              </FormErrorMessage>
            </FormControl>
            <Text color={status?.error ? "error_main" : "info_main"} mt={2}>
              {status?.message}
            </Text>
          </Box>

          <HStack spacing="4w" mt={8}>
            <Button variant="primary" type="submit">
              Modifier mon mot de passe
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
export default ModifierMotDePassePage;

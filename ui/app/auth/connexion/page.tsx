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
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IReqPostLogin, IStatus } from "shared/routes/auth.routes";

import Link from "../../../components/link/Link";
import { useAuth } from "../../../context/AuthContext";
import { AlertRounded } from "../../../theme/icons/AlertRounded";
import { ShowPassword } from "../../../theme/icons/ShowPassword";
import { api } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import { NavLink } from "../../components/NavLink";

const ConnexionPage = () => {
  const { push } = useRouter();
  const [status, setStatus] = useState<IStatus>();
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReqPostLogin>();

  const onSubmit: SubmitHandler<IReqPostLogin> = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      setUser(response.data);
    } catch (error) {
      setStatus({ error: true, message: "Impossible de se connecter." });
      console.error(error);
    }
  };

  if (user) {
    return push("/");
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.connexion()]} />
      <Flex
        flexDirection="column"
        p={12}
        w={{ base: "100%", md: "50%" }}
        h="100%"
        border="1px solid"
        borderColor="bluefrance.925"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Connectez-vous
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormControl isInvalid={!!errors.email} mb={5}>
              <FormLabel>Email (votre identifiant)</FormLabel>
              <Input
                placeholder="prenom.nom@courriel.fr"
                {...register("email", { required: "Email obligatoire" })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} mb={5}>
              <FormLabel>Mot de passe</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="************************"
                  {...register("password", {
                    required: "Mot de passe obligatoire",
                  })}
                />
                <InputRightElement width="2.5rem">
                  <ShowPassword
                    boxSize={5}
                    onClick={() => setShowPassword((current) => !current)}
                    cursor="pointer"
                  />
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                <>{errors.password?.message}</>
              </FormErrorMessage>
            </FormControl>
            {status?.error && (
              <Text color="error" mt={8}>
                <AlertRounded mb="0.5" /> {status?.message}
              </Text>
            )}
          </Box>
          <HStack spacing="4w" mt={8}>
            <Button variant="primary" type="submit">
              Connexion
            </Button>
            <Link
              href="/auth/mot-de-passe-oublie"
              as={NavLink}
              color="grey.600"
            >
              Mot de passe oublié
            </Link>
          </HStack>
        </form>
      </Flex>
    </>
  );
};
export default ConnexionPage;

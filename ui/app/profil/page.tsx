"use client";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "../../context/AuthContext";

const ProfilPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleClick = () => {
    if (user?.token) {
      navigator.clipboard.writeText(user?.token);
      toast({
        title: "Jeton API copié dans le presse-papier.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (!user) return null;

  return (
    <Box>
      <Text>Jeton API</Text>
      <InputGroup size="md" mt={4}>
        <Input pr="5rem" type="text" defaultValue={user.token} readOnly />
        <InputRightElement width="5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            Copier
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default ProfilPage;

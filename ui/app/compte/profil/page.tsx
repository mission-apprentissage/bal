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
import { AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";
import { useState } from "react";

import { IResGetGenerateApiKey } from "../../../../shared/routes/user.routes";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../utils/api.utils";

const ProfilPage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | undefined>();
  const toast = useToast();

  const handleClick = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast({
        title: "Jeton API copié dans le presse-papier.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await api.get<
        object,
        AxiosResponse<IResGetGenerateApiKey>
      >("/user/generate-api-key");

      setApiKey(response.data.api_key);
    } catch (error) {
      console.error(error);
      toast({
        title: "Impossible de générer un jeton API",
        status: "error",
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
        <Input
          pr="5rem"
          type="text"
          value={apiKey ?? "****************************************"}
          readOnly
        />
        <InputRightElement width="5rem">
          {apiKey && (
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              Copier
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
      {!apiKey && (
        <Text mt={4}>
          {user.api_key_used_at ? (
            <>
              {`Dernière utilisation le ${format(
                parseISO(user.api_key_used_at),
                "PPP à p",
                {
                  locale: fr,
                }
              )}`}
            </>
          ) : (
            <>Ce jeton n'a pas encore été utilisée</>
          )}
        </Text>
      )}

      <Box mt={4}>
        {!apiKey ? (
          <Button variant="primary" onClick={generateApiKey}>
            Générer un nouveau jeton
          </Button>
        ) : (
          <Text>
            Ce jeton n'est visible qu'une fois, il est recommandé de le stocker
            dans un endroit sécurisé.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ProfilPage;

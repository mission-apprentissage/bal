"use client";
import { Box, Text } from "@chakra-ui/react";

import { useAuth } from "../../../context/AuthContext";

const ProfilPage = () => {
  const { user } = useAuth();
  return (
    <Box>
      <Text>Jeton API</Text>
      <Text>{user?.token}</Text>
    </Box>
  );
};

export default ProfilPage;

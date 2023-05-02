"use client";

import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import NavLink from "next/link";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";

const AdminImportPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.adminFichier()]} />
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        alignItems="flex-start"
      >
        <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
          Gestion fichiers sources
        </Heading>
        <HStack spacing={4}>
          <Button
            variant="secondary"
            href="/admin/fichier/import"
            size="md"
            as={NavLink}
          >
            <Text as="span">+ Ajouter un fichier</Text>
          </Button>
        </HStack>
      </Flex>
      <Box mt={8} mb={16}>
        Lorem
      </Box>
    </>
  );
};
export default AdminImportPage;

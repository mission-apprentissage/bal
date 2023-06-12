"use client";

import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NavLink from "next/link";

import { IDocument } from "../../../../shared/models/document.model";
import Table from "../../../components/table/Table";
import { api } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";
import { formatBytes } from "../../../utils/file.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";

const AdminImportPage = () => {
  const { data: documentLists } = useQuery<IDocument[]>({
    queryKey: ["documentLists"],
    queryFn: async () => {
      const { data } = await api.get("/admin/documents");

      return data;
    },
    refetchInterval: 1000,
  });

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
        <Table
          fontSize="0.9rem"
          mt={4}
          data={documentLists || []}
          columns={{
            type_document: {
              id: "type_document",
              size: 120,
              header: () => "Type de fichier",
            },
            nom_fichier: {
              id: "nom_fichier",
              size: 100,
              header: () => "Nom du fichier",
            },
            taille_fichier: {
              id: "taille_fichier",
              size: 80,
              header: () => "Taille du fichier",
              cell: ({ row }) => formatBytes(row.original.taille_fichier),
            },
            lines_count: {
              id: "lines_count",
              size: 80,
              header: () => "Nombre de lignes",
            },
            created_at: {
              id: "created_at",
              size: 70,
              header: () => "Date d'import",
              cell: ({ row }) => {
                return (
                  row.original.created_at &&
                  formatDate(
                    row.original.created_at as string,
                    "dd/MM/yyyy à HH:mm"
                  )
                );
              },
            },
            status: {
              id: "import_progress",
              size: 100,
              header: () => "Statut",
              cell: ({ row }) => {
                if (row.original.import_progress === 100) return "Terminé";
                return `En cours d'importation ${row.original.import_progress?.toPrecision(
                  2
                )}%`;
              },
            },
          }}
        />
      </Box>
    </>
  );
};
export default AdminImportPage;

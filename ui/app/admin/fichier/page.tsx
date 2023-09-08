"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IDocumentJson } from "shared/models/document.model";

import Table from "../../../components/table/Table";
import { apiDelete, apiGet } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";
import { formatBytes } from "../../../utils/file.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";

const modal = createModal({
  id: "delete-document-modal",
  isOpenedByDefault: false,
});

const AdminImportPage = () => {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: documentLists } = useQuery<IDocumentJson[]>({
    queryKey: ["documentLists"],
    queryFn: async () => apiGet("/admin/documents", {}),
    refetchInterval: 1000,
  });

  const onDeleteDocument = async () => {
    setIsDeleting(true);
    try {
      if (!toDelete) throw new Error("Nothing to delete");
      await apiDelete(`/admin/document/:id`, { params: { id: toDelete } });
    } finally {
      setToDelete(null);
      setIsDeleting(false);
      modal.close();
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.adminFichier()]} />
      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          Gestion fichiers sources
        </Typography>
        <Button
          linkProps={{
            href: PAGES.adminImport().path,
          }}
        >
          + Ajouter un fichier
        </Button>
      </Box>

      <Box my={4}>
        <Table
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
                return row.original.created_at && formatDate(row.original.created_at, "dd/MM/yyyy à HH:mm");
              },
            },
            status: {
              id: "import_progress",
              size: 100,
              header: () => "Statut",
              cell: ({ row }) => {
                if (row.original.import_progress === 100) return "Terminé";
                return `En cours d'importation ${row.original.import_progress?.toPrecision(2)}%`;
              },
            },
            actions: {
              id: "actions",
              size: 25,
              header: () => "Actions",
              cell: ({ row }) => {
                if (
                  row.original.import_progress !== 100 &&
                  row.original.import_progress !== 0 // TODO This is a quick cleaning method but if delete and job running nned to send a kill sig to job
                )
                  return null;
                return (
                  <Button
                    iconId="ri-delete-bin-line"
                    onClick={() => {
                      setToDelete(row.original._id.toString());
                      modal.open();
                    }}
                    priority="tertiary no outline"
                    title="Supprimer"
                    style={{
                      color: fr.colors.decisions.text.actionHigh.redMarianne.default,
                    }}
                  />
                );
              },
            },
          }}
        />
        <modal.Component
          title="Supprimer le document"
          buttons={[
            {
              children: "Conserver le document",
              disabled: isDeleting,
            },
            {
              iconId: "ri-delete-bin-line",
              onClick: () => {
                onDeleteDocument();
              },
              children: "Supprimer le document",
              disabled: isDeleting,
            },
          ]}
        >
          Vous allez supprimer le document. Cette action est irréversible.
        </modal.Component>
      </Box>
    </>
  );
};
export default AdminImportPage;

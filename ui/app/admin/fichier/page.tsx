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

  const { data: documentLists, refetch } = useQuery<IDocumentJson[]>({
    queryKey: ["documentLists"],
    queryFn: async () => apiGet("/admin/documents", {}),
  });

  const onDeleteDocument = async () => {
    setIsDeleting(true);
    try {
      if (!toDelete) throw new Error("Nothing to delete");
      await apiDelete(`/admin/document/:id`, { params: { id: toDelete } });
    } finally {
      await refetch();
      setIsDeleting(false);
      setToDelete(null);
      modal.close();
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.adminFichier()]} />
      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          {PAGES.adminFichier().title}
        </Typography>
        <Button
          linkProps={{
            href: PAGES.adminImport().path,
          }}
        >
          + Ajouter un fichier
        </Button>
      </Box>

      <Table
        rows={documentLists || []}
        columns={[
          {
            field: "type_document",
            headerName: "Type de fichier",
            flex: 1,
          },
          {
            field: "nom_fichier",
            headerName: "Nom du fichier",
            flex: 1,
          },
          {
            field: "taille_fichier",
            headerName: "Taille du fichier",
            minWidth: 150,
            valueFormatter: ({ value }) => {
              return formatBytes(value);
            },
          },
          {
            field: "created_at",
            headerName: "Date d'import",
            minWidth: 150,
            valueFormatter: ({ value }) => {
              return value && formatDate(value, "dd/MM/yyyy à HH:mm");
            },
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            getActions: ({ row }) => {
              return [
                <Button
                  key="delete"
                  iconId="ri-delete-bin-line"
                  onClick={() => {
                    setToDelete(row._id.toString());
                    modal.open();
                  }}
                  priority="tertiary no outline"
                  title="Supprimer"
                  style={{
                    color: fr.colors.decisions.text.actionHigh.redMarianne.default,
                  }}
                />,
              ];
            },
          },
        ]}
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
            onClick: onDeleteDocument,
            children: "Supprimer le document",
            doClosesModal: false,
            disabled: isDeleting,
          },
        ]}
      >
        Vous allez supprimer le document. Cette action est irréversible.
      </modal.Component>
    </>
  );
};
export default AdminImportPage;

"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Box, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IUploadDocumentJson } from "shared/models/document.model";

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

  const { data: documentLists, refetch } = useQuery<IUploadDocumentJson[]>({
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
            field: "lines_count",
            headerName: "Nombre de lignes",
            minWidth: 150,
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
            field: "import_progress",
            headerName: "Statut",
            minWidth: 170,
            renderCell: ({ value, row }) => {
              if (row.job_status === "done") return "Terminé";
              if (row.job_status === "error")
                return (
                  <Box color={fr.colors.decisions.text.actionHigh.redMarianne.default}>
                    Erreur
                    <Tooltip title={row.job_error} arrow>
                      <Box component="i" ml={1} className="ri-information-line" />
                    </Tooltip>
                  </Box>
                );
              if (row.job_status === "pending") return "En attente";
              return (
                <>
                  En cours d'importation
                  <br />
                  {`${row.taille_fichier ? Math.min(Math.ceil(((value ?? 0) / row.taille_fichier) * 100), 100) : 100}%`}
                </>
              );
            },
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            getActions: ({ row }) => {
              if (
                row.job_status !== "done" &&
                row.job_status !== "error" // TODO This is a quick cleaning method but if delete and job running nned to send a kill sig to job
              )
                return [];

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

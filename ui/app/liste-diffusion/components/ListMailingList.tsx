import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { FC, useState } from "react";
import { IDocument } from "shared/models/document.model";
import { IMailingListWithDocumentJson } from "shared/models/mailingList.model";
import { IResErrorJson } from "shared/routes/common.routes";

import Table from "../../../components/table/Table";
import Toast, { useToast } from "../../../components/toast/Toast";
import { apiDelete, generateUrl } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";
import { PAGES } from "../../components/breadcrumb/Breadcrumb";

interface Props {
  mailingLists?: IMailingListWithDocumentJson[];
  onDelete?: () => void;
}

const modal = createModal({
  id: "delete-mailing-list-modal",
  isOpenedByDefault: false,
});

export function getMailingListStatus(mailing: IMailingListWithDocumentJson): IDocument["job_status"] {
  if (mailing.document) return mailing.document.job_status;

  const createdTime = new Date(mailing.created_at).getTime();

  if (createdTime + 2 * 3600 * 1000 < Date.now()) {
    return "error";
  }

  return "pending";
}

const ListMailingList: FC<Props> = ({ mailingLists, onDelete }) => {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!toDelete) throw new Error("Nothing to delete");
      await apiDelete(`/mailing-list/:id`, { params: { id: toDelete } });
      onDelete?.();
    } catch (error) {
      console.error(error);
      const serverError = error as IResErrorJson;
      setToast({
        severity: "error",
        message: `Une erreur est survenue lors de la suppression de la liste de diffusion${
          serverError?.message ? ` : ${serverError.message}` : ""
        }`,
      });
    } finally {
      setToDelete(null);
      setIsDeleting(false);
      modal.close();
    }
  };

  return (
    <>
      <Table
        rows={mailingLists || []}
        columns={[
          {
            field: "source",
            headerName: "Source",
            flex: 1,
          },
          {
            field: "campaign_name",
            headerName: "Nom de la campagne",
            flex: 1,
          },
          {
            field: "document",
            headerName: "Statut",
            width: 200,
            valueGetter: ({ row }) => row,
            valueFormatter: ({ value }) => {
              const status = getMailingListStatus(value);
              return {
                processing: "En cours de génération",
                importing: "En cours d'import",
                done: "Terminé",
                error: "Erreur",
                pending: "En attente",
                paused: "En pause",
              }[status];
            },
          },
          {
            field: "created_at",
            headerName: "Date de génération",
            width: 200,
            valueFormatter: ({ value }) => {
              return value && formatDate(value, "dd/MM/yyyy à HH:mm");
            },
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 150,
            getActions: ({ row }) => {
              const actions = [];
              const status = getMailingListStatus(row);

              if (status === "done") {
                actions.push(
                  <Button
                    key="download"
                    iconId="fr-icon-download-line"
                    linkProps={{
                      href: generateUrl(`/mailing-lists/:id/download`, {
                        params: {
                          id: row._id,
                        },
                      }),
                      target: undefined,
                      rel: undefined,
                    }}
                    priority="tertiary no outline"
                    title="Télécharger"
                  />
                );
              }

              if (status !== "processing") {
                actions.push(
                  <Button
                    key="duplicate"
                    iconId="ri-file-copy-line"
                    linkProps={{
                      href: `${PAGES.nouvelleListe().path}?mailing_list_id=${row._id}`,
                      target: undefined,
                      rel: undefined,
                    }}
                    priority="tertiary no outline"
                    title="Dupliquer"
                  />,
                  <Button
                    key="delete"
                    iconId="ri-delete-bin-line"
                    onClick={() => {
                      setToDelete(row._id);
                      modal.open();
                    }}
                    priority="tertiary no outline"
                    title="Supprimer"
                    style={{
                      color: fr.colors.decisions.text.actionHigh.redMarianne.default,
                    }}
                  />
                );
              }

              return actions;
            },
          },
        ]}
      />

      <modal.Component
        title="Supprimer la liste de diffusion"
        buttons={[
          {
            children: "Conserver le fichier",
            disabled: isDeleting,
          },
          {
            iconId: "ri-delete-bin-line",
            onClick: handleDelete,
            children: "Supprimer le fichier",
            disabled: isDeleting,
            doClosesModal: false,
          },
        ]}
      >
        Vous allez supprimer la liste de diffusion. Cette action est irréversible.
      </modal.Component>
      <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
    </>
  );
};

export default ListMailingList;

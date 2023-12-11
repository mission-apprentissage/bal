import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { FC, useState } from "react";
import { IResErrorJson } from "shared/routes/common.routes";

import Table from "../../../../components/table/Table";
import Toast, { useToast } from "../../../../components/toast/Toast";
import { apiDelete, generateUrl } from "../../../../utils/api.utils";

type fichier = {
  id: string;
};

interface Props {
  list?: fichier[];
  onDelete?: () => void;
}

const modal = createModal({
  id: "delete-mailing-list-modal",
  isOpenedByDefault: false,
});

const SupportFileList: FC<Props> = ({ list, onDelete }) => {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, setToast, handleClose } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!toDelete) throw new Error("Nothing to delete");
      await apiDelete("/support/file/delete", { querystring: { id: toDelete } });
      onDelete?.();
    } catch (error) {
      console.error(error);
      const serverError = error as IResErrorJson;
      setToast({
        severity: "error",
        message: `Une erreur est survenue lors de la suppression du fichier${
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
        rows={list || []}
        columns={[
          {
            field: "id",
            headerName: "Fichier",
            flex: 1,
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 150,
            getActions: ({ row }) => {
              const actions = [];
              actions.push(
                <Button
                  key="download"
                  iconId="fr-icon-download-line"
                  linkProps={{
                    href: generateUrl(`/support/file/download`, {
                      querystring: {
                        id: row.id,
                      },
                    }),
                    target: undefined,
                    rel: undefined,
                  }}
                  priority="tertiary no outline"
                  title="Télécharger"
                />
              );
              actions.push(
                <Button
                  key="delete"
                  iconId="ri-delete-bin-line"
                  onClick={() => {
                    setToDelete(row.id);
                    modal.open();
                  }}
                  priority="tertiary no outline"
                  title="Supprimer"
                  style={{
                    color: fr.colors.decisions.text.actionHigh.redMarianne.default,
                  }}
                />
              );

              return actions;
            },
          },
        ]}
      />

      <modal.Component
        title="Supprimer le fichier"
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
        Vous allez supprimer le fichier. Cette action est irréversible.
      </modal.Component>
      <Toast severity={toast?.severity} message={toast?.message} handleClose={handleClose} />
    </>
  );
};

export default SupportFileList;

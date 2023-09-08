import Button from "@codegouvfr/react-dsfr/Button";
import { Download } from "@codegouvfr/react-dsfr/Download";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { FC, useState } from "react";
import { IMailingListJson } from "shared/models/mailingList.model";

import Table from "../../../components/table/Table";
import { apiDelete, generateUrl } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";

interface Props {
  mailingLists?: IMailingListJson[];
  onDelete?: () => void;
}

const modal = createModal({
  id: "delete-mailing-list-modal",
  isOpenedByDefault: false,
});

const ListMailingList: FC<Props> = ({ mailingLists, onDelete }) => {
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!toDelete) throw new Error("Nothing to delete");
      await apiDelete(`/mailing-list/:id`, { params: { id: toDelete } });
      onDelete?.();
    } finally {
      setToDelete(null);
      setIsDeleting(false);
      modal.close();
    }
  };

  return (
    <>
      <Table
        fixed
        data={mailingLists || []}
        columns={{
          source: {
            id: "source",
            size: 100,
            header: () => "Source",
          },
          campaign_name: {
            id: "campaign_name",
            size: 100,
            header: () => "Nom de la campagne",
          },
          date: {
            id: "date",
            size: 100,
            header: () => "Date de génération",
            cell: ({ row }) => {
              return row.original.created_at && formatDate(row.original.created_at, "dd/MM/yyyy à HH:mm");
            },
          },

          actions: {
            id: "actions",
            size: 25,
            header: () => "Actions",
            cell: ({ row }) => {
              if (row.original.status !== "done") return null;

              return (
                <>
                  <Download
                    details=""
                    label="Télécharger"
                    linkProps={{
                      href: generateUrl(`/mailing-lists/:id/download`, {
                        params: {
                          id: row.original._id,
                        },
                      }),
                    }}
                    style={{ display: "inline-block", margin: 0, padding: 0 }}
                  />

                  <Button
                    iconId="ri-delete-bin-line"
                    onClick={() => {
                      setToDelete(row.original._id);
                      modal.open();
                    }}
                    priority="tertiary no outline"
                    title="Supprimer"
                  />
                </>
              );
            },
          },
        }}
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
            onClick: () => {
              handleDelete();
            },
            children: "Supprimer le fichier",
            disabled: isDeleting,
          },
        ]}
      >
        Vous allez supprimer la liste de diffusion. Cette action est irréversible.
      </modal.Component>
    </>
  );
};

export default ListMailingList;

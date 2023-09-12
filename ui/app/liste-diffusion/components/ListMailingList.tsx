import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
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
            width: 100,
            getActions: ({ row }) => {
              return [
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
                  title="Label buttons"
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
                />,
              ];
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

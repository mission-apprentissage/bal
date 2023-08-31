import { Box, HStack, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { IMailingListJson } from "shared/models/mailingList.model";

import { Dialog } from "../../../components/dialog/Dialog";
import Table from "../../../components/table/Table";
import { Bin } from "../../../theme/icons/Bin";
import { DownloadLine } from "../../../theme/icons/DownloadLine";
import { apiDelete, generateUrl } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";

interface Props {
  mailingLists?: IMailingListJson[];
  onDelete?: () => void;
}

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
    }
  };

  return (
    <Box>
      <Table
        mt={4}
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
              return (
                row.original.created_at &&
                formatDate(row.original.created_at, "dd/MM/yyyy à HH:mm")
              );
            },
          },

          actions: {
            id: "actions",
            size: 25,
            header: () => "Actions",
            cell: ({ row }) => {
              if (row.original.status !== "done") return null;

              return (
                <HStack spacing={4}>
                  <a
                    href={generateUrl(`/mailing-lists/:id/download`, {
                      params: {
                        id: row.original._id,
                      },
                    })}
                    title="Télécharger le fichier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadLine w="1w" />
                  </a>
                  <Bin
                    boxSize="5"
                    color="red_marianne"
                    cursor="pointer"
                    onClick={() => setToDelete(row.original._id)}
                  />
                </HStack>
              );
            },
          },
        }}
      />
      <Dialog
        title="Supprimer la liste de diffusion"
        modalProps={{
          onClose: () => setToDelete(null),
          isOpen: !!toDelete,
        }}
        cancelButtonProps={{
          children: "Conserver le fichier",
          onClick: () => setToDelete(null),
          isDisabled: isDeleting,
        }}
        proceedButtonProps={{
          children: "Supprimer le fichier",
          onClick: () => {
            handleDelete();
          },
          isLoading: isDeleting,
        }}
      >
        <Text>
          Vous allez supprimer la liste de diffusion. Cette action est
          irréversible.
        </Text>
      </Dialog>
    </Box>
  );
};

export default ListMailingList;

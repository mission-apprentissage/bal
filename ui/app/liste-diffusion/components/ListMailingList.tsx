import { Box, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { IMailingListJson } from "shared/models/mailingList.model";

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
  const handleDelete = async (mailingList_id: string) => {
    await apiDelete(`/mailing-list/:id`, { params: { id: mailingList_id } });
    onDelete?.();
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
                    onClick={() => handleDelete(row.original._id.toString())}
                  />
                </HStack>
              );
            },
          },
        }}
      />
    </Box>
  );
};

export default ListMailingList;

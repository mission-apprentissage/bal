import { Box, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import Table from "../../../components/table/Table";
import { Bin } from "../../../theme/icons/Bin";
import { DownloadLine } from "../../../theme/icons/DownloadLine";
import { api } from "../../../utils/api.utils";
import { formatDate } from "../../../utils/date.utils";

interface Props {
  mailingLists?: IJob[];
  onDelete?: () => void;
}

const ListMailingList: FC<Props> = ({ mailingLists, onDelete }) => {
  const handleDelete = async (mailingList_id: string) => {
    await api.delete(`/mailing-list/${mailingList_id}`);
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
            cell: ({ row }) => row.original.payload?.source,
          },
          status: {
            id: "status",
            size: 100,
            header: () => "Statut",
            cell: ({ row }) => {
              return (
                <>
                  {
                    {
                      pending: "En attente",
                      will_start: "Programmé",
                      running: "En cours",
                      finished: "Terminé",
                      blocked: "Bloqué",
                      errored: "Erreur",
                    }[row.original.status]
                  }
                </>
              );
            },
          },
          date: {
            id: "date",
            size: 100,
            header: () => "Date de génération",
            cell: ({ row }) => {
              return (
                row.original.created_at &&
                formatDate(
                  //@ts-ignore
                  row.original.created_at as string,
                  "dd/MM/yyyy à HH:mm"
                )
              );
            },
          },

          actions: {
            id: "actions",
            size: 25,
            header: () => "Actions",
            cell: ({ row }) => {
              if (row.original.status !== JOB_STATUS_LIST.FINISHED) {
                return null;
              }

              return (
                <HStack spacing={4}>
                  <a
                    href={`/api/mailing-lists/${row.original._id}/download`}
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

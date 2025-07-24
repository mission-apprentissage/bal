import { Table } from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { getMailingOutputColumns } from "shared/constants/mailingList";
import type { IMailingListJson } from "shared/models/mailingList.model";

interface Props {
  columns: IMailingListJson["output_columns"];
}

export default function PreviewColonnesSortie({ columns }: Props): ReactNode {
  if (!columns?.length) return null;

  const [simpleColumns, arrayColumns] = getMailingOutputColumns({ output_columns: columns }).reduce(
    (acc, column) => {
      if (!column.output || column.output === "") return acc;
      if (column.simple) {
        acc[0].push(column.output);
      } else {
        acc[1].push(column.output);
      }
      return acc;
    },
    [[], []] as [string[], string[]]
  );

  const formattedArrayColumns: string[] = [];

  for (let i = 0; i < 10; i++) {
    for (const column of arrayColumns) {
      formattedArrayColumns.push(`${column}_${i + 1}`);
    }
  }

  const columnsToDisplay = [...simpleColumns, ...formattedArrayColumns];

  return (
    <Box my={2}>
      <Typography variant="h5" gutterBottom>
        Aperçu des colonnes de sortie
      </Typography>
      <Table data={[]} headers={columnsToDisplay} />
    </Box>
  );
}

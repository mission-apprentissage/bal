import Table from "@codegouvfr/react-dsfr/Table";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { IMailingListJson } from "shared/models/mailingList.model";

interface Props {
  columns: IMailingListJson["output_columns"];
}

const PreviewColonnesSortie: FC<Props> = ({ columns }) => {
  if (!columns?.length) return null;

  const ungroupedColumns: string[] = [];
  const groupedColumns: string[] = [];

  columns.reduce(
    (acc, column) => {
      if (!column.output || column.output === "") return acc;
      if (!column.grouped) {
        if (column.column === "WEBHOOK_LBA") {
          acc.groupedColumns.push("lien_lba");
          acc.groupedColumns.push("lien_prdv");
        } else {
          acc.groupedColumns.push(column.output);
        }
      } else {
        acc.ungroupedColumns.push(column.output);
      }
      return acc;
    },
    { ungroupedColumns, groupedColumns }
  );

  const formattedGroupedColumns: string[] = [];

  for (let i = 0; i < 10; i++) {
    for (const column of groupedColumns) {
      formattedGroupedColumns.push(`${column}_${i + 1}`);
    }
  }

  const columnsToDisplay = [...ungroupedColumns, ...formattedGroupedColumns];

  return (
    <Box my={2}>
      <Typography variant="h5" gutterBottom>
        Aperçu des colonnes de sortie
      </Typography>
      <Table data={[]} headers={columnsToDisplay} />
    </Box>
  );
};

export default PreviewColonnesSortie;

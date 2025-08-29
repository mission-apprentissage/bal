import { Table } from "@codegouvfr/react-dsfr/Table";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { MAILING_LIST_COMPUTED_COLUMNS } from "shared/constants/mailingList";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";

interface Props {
  columns: IMailingListV2Json["config"]["output_columns"];
}

function generateColumnArray(name: string): string[] {
  return Array.from({ length: 10 }, (_, index) => `${name}_${index + 1}`);
}

export default function PreviewColonnesSortie({ columns }: Props): ReactNode {
  const finalColumns = useMemo(() => {
    return columns.flatMap((column): string[] => {
      if (column.input.type === "computed") {
        return MAILING_LIST_COMPUTED_COLUMNS[column.input.name]?.columns.flatMap((computedColumn) => {
          if (computedColumn.simple) {
            return [computedColumn.output];
          }
          return generateColumnArray(computedColumn.output);
        });
      }

      if (column.simple) {
        return [column.output];
      }

      return generateColumnArray(column.output);
    });
  }, [columns]);

  if (columns.length === 0) return null;

  return (
    <Box my={2}>
      <Typography variant="h5" gutterBottom>
        Aperçu des colonnes de sortie
      </Typography>
      <Table data={[]} headers={["email", ...finalColumns]} />
    </Box>
  );
}

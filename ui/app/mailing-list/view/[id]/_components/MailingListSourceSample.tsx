import { Box, Typography } from "@mui/material";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useMailingListSample } from "@/app/mailing-list/view/[id]/_hooks/useMailingListSample";
import Table from "@/components/table/Table";

export function MailingListSourceSample(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props;
  const sampleResult = useMailingListSample(mailingList._id);

  return (
    <Box>
      {sampleResult.isLoading && <Typography>Chargement de l'échantillon</Typography>}
      {sampleResult.error && (
        <Alert
          severity="warning"
          title="Erreur lors du chargement de l'échantillon"
          description="Une erreur est survenue lors du chargement de l'échantillon. Veuillez réessayer plus tard."
        />
      )}
      {sampleResult.data && sampleResult.data.length === 0 && (
        <Alert
          severity="warning"
          title="Aucune donnée disponible"
          description="Cette source ne comporte aucune donnée. Veuillez vérifier le fichier source."
        />
      )}
      {sampleResult.data && sampleResult.data.length > 0 && (
        <Table
          label="Échantillon de données"
          rows={sampleResult.data}
          columns={mailingList.source.columns.map((column) => ({
            field: column,
            headerName: column,
            minWidth: 200,
          }))}
          showToolbar
          getRowId={(row) => sampleResult.data.indexOf(row)}
          hideFooterPagination={sampleResult.data.length < 100}
          disableColumnFilter
          disableColumnMenu
        />
      )}
    </Box>
  );
}

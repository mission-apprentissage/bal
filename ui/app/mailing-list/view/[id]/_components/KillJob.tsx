import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { queryClient } from "@/utils/query.utils";
import { apiPost } from "@/utils/api.utils";

export function KillJob(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props;

  const mutation = useMutation({
    mutationKey: ["_private/mailing-list", mailingList._id, "kill-job"],
    mutationFn: async () => {
      await apiPost("/_private/mailing-list/:id/kill", {
        params: { id: mailingList._id },
        body: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Box
      sx={{
        marginTop: fr.spacing("8w"),
        gap: fr.spacing("2w"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography>Vous pouvez annuler le traitement</Typography>
      {mutation.isError && (
        <Alert
          severity="error"
          title="Une erreur est survenue lors de l'annulation du job"
          description={mutation.error.message}
        />
      )}
      <Button
        disabled={mutation.isPending}
        onClick={async () => {
          await mutation.mutateAsync();
        }}
      >
        Annuler le traitement
      </Button>
    </Box>
  );
}

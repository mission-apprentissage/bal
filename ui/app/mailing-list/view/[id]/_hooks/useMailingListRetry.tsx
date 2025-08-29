import { useMutation } from "@tanstack/react-query";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box } from "@mui/material";
import { fr } from "@codegouvfr/react-dsfr";
import { apiPost } from "@/utils/api.utils";
import { queryClient } from "@/utils/query.utils";

export function MailingListRetry(props: {
  mailingListId: string;
  status: "parse:scheduled" | "generate:scheduled" | "export:scheduled";
}) {
  const { mailingListId, status } = props;

  const { mutate: retryProcess, isPending } = useMutation({
    mutationKey: ["/_private/mailing-list", mailingListId, "schedule", status],
    throwOnError: true,
    mutationFn: async () =>
      apiPost(`/_private/mailing-list/:id/schedule`, {
        body: { status },
        params: { id: mailingListId },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"] });
    },
  });

  return (
    <Box
      sx={{
        margin: fr.spacing("6w"),
        textAlign: "center",
      }}
    >
      <Button priority="primary" size="large" onClick={() => retryProcess()} disabled={isPending}>
        Réessayer le traitement de la liste de diffusion
      </Button>
    </Box>
  );
}

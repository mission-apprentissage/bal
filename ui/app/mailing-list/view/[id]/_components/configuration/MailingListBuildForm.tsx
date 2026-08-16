import { fr } from "@codegouvfr/react-dsfr"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Box } from "@mui/material"
import { captureException } from "@sentry/nextjs"
import { useMutation } from "@tanstack/react-query"
import type { IMailingListV2Json } from "shared/models/mailingListV2.model"
import PreviewColonnesSortie from "@/app/mailing-list/view/[id]/_components/PreviewColonnesSortie"
import { apiPost } from "@/utils/api.utils"
import { queryClient } from "@/utils/query.utils"

type MailingListBuildFormProps = {
  mailingList: IMailingListV2Json
  onPrev: () => void
  readonly: boolean
}

export function MailingListBuildForm({ mailingList, onPrev, readonly }: MailingListBuildFormProps) {
  const { error, isPending, isError, mutate } = useMutation({
    mutationFn: async () => {
      await apiPost("/_private/mailing-list/:id/generate", {
        params: { id: mailingList._id },
        body: null,
      })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"], exact: true }),
        queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list", mailingList._id], exact: true }),
      ])
    },
    onError: (error) => {
      captureException(error)
    },
  })

  return (
    <Box>
      <PreviewColonnesSortie columns={mailingList.config.output_columns} />
      {isError && <Alert title="Une erreur est survenue lors de la configuration" description={error.message} severity="error" />}
      <Box sx={{ display: "flex", gap: fr.spacing("4w"), marginTop: fr.spacing("8w"), justifyContent: "flex-end" }}>
        <Button type="button" priority="tertiary" disabled={isPending} onClick={onPrev} size="large">
          Retour
        </Button>
        {!readonly && (
          <Button type="button" disabled={isPending} onClick={() => mutate()} size="large">
            Générer la liste de diffusion
          </Button>
        )}
      </Box>
    </Box>
  )
}

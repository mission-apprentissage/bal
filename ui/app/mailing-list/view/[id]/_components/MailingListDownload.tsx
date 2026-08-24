import { fr } from "@codegouvfr/react-dsfr"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Box, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import type { IMailingListV2Json } from "shared/models/mailingListV2.model"
import { apiPost, generateUrl } from "@/utils/api.utils"
import { queryClient } from "@/utils/query.utils"

function formatGenerationDuration(mailingList: IMailingListV2Json): string | null {
  if (mailingList.generation_started_at === null || mailingList.generation_ended_at === null) {
    return null
  }

  const durationMs = new Date(mailingList.generation_ended_at).getTime() - new Date(mailingList.generation_started_at).getTime()

  if (durationMs < 60_000) {
    return "moins d'une minute"
  }

  // Arrondi en minutes totales avant décomposition, sinon 1 h 59 min 59 s afficherait « 1 h 60 min »
  const totalMinutes = Math.round(durationMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`
}

export function MailingListDownload(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props

  const regenerateMutation = useMutation({
    mutationKey: ["/_private/mailing-list", mailingList._id, "schedule", "export:scheduled"],
    mutationFn: async () =>
      apiPost(`/_private/mailing-list/:id/schedule`, {
        body: { status: "export:scheduled" },
        params: { id: mailingList._id },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"] })
    },
  })

  if (mailingList.status !== "export:success") {
    return null
  }

  const generationDuration = formatGenerationDuration(mailingList)

  return (
    <Box sx={{ display: "grid", gap: fr.spacing("4w"), alignItems: "center" }}>
      <Alert title="La liste est prête !" description="Vous pouvez télécharger la liste de diffusion !" severity="success" />
      <Box sx={{ textAlign: "center" }}>
        <Button
          iconId="fr-icon-download-line"
          linkProps={{
            href: generateUrl("/_private/mailing-list/:id/output/download", {
              params: {
                id: mailingList._id,
              },
            }),
            target: undefined,
            rel: undefined,
          }}
          priority="primary"
          title="Télécharger"
          size="large"
        >
          Télécharger
        </Button>
      </Box>
      <Box sx={{ display: "grid", gap: fr.spacing("1w"), gridTemplateColumns: "1fr 2fr" }}>
        <Typography>Date de suppression</Typography>
        <Typography>
          {new Date(mailingList.ttl).toLocaleDateString()} à {new Date(mailingList.ttl).toLocaleTimeString()}
        </Typography>

        {generationDuration !== null && (
          <>
            <Typography>Durée de la génération</Typography>
            <Typography>{generationDuration}</Typography>
          </>
        )}

        <Typography>Nombre d'emails de la liste</Typography>
        <Typography>{mailingList.output.lines}</Typography>

        <Typography>Nombre de lignes source sans email</Typography>
        <Typography>{mailingList.output.empty_source_lines}</Typography>

        <Typography>Nombre d'emails blacklists ignorés</Typography>
        <Typography>{mailingList.output.blacklisted_email_count}</Typography>

        <Typography>Nombre d'emails invalides ignorés</Typography>
        <Typography>{mailingList.output.invalid_email_count}</Typography>

        <Typography>Doublons fusionnés (même email)</Typography>
        <Typography>{mailingList.output.duplicate_email_count}</Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button priority="secondary" iconId="fr-icon-refresh-line" onClick={() => regenerateMutation.mutate()} disabled={regenerateMutation.isPending}>
          Régénérer le fichier avec les statuts à jour
        </Button>
        <Typography variant="caption" component="p" color="textSecondary" className={fr.cx("fr-mt-1w")}>
          Les emails en erreur sont re-vérifiés régulièrement : régénérer le fichier applique les statuts les plus récents.
        </Typography>
        {regenerateMutation.isError && <Alert title="Impossible de lancer la régénération" description={regenerateMutation.error.message} severity="error" />}
      </Box>
    </Box>
  )
}

import { fr } from "@codegouvfr/react-dsfr"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Box, Typography } from "@mui/material"
import type { IMailingListV2Json } from "shared/models/mailingListV2.model"
import { generateUrl } from "@/utils/api.utils"

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
      </Box>
    </Box>
  )
}

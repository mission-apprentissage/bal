import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { Box, LinearProgress, Typography } from "@mui/material"
import { formatDate } from "date-fns"
import type { IMailingListV2Json } from "shared/models/mailingListV2.model"
import { assertUnreachable } from "shared/utils/assertUnreachable"

function ProgressBar(props: { value: number | null; label: string; eta: string | null }) {
  const { value, label, eta } = props

  return (
    <Box sx={{ width: "100%", py: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LinearProgress variant={value === null ? "indeterminate" : "determinate"} value={value ?? 0} color="primary" sx={{ flex: 1, borderRadius: "3px" }} />
        <Typography variant="body2" sx={{ minWidth: "72px", fontWeight: 500, lineHeight: 1.2 }}>
          {value === null ? "En attente" : `${value} %`}
        </Typography>
      </Box>
      <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.2 }}>
        {label}
        {eta === null ? "" : ` — fin estimée ${eta}`}
      </Typography>
    </Box>
  )
}

export function MailingListProgress(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props
  const eta = mailingList.eta === null ? null : formatDate(mailingList.eta, "dd/MM à HH:mm")

  switch (mailingList.status) {
    case "initial":
      return (
        <Badge severity="info" small>
          Importée
        </Badge>
      )
    case "parse:scheduled":
      return <ProgressBar value={null} label="Extraction planifiée" eta={null} />
    case "parse:in_progress":
      return <ProgressBar value={mailingList.progress.parse} label="Extraction" eta={eta} />
    case "parse:failure":
      return (
        <Badge severity="error" small>
          Échec — extraction
        </Badge>
      )
    case "parse:success":
      return <Badge small>À configurer</Badge>
    case "generate:scheduled":
      return <ProgressBar value={null} label="Génération planifiée" eta={null} />
    case "generate:in_progress":
      return <ProgressBar value={mailingList.progress.generate} label="Génération" eta={eta} />
    case "generate:failure":
      return (
        <Badge severity="error" small>
          Échec — génération
        </Badge>
      )
    case "generate:success":
    case "export:scheduled":
      return <ProgressBar value={null} label="Préparation du fichier planifiée" eta={null} />
    case "export:in_progress":
      return <ProgressBar value={mailingList.progress.export} label="Préparation du fichier" eta={eta} />
    case "export:failure":
      return (
        <Badge severity="error" small>
          Échec — préparation du fichier
        </Badge>
      )
    case "export:success":
      return (
        <Badge severity="success" small>
          Prête à télécharger
        </Badge>
      )
    default:
      assertUnreachable(mailingList.status)
  }
}

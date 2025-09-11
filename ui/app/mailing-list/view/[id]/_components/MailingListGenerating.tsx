import { Alert } from "@codegouvfr/react-dsfr/Alert";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, LinearProgress, Typography } from "@mui/material";
import { assertUnreachable } from "shared/utils/assertUnreachable";
import { KillJob } from "./KillJob";
import { MailingListRetry } from "@/app/mailing-list/view/[id]/_hooks/useMailingListRetry";

export function MailingListGenerating(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props;

  switch (mailingList.status) {
    case "initial":
    case "parse:scheduled":
    case "parse:in_progress":
    case "parse:failure":
    case "parse:success":
      return null;
    case "generate:scheduled":
      return (
        <Alert
          title="Génération de la liste de diffusion planifiée"
          description="La génération de la liste va commencer prochainement."
          severity="info"
        />
      );
    case "generate:in_progress":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Génération de la liste de diffusion en cours"
            description={`La génération de la liste est en cours. Cette opération peut durer plusieurs heures selon la taille du fichier, vous pouvez quitter cette page et
                revenir plus tard.`}
            severity="info"
          />
          <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
            <Typography
              textAlign="center"
              className={fr.cx("fr-text--lead")}
            >{`${mailingList.progress.generate}% - ETA estimée : ${mailingList.eta === null ? "En cours de calcul" : new Date(mailingList.eta).toLocaleString()}`}</Typography>
            <Box>
              <LinearProgress variant="determinate" color="primary" value={mailingList.progress.generate} />
            </Box>
          </Box>
          <KillJob mailingList={mailingList} />
        </Box>
      );
    case "generate:failure":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Échec de lors de la génération de la liste de diffusion"
            description={`${mailingList.error ?? "Erreur inconnue"}. Vous pouvez réessayer la génération ou contacter Kevin si le problème persiste.`}
            severity="error"
          />
          <MailingListRetry mailingListId={mailingList._id} status="generate:scheduled" />
        </Box>
      );
    case "generate:success":
    case "export:in_progress":
    case "export:scheduled":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Préparation du fichier de la liste de diffusion en cours"
            description={`La liste de diffusion est prête. Il ne reste plus qu'à préparer le fichier à télécharger.`}
            severity="info"
          />
          <Box sx={{ display: "grid" }}>
            <Typography
              textAlign="center"
              className={fr.cx("fr-text--lead")}
            >{`${mailingList.progress.generate}% - ETA estimée: ${mailingList.eta === null ? "En cours de calcul" : new Date(mailingList.eta).toLocaleString()}`}</Typography>
            <Box>
              <LinearProgress variant="determinate" color="primary" value={mailingList.progress.export} />
            </Box>
          </Box>
          <KillJob mailingList={mailingList} />
        </Box>
      );
    case "export:failure":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Échec de lors de la préparation du fichier de la liste de diffusion"
            description={`${mailingList.error ?? "Erreur inconnue"}. Vous pouvez réessayer la génération ou contacter Kevin si le problème persiste.`}
            severity="error"
          />
          <MailingListRetry mailingListId={mailingList._id} status="export:scheduled" />
        </Box>
      );
    case "export:success":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="La liste est prête !"
            description="Vous pouvez télécharger la liste de diffusion dans l'onglet 'Téléchargement'."
            severity="success"
          />
        </Box>
      );
    default:
      assertUnreachable(mailingList.status);
  }
}

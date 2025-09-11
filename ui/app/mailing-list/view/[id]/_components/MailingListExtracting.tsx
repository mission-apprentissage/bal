import { Alert } from "@codegouvfr/react-dsfr/Alert";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { fr } from "@codegouvfr/react-dsfr";
import { Box, LinearProgress, Typography } from "@mui/material";
import { assertUnreachable } from "shared/utils/assertUnreachable";
import { Input } from "@codegouvfr/react-dsfr/Input";
import byteSize from "byte-size";
import { MailingListSourceSample } from "./MailingListSourceSample";
import { MailingListRetry } from "@/app/mailing-list/view/[id]/_hooks/useMailingListRetry";

function MailingListParseResult(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props;

  return (
    <Box>
      <Input
        label="Nombre de lignes extraites"
        nativeInputProps={{
          readOnly: true,
          value: mailingList.source.lines,
          type: "number",
        }}
      />
      <Input
        label="Taille du fichier"
        nativeInputProps={{
          readOnly: true,
          value: `${byteSize(mailingList.source.file.size, { units: "metric_octet" })}`,
        }}
      />
      <MailingListSourceSample mailingList={mailingList} />
    </Box>
  );
}

export function MailingListExtracting(props: { mailingList: IMailingListV2Json }) {
  const { mailingList } = props;

  switch (mailingList.status) {
    case "initial":
      return null;
    case "parse:scheduled":
      return (
        <Alert
          title="Extraction du fichier planifiée"
          description="L'extraction du fichier va commencer prochainement."
          severity="info"
        />
      );
    case "parse:in_progress":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Extraction du fichier en cours"
            description={`L'extraction du fichier est en cours. Cette opération peut durer plusieurs heures selon la taille du fichier, vous pouvez quitter cette page et revenir plus tard.`}
            severity="info"
          />
          <Box sx={{ display: "grid" }}>
            <Typography
              textAlign="center"
              className={fr.cx("fr-text--lead")}
            >{`${mailingList.progress.parse}% - ETA estimée : ${mailingList.eta === null ? "En cours de calcul" : new Date(mailingList.eta).toLocaleString()}`}</Typography>
            <Box>
              <LinearProgress variant="determinate" color="primary" value={mailingList.progress.parse} />
            </Box>
          </Box>
        </Box>
      );
    case "parse:failure":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Échec de l'extraction du fichier"
            description={`${mailingList.error ?? "Erreur inconnue"}. Vous pouvez réessayer l'extraction ou contacter Kevin si le problème persiste.`}
            severity="error"
          />
          <MailingListRetry mailingListId={mailingList._id} status="parse:scheduled" />
        </Box>
      );
    case "parse:success":
      return (
        <Box sx={{ display: "grid", gap: fr.spacing("2w"), alignItems: "center" }}>
          <Alert
            title="Le fichier a été extrait avec succès !"
            description="Vous pouvez maintenant configurer votre liste de diffusion."
            severity="success"
          />
          <MailingListParseResult mailingList={mailingList} />
        </Box>
      );
    case "generate:scheduled":
    case "generate:in_progress":
    case "generate:failure":
    case "generate:success":
    case "export:in_progress":
    case "export:scheduled":
    case "export:failure":
    case "export:success":
      return <MailingListParseResult mailingList={mailingList} />;
    default:
      assertUnreachable(mailingList.status);
  }
}

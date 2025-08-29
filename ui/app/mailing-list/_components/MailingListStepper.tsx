import { fr } from "@codegouvfr/react-dsfr";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Box } from "@mui/material";
import { useMemo } from "react";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { assertUnreachable } from "shared/utils/assertUnreachable";

const STEPS = [
  "Import du fichier source",
  "Extraction du fichier source",
  "Configuration de la liste de diffusion",
  "Génération de la liste",
  "Téléchargement de la liste",
] as const;

export function getStepNumber(mailingListStatus: IMailingListV2Json["status"] | null): number {
  if (!mailingListStatus) {
    return 0;
  }

  switch (mailingListStatus) {
    case "initial":
      return 0;
    case "parse:scheduled":
    case "parse:in_progress":
    case "parse:failure":
      return 1;
    case "parse:success":
      return 2;
    case "generate:scheduled":
    case "generate:in_progress":
    case "generate:failure":
    case "generate:success":
    case "export:scheduled":
    case "export:in_progress":
    case "export:failure":
      return 3;
    case "export:success":
      return 4;
    default:
      assertUnreachable(mailingListStatus);
  }
}

export function MailingListStepper(props: { mailingList: IMailingListV2Json | null }) {
  const step = useMemo(() => {
    return getStepNumber(props.mailingList?.status ?? null);
  }, [props.mailingList?.status]);

  return (
    <Box
      sx={{
        backgroundColor: fr.colors.decisions.background.alt.grey.default,
        padding: fr.spacing("4w"),
      }}
    >
      <Stepper
        stepCount={STEPS.length}
        currentStep={step + 1}
        title={STEPS.at(step)}
        nextTitle={step < STEPS.length - 1 ? STEPS.at(step + 1) : undefined}
      />
    </Box>
  );
}

import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Box } from "@mui/material";
import { useState } from "react";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { ChoixColonnesIdentifiant } from "./configuration/ChoixColonnesIdentifiant";
import { ChoixColonnesSortie } from "./configuration/ChoixColonnesSortie";
import { ChoixColonnesFormation } from "./configuration/ChoixColonnesFormation";
import { MailingListBuildForm } from "./configuration/MailingListBuildForm";
import { MailingListResetConfig } from "./configuration/MailingListResetConfig";

const STEPS = {
  CHOIX_IDENTIFIANT: {
    number: 1,
    label: "1. Champs d'identification et de contact",
    id: "choix-identifiant",
  },
  CHOIX_OUTPUT: {
    number: 2,
    label: "2. Champs à afficher dans le fichier de sortie",
    id: "choix-sortie",
  },
  CHOIX_LBA_OUTPUT: {
    number: 3,
    label: "3. Champs liés à la formation",
    id: "choix-formation",
  },
  CHOIX_GENERATE: {
    number: 4,
    label: "4. Genération de la liste de diffusion",
    id: "choix-generate",
  },
} as const;

export function MailingListConfigure(props: { mailingList: IMailingListV2Json }) {
  const [step, setStep] = useState<number>(STEPS.CHOIX_IDENTIFIANT.number);

  const readonly = props.mailingList.status !== "parse:success";

  return (
    <>
      <MailingListResetConfig mailingList={props.mailingList} readonly={readonly} />
      <Box className={fr.cx("fr-accordions-group")} my={4}>
        <Accordion
          id={STEPS.CHOIX_IDENTIFIANT.id}
          expanded={step === STEPS.CHOIX_IDENTIFIANT.number}
          onExpandedChange={(expanded) => {
            if (expanded) setStep(STEPS.CHOIX_IDENTIFIANT.number);
          }}
          label={STEPS.CHOIX_IDENTIFIANT.label}
        >
          <ChoixColonnesIdentifiant
            readonly={readonly}
            mailingList={props.mailingList}
            onNext={() => setStep(STEPS.CHOIX_OUTPUT.number)}
          />
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_OUTPUT.id}
          expanded={step === STEPS.CHOIX_OUTPUT.number}
          onExpandedChange={(expanded) => {
            if (expanded) setStep(STEPS.CHOIX_OUTPUT.number);
          }}
          label={STEPS.CHOIX_OUTPUT.label}
        >
          {props.mailingList.config.email_column ? (
            <ChoixColonnesSortie
              readonly={readonly}
              mailingList={props.mailingList}
              onPrev={() => setStep(STEPS.CHOIX_IDENTIFIANT.number)}
              onNext={() => setStep(STEPS.CHOIX_LBA_OUTPUT.number)}
            />
          ) : (
            <Box my={3}>
              <Alert
                title="Compléter les étapes précédentes"
                description="Il est nécessaire de compléter les étapes précédentes pour continuer."
                severity="info"
              />
            </Box>
          )}
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_LBA_OUTPUT.id}
          expanded={step === STEPS.CHOIX_LBA_OUTPUT.number}
          onExpandedChange={(expanded) => {
            if (expanded) setStep(STEPS.CHOIX_LBA_OUTPUT.number);
          }}
          label={STEPS.CHOIX_LBA_OUTPUT.label}
        >
          <ChoixColonnesFormation
            readonly={readonly}
            mailingList={props.mailingList}
            onPrev={() => setStep(STEPS.CHOIX_OUTPUT.number)}
            onNext={() => setStep(STEPS.CHOIX_GENERATE.number)}
          />
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_GENERATE.id}
          expanded={step === STEPS.CHOIX_GENERATE.number}
          onExpandedChange={(expanded) => {
            if (expanded) setStep(STEPS.CHOIX_GENERATE.number);
          }}
          label={STEPS.CHOIX_GENERATE.label}
        >
          <MailingListBuildForm
            readonly={readonly}
            mailingList={props.mailingList}
            onPrev={() => setStep(STEPS.CHOIX_OUTPUT.number)}
          />
        </Accordion>
      </Box>
    </>
  );
}

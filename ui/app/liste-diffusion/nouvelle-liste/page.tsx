"use client";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { IBody, IPostRoutes } from "shared";
import type { IDocumentContentJson } from "shared/models/documentContent.model";
import type { IMailingListJson } from "shared/models/mailingList.model";

import ChoixColonnesFormation from "./components/ChoixColonnesFormation";
import ChoixColonnesIdentifiant from "./components/ChoixColonnesIdentifiant";
import ChoixColonnesSortie from "./components/ChoixColonnesSortie";
import type { IChoseSourceForm } from "./components/ChoixSource";
import ChoixSource from "./components/ChoixSource";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { apiGet } from "@/utils/api.utils";

export type IPostMailingListRoute = IBody<IPostRoutes["/mailing-list"]>;

const STEPS = {
  CHOIX_SOURCE: {
    number: 1,
    label: "1. Choix de la source",
    id: "choix-source",
  },
  CHOIX_IDENTIFIANT: {
    number: 2,
    label: "2. Champs d'identification et de contact",
    id: "choix-identifiant",
  },
  CHOIX_FORMATION: {
    number: 3,
    label: "3. Champs liés à la formation",
    id: "choix-formation",
  },
  CHOIX_SORTIE: {
    number: 4,
    label: "4. Champs à afficher dans le fichier de sortie",
    id: "choix-sortie",
  },
} as const;

const NouvelleListePage = () => {
  const [step, setStep] = useState<number>(STEPS.CHOIX_SOURCE.number);
  const [source, setSource] = useState<string>();
  const [campaignName, setCampaignName] = useState<string>();
  const [columns, setColumns] = useState<string[]>([]);
  const [sample, setSample] = useState<IDocumentContentJson[]>([]);
  const [identifierColumns, setIdentifierColumns] = useState<string[]>();
  const [trainingColumns, setTrainingColumns] = useState<IMailingListJson["training_columns"]>({});
  const [email, setEmail] = useState<string>();
  const [secondaryEmail, setSecondaryEmail] = useState<string | undefined>();
  const { push } = useRouter();
  const params = useSearchParams();

  const { data: mailingList } = useQuery<IMailingListJson>({
    queryKey: ["mailingList"],
    queryFn: async () => {
      const data = await apiGet("/mailing-lists/:id", {
        params: {
          id: params.get("mailing_list_id") || "",
        },
      });

      setSource(data.source);
      setCampaignName(data.campaign_name);
      setColumns(data.identifier_columns);

      return data;
    },
    enabled: !!params.get("mailing_list_id"),
    throwOnError: true,
  });

  const goToStep = (stepName: keyof typeof STEPS) => {
    // set step
    setStep(STEPS[stepName].number);
    // scroll to element
    const element = document.getElementById(`${STEPS[stepName].id}-collapse`);

    element?.parentElement?.scrollIntoView();
  };

  const handleSourceSelection = (data: IChoseSourceForm) => {
    goToStep("CHOIX_IDENTIFIANT");
    setSource(data.source);
    setCampaignName(data.campaign_name);
    setSample(data.sample);
    setColumns(data.columns);
  };

  const handleIdentifierColumnsSelection = (
    data: Pick<IPostMailingListRoute, "email" | "secondary_email" | "identifier_columns">
  ) => {
    goToStep("CHOIX_FORMATION");
    setIdentifierColumns(data.identifier_columns);
    setEmail(data.email);
    setSecondaryEmail(data.secondary_email);
  };

  const handleTrainingColumnsSelection = (data: Pick<IPostMailingListRoute, "training_columns">) => {
    goToStep("CHOIX_SORTIE");
    setTrainingColumns(data.training_columns);
  };

  const handleOutputColumnsSelection = () => {
    push(PAGES.listeDiffusion().path);
  };

  const handleExpandChange = (expanded: boolean, stepName: keyof typeof STEPS) => {
    if (expanded) {
      goToStep(stepName);
    } else {
      setStep(0);
    }
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.listeDiffusion(), PAGES.nouvelleListe()]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.nouvelleListe().title}
      </Typography>

      <Box className={fr.cx("fr-accordions-group")} my={4}>
        <Accordion
          id={STEPS.CHOIX_SOURCE.id}
          label={STEPS.CHOIX_SOURCE.label}
          expanded={step === STEPS.CHOIX_SOURCE.number}
          onExpandedChange={(expanded) => handleExpandChange(expanded, "CHOIX_SOURCE")}
        >
          <ChoixSource mailingList={mailingList} onSuccess={handleSourceSelection} />
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_IDENTIFIANT.id}
          expanded={step === STEPS.CHOIX_IDENTIFIANT.number}
          onExpandedChange={(expanded) => handleExpandChange(expanded, "CHOIX_IDENTIFIANT")}
          label={STEPS.CHOIX_IDENTIFIANT.label}
        >
          <ChoixColonnesIdentifiant
            mailingList={mailingList}
            columns={columns}
            onSuccess={handleIdentifierColumnsSelection}
            onCancel={() => {
              goToStep("CHOIX_SOURCE");
            }}
            sample={sample}
          />
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_FORMATION.id}
          expanded={step === STEPS.CHOIX_FORMATION.number}
          onExpandedChange={(expanded) => handleExpandChange(expanded, "CHOIX_FORMATION")}
          label={STEPS.CHOIX_FORMATION.label}
        >
          <ChoixColonnesFormation
            mailingList={mailingList}
            columns={columns}
            onSuccess={handleTrainingColumnsSelection}
            onCancel={() => {
              goToStep("CHOIX_IDENTIFIANT");
            }}
            sample={sample}
          />
        </Accordion>
        <Accordion
          id={STEPS.CHOIX_SORTIE.id}
          expanded={step === STEPS.CHOIX_SORTIE.number}
          onExpandedChange={(expanded) => handleExpandChange(expanded, "CHOIX_SORTIE")}
          label={STEPS.CHOIX_SORTIE.label}
        >
          {campaignName && source && !!columns.length && identifierColumns && email ? (
            <ChoixColonnesSortie
              mailingList={mailingList}
              sample={sample}
              columns={columns}
              source={source}
              campaignName={campaignName}
              identifierColumns={identifierColumns}
              trainingColumns={trainingColumns}
              onSuccess={handleOutputColumnsSelection}
              email={email}
              secondaryEmail={secondaryEmail}
              onCancel={() => goToStep("CHOIX_IDENTIFIANT")}
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
      </Box>
    </>
  );
};

export default NouvelleListePage;

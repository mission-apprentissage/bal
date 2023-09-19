"use client";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IBody, IPostRoutes } from "shared";
import { IDocumentContentJson } from "shared/models/documentContent.model";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import ChoixColonnesIdentifiant from "./components/ChoixColonnesIdentifiant";
import ChoixColonnesSortie from "./components/ChoixColonnesSortie";
import ChoixSource, { IChoseSourceForm } from "./components/ChoixSource";

const NouvelleListePage = () => {
  const [step, setStep] = useState<number>(0);
  const [source, setSource] = useState<string>();
  const [campaignName, setCampaignName] = useState<string>();
  const [columns, setColumns] = useState<string[]>([]);
  const [sample, setSample] = useState<IDocumentContentJson[]>([]);
  const [identifierColumns, setIdentifierColumns] = useState<string[]>();
  const [email, setEmail] = useState<string>();
  const [secondaryEmail, setSecondaryEmail] = useState<string | undefined>();
  const { push } = useRouter();

  const handleSourceSelection = (data: IChoseSourceForm) => {
    setSource(data.source);
    setCampaignName(data.campaign_name);
    setSample(data.sample);
    setColumns(data.columns);
    setStep(1);
  };

  const handleIdentifierColumnsSelection = (
    data: Pick<IBody<IPostRoutes["/mailing-list"]>, "email" | "secondary_email" | "identifier_columns">
  ) => {
    setIdentifierColumns(data.identifier_columns);
    setEmail(data.email);
    setSecondaryEmail(data.secondary_email);
    setStep(2);
  };

  const handleOutputColumnsSelection = () => {
    push(PAGES.listeDiffusion().path);
  };

  return (
    <>
      <Breadcrumb pages={[PAGES.listeDiffusion(), PAGES.nouvelleListe()]} />
      <Typography variant="h2" gutterBottom>
        {PAGES.nouvelleListe().title}
      </Typography>

      <Box className={fr.cx("fr-accordions-group")} my={4}>
        <Accordion label="1. Choix de la source" expanded={step === 0} onExpandedChange={() => {}}>
          <ChoixSource onSuccess={handleSourceSelection} />
        </Accordion>
        <Accordion expanded={step === 1} onExpandedChange={() => {}} label="2. Champs d'identification et de contact">
          <ChoixColonnesIdentifiant
            columns={columns}
            onSuccess={handleIdentifierColumnsSelection}
            onCancel={() => setStep(0)}
            sample={sample}
          />
        </Accordion>
        <Accordion
          expanded={step === 2}
          onExpandedChange={() => {}}
          label="3. Champs à afficher dans le fichier de sortie"
        >
          {campaignName && source && !!columns.length && identifierColumns && email ? (
            <ChoixColonnesSortie
              sample={sample}
              columns={columns}
              source={source}
              campaignName={campaignName}
              identifierColumns={identifierColumns}
              onSuccess={handleOutputColumnsSelection}
              email={email}
              secondaryEmail={secondaryEmail}
              onCancel={() => setStep(1)}
            />
          ) : (
            <Box my={2}>
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

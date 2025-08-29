"use client";

import { Box, Typography } from "@mui/material";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { fr } from "@codegouvfr/react-dsfr";
import { MailingListCreateSource } from "./MailingListCreateSource";
import { MailingListStepper } from "@/app/mailing-list/_components/MailingListStepper";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const AdminImportPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.mailingList(), PAGES.mailingListCreate()]} />
      <Box
        sx={{
          display: "grid",
          gap: fr.spacing("4w"),
          marginBottom: fr.spacing("4w"),
        }}
      >
        <Typography variant="h2">Générer une liste de diffusion</Typography>
        <MailingListStepper mailingList={null} />
        <Tabs
          label="Liste de diffusion"
          tabs={[
            {
              label: "Import",
              iconId: "fr-icon-file-add-line",
              isDefault: true,
              content: <MailingListCreateSource />,
            },
            {
              label: "Extraction",
              iconId: "fr-icon-search-line",
              disabled: true,
              content: null,
            },
            {
              label: "Configuration",
              iconId: "fr-icon-equalizer-line",
              disabled: true,
              content: null,
            },
            {
              label: "Génération",
              iconId: "fr-icon-cup-line",
              disabled: true,
              content: null,
            },
            {
              label: "Téléchargement",
              iconId: "fr-icon-file-download-line",
              disabled: true,
              content: null,
            },
          ]}
        />
      </Box>
    </>
  );
};
export default AdminImportPage;

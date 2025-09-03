"use client";

import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { fr } from "@codegouvfr/react-dsfr";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { MailingListConfigure } from "./MailingListConfig";
import { MailingListExtracting } from "./MailingListExtracting";
import { MailingListGenerating } from "./MailingListGenerating";
import { MailingListDownload } from "./MailingListDownload";
import { MailingListSource } from "./MailingListSource";
import Loading from "@/app/loading";
import { getStepNumber, MailingListStepper } from "@/app/mailing-list/_components/MailingListStepper";
import { apiGet } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

export function MailingListView(props: { id: string }) {
  const mailingListId = props.id;

  const { data: mailingList, isLoading } = useQuery({
    queryKey: ["/_private/mailing-list", mailingListId],
    queryFn: async ({ queryKey }) =>
      apiGet(`/_private/mailing-list/:id`, {
        params: { id: queryKey[1] },
      }),
    throwOnError: true,
    refetchInterval: 10_000,
    retry: 5,
  });

  const step = mailingList == null ? 0 : getStepNumber(mailingList.status);
  const [tabId, setTabId] = useState(`${step}`);

  useLayoutEffect(() => {
    // Make sure first render uses the correct tab
    // Hence the use of useLayoutEffect
    setTabId(`${step}`);
  }, [step]);

  if (isLoading) {
    return (
      <Box
        padding={8}
        display="flex"
        justifyContent="center"
        flexDirection="column"
        margin="auto"
        maxWidth="600px"
        textAlign="center"
      >
        <Loading />
      </Box>
    );
  }

  if (!mailingList) {
    notFound();
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.mailingList(), PAGES.mailingListView(mailingList._id)]} />
      <Box
        sx={{
          display: "grid",
          gap: fr.spacing("4w"),
          marginBottom: fr.spacing("4w"),
        }}
      >
        <Typography flexGrow={1} variant="h2">
          {`Générer une liste de diffusion - ${mailingList.name}`}
        </Typography>

        <MailingListStepper mailingList={mailingList} />

        <Tabs
          label="Mailing list"
          selectedTabId={tabId}
          onTabChange={setTabId}
          tabs={[
            {
              label: "Import",
              iconId: "fr-icon-file-add-line",
              tabId: "0",
            },
            {
              label: "Extraction",
              iconId: "fr-icon-search-line",
              tabId: "1",
              disabled: step < 1,
            },
            {
              label: "Configuration",
              iconId: "fr-icon-ball-pen-fill",
              tabId: "2",
              disabled: step < 2,
            },
            {
              label: "Génération",
              iconId: "fr-icon-cup-line",
              tabId: "3",
              disabled: step < 3,
            },
            {
              label: "Téléchargement",
              iconId: "fr-icon-file-download-line",
              tabId: "4",
              disabled: step < 4,
            },
          ]}
        >
          <>
            {tabId === "0" && <MailingListSource mailingList={mailingList} />}
            {tabId === "1" && <MailingListExtracting mailingList={mailingList} />}
            {tabId === "2" && <MailingListConfigure mailingList={mailingList} />}
            {tabId === "3" && <MailingListGenerating mailingList={mailingList} />}
            {tabId === "4" && <MailingListDownload mailingList={mailingList} />}
          </>
        </Tabs>
      </Box>
    </>
  );
}

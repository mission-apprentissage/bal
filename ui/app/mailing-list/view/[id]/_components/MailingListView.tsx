"use client";

import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { fr } from "@codegouvfr/react-dsfr";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { captureException } from "@sentry/nextjs";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { MailingListConfigure } from "./MailingListConfig";
import { MailingListExtracting } from "./MailingListExtracting";
import { MailingListGenerating } from "./MailingListGenerating";
import { MailingListDownload } from "./MailingListDownload";
import { MailingListSource } from "./MailingListSource";
import Loading from "@/app/loading";
import { getStepNumber, MailingListStepper } from "@/app/mailing-list/_components/MailingListStepper";
import { apiDelete, apiGet } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import { queryClient } from "@/utils/query.utils";

const removeModal = createModal({
  isOpenedByDefault: false,
  id: "remove-mailing-list-modal",
});

export function MailingListView(props: { id: string }) {
  const mailingListId = props.id;
  const { push } = useRouter();

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

  const removeMutation = useMutation({
    mutationKey: ["_private/mailing-list", mailingListId, "remove"],
    mutationFn: async () =>
      apiDelete(`/_private/mailing-list/:id`, {
        params: { id: mailingListId },
        body: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/_private/mailing-list"], exact: true });
      push(PAGES.mailingList().path);
    },
    onError: (error) => {
      captureException(error);
    },
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

  const canRemove = mailingList.job_id === null;

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: fr.spacing("2w"),
          }}
        >
          <Typography flexGrow={1} variant="h2">
            Générer une liste de diffusion
            <br />
            <span className={fr.cx("fr-text--lg")}>{mailingList.name}</span>
          </Typography>
          <Button
            disabled={!canRemove}
            className={fr.cx("fr-btn", "fr-btn--tertiary", "fr-btn--icon-left")}
            onClick={removeModal.open}
            title={
              canRemove
                ? "Supprimer la liste de diffusion"
                : "Impossible de supprimer la liste de diffusion tant qu'elle est en cours de traitement"
            }
          >
            <i className={fr.cx("fr-icon-delete-bin-line")} aria-hidden="true" />
            Supprimer
          </Button>
        </Box>
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
      <removeModal.Component
        title="Confirmer la suppression"
        size="large"
        buttons={[
          {
            doClosesModal: true,
            children: "Cancel",
          },
          {
            doClosesModal: false,
            children: "Supprimer",
            disabled: removeMutation.isPending,
            onClick: async () => {
              await removeMutation.mutateAsync();
              removeModal.close();
            },
          },
        ]}
      >
        <Typography>
          Êtes-vous sûr de vouloir supprimer cette liste de diffusion ? Cette action est irréversible.
        </Typography>
        {!canRemove && (
          <Alert
            className={fr.cx("fr-mt-2w")}
            severity="info"
            title="La liste de diffusion est en cours de traitement, elle ne peut pas être supprimée."
          />
        )}

        {removeMutation.isError && (
          <Alert
            title="Une erreur est survenue lors de la suppression"
            description={removeMutation.error.message}
            severity="error"
          />
        )}
      </removeModal.Component>
    </>
  );
}

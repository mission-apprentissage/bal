"use client";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { IMailingListWithDocumentAndOwnerJson } from "shared/models/mailingList.model";

import GeneratingMailingList from "./components/GeneratingMailingList";
import ListMailingList from "./components/ListMailingList";
import { apiGet } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import Loading from "@/app/loading";

const ListeDiffusionPage = () => {
  const {
    isLoading,
    data: mailingLists = [],
    refetch,
  } = useQuery<IMailingListWithDocumentAndOwnerJson[]>({
    queryKey: ["mailingLists"],
    queryFn: async () => apiGet("/mailing-lists", {}),
    throwOnError: true,
  });

  const generatingMailingList = mailingLists?.find((ml) => {
    const status = ml.document?.job_status ?? "pending";

    return status === "processing" || status === "pending" || status === "paused";
  });

  return (
    <>
      <Breadcrumb pages={[PAGES.listeDiffusion()]} />

      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          Listes de diffusion
        </Typography>
        <Button
          linkProps={{
            href: PAGES.nouvelleListe().path,
          }}
        >
          + Créer nouvelle liste
        </Button>
      </Box>

      <GeneratingMailingList mailingList={generatingMailingList} onDone={refetch} />
      <ListMailingList mailingLists={mailingLists} onDelete={refetch} />
      {isLoading && <Loading />}
    </>
  );
};

export default ListeDiffusionPage;

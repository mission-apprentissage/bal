"use client";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { IMailingListWithDocumentJson } from "shared/models/mailingList.model";

import { apiGet } from "../../utils/api.utils";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import GeneratingMailingList from "./components/GeneratingMailingList";
import ListMailingList from "./components/ListMailingList";

const ListeDiffusionPage = () => {
  const { data: mailingLists = [], refetch } = useQuery<IMailingListWithDocumentJson[]>({
    queryKey: ["mailingLists"],
    queryFn: async () => apiGet("/mailing-lists", {}),
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
          Mes listes de diffusion
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
    </>
  );
};

export default ListeDiffusionPage;

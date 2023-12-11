"use client";
import { getLink } from "@codegouvfr/react-dsfr/link";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { publicConfig } from "../../../config.public";
import { apiGet } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import SupportFileList from "./components/supportFileList";

type fichier = {
  id: string;
};

const ListeDiffusionPage = () => {
  const { data: list = [], refetch } = useQuery<fichier[]>({
    queryKey: ["supportFilesList"],
    queryFn: async () => apiGet("/support/files-list", {}),
  });

  const { Link } = getLink();

  return (
    <>
      <Breadcrumb pages={[PAGES.listeDiffusion()]} />

      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          Liste des fichiers déposés
        </Typography>
      </Box>
      <Typography sx={{ mt: 3 }}>
        Liste des fichiers déposés via
        <Link href={`${publicConfig.baseUrl}/support/depot`}>{`${publicConfig.baseUrl}/support/depot`}</Link>
      </Typography>

      <SupportFileList list={list} onDelete={refetch} />
    </>
  );
};

export default ListeDiffusionPage;

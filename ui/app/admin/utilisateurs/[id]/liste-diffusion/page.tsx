"use client";

import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { IMailingListWithDocumentAndOwnerJson } from "shared/models/mailingList.model";

import { apiGet } from "../../../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../../../components/breadcrumb/Breadcrumb";
import ListMailingList from "../../../../liste-diffusion/components/ListMailingList";

interface Props {
  params: { id: string };
}

const AdminImportPage = ({ params }: Props) => {
  const { data: mailingLists, refetch } = useQuery<IMailingListWithDocumentAndOwnerJson[]>({
    queryKey: ["/admin/mailing-list/:user_id", { user_id: params.id }],
    queryFn: async () => apiGet("/admin/mailing-list/:user_id", { params: { user_id: params.id } }),
  });

  return (
    <>
      <Breadcrumb pages={[PAGES.adminUsers(), PAGES.adminUserView(params.id), PAGES.adminListeDiffusion(params.id)]} />
      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          {PAGES.adminListeDiffusion(params.id).title}
        </Typography>
      </Box>
      <ListMailingList mailingLists={mailingLists} onDelete={refetch} />
    </>
  );
};
export default AdminImportPage;

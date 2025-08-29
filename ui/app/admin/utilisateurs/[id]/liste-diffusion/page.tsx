"use client";

import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { IMailingListWithDocumentAndOwnerJson } from "shared/models/mailingList.model";
import { use } from "react";
import { apiGet } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import ListMailingList from "@/app/liste-diffusion/components/ListMailingList";

interface Props {
  params: Promise<{ id: string }>;
}

const AdminImportPage = ({ params }: Props) => {
  const { id } = use(params);
  const { data: mailingLists, refetch } = useQuery<IMailingListWithDocumentAndOwnerJson[]>({
    queryKey: ["/admin/mailing-list/:user_id", { user_id: id }],
    queryFn: async () => apiGet("/admin/mailing-list/:user_id", { params: { user_id: id } }),
    throwOnError: true,
  });

  return (
    <>
      <Breadcrumb pages={[PAGES.adminUsers(), PAGES.adminUserView(id), PAGES.adminListeDiffusion(id)]} />
      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          {PAGES.adminListeDiffusion(id).title}
        </Typography>
      </Box>
      <ListMailingList mailingLists={mailingLists} onDelete={refetch} />
    </>
  );
};
export default AdminImportPage;

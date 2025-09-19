"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useCallback, useState } from "react";
import type { GridSortModel } from "@mui/x-data-grid";
import type { IGetRoutes, IQuery } from "shared";
import { zPrivateMailingListRoutes } from "shared/routes/_private/mailing-list.routes";
import { AddedBy } from "./_components/AddedBy";
import Table from "@/components/table/Table";
import { apiGet } from "@/utils/api.utils";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

type QueryKey = ["/_private/mailing-list", IQuery<IGetRoutes["/_private/mailing-list"]>];

const MailingListPage = () => {
  const [query, setQuery] = useState<IQuery<IGetRoutes["/_private/mailing-list"]>>({
    page: 0,
    size: 100,
    sort: "created_at",
    sortOrder: "desc",
  });

  const setPaginationModel = useCallback((model: { page: number; pageSize: number }) => {
    console.log("setPaginationModel", model);
    setQuery((prev) => ({
      ...prev,
      page: model.page,
      size: model.pageSize,
    }));
  }, []);

  const setSortModel = useCallback((model: GridSortModel) => {
    const isValidSort = zPrivateMailingListRoutes.get["/_private/mailing-list"].querystring.shape.sort.safeParse(
      model[0]?.field
    );

    setQuery((prev) => ({
      ...prev,
      sort: isValidSort.success ? isValidSort.data : "created_at",
      sortOrder: model[0]?.sort ?? "desc",
    }));
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["/_private/mailing-list", query] as QueryKey,
    queryFn: async ({ queryKey }) =>
      apiGet(
        `/_private/mailing-list`,
        {
          querystring: queryKey[1],
        },
        {}
      ),
    throwOnError: true,
    retry: 5,
  });

  return (
    <>
      <Breadcrumb pages={[PAGES.mailingList()]} />
      <Box display="flex" flexDirection="row">
        <Typography flexGrow={1} variant="h2">
          Gestion des listes de diffusion V2
        </Typography>
        <Button
          linkProps={{
            href: PAGES.mailingListCreate().path,
          }}
          iconId="fr-icon-add-line"
        >
          Créer une nouvelle liste
        </Button>
      </Box>
      <Table
        loading={isLoading}
        pageSizeOptions={[20, 50, 100, 500]}
        rowCount={data?.total || 0}
        paginationModel={{ page: query.page as number, pageSize: query.size as number }}
        sortModel={[{ field: query.sort, sort: query.sortOrder }]}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        columns={[
          { field: "name", headerName: "Nom", flex: 1 },
          {
            field: "added_by",
            headerName: "Ajouté par",
            flex: 1,
            renderCell: (params) => <AddedBy addedBy={params.value} />,
          },
          { field: "status", headerName: "Statut", flex: 1 },
          {
            field: "created_at",
            headerName: "Date de création",
            width: 200,
            valueFormatter: (value) => {
              return value && formatDate(value, "dd/MM/yyyy à HH:mm");
            },
          },
          {
            field: "ttl",
            headerName: "Date d'expiration",
            width: 200,
            valueFormatter: (value) => {
              return value && formatDate(value, "dd/MM/yyyy à HH:mm");
            },
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 150,
            getActions: ({ row }) => {
              return [
                <Button
                  key="view"
                  iconId="fr-icon-arrow-right-line"
                  linkProps={{
                    href: PAGES.mailingListView(row._id).path,
                  }}
                  priority="tertiary no outline"
                  title="Voir la liste de diffusion"
                />,
              ];
            },
          },
        ]}
        disableColumnFilter
        rows={data?.items || []}
      />
    </>
  );
};
export default MailingListPage;

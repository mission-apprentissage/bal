import { Button } from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/table/Table";
import { apiGet } from "@/utils/api.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "@/utils/query.utils";
import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import Loading from "@/app/loading";

const OrganisationList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["organisations", { searchValue, page, limit }],
    queryFn: async () =>
      apiGet("/admin/organisations", {
        querystring: { q: searchValue, page, limit },
      }),
    throwOnError: true,
    retry: 5,
  });

  const setPaginationModel = useCallback(
    (model: { page: number; pageSize: number }) => {
      push(
        formatUrlWithNewParams(PAGES.adminOrganisations().path, searchParams, {
          q: searchValue,
          page: model.page,
          limit: model.pageSize,
        })
      );
    },
    [searchValue, push, searchParams]
  );

  const onSearch = useCallback(
    (q: string) => {
      const url = formatUrlWithNewParams(PAGES.adminOrganisations().path, searchParams, {
        q,
        page,
        limit,
      });

      push(url);
    },
    [page, limit, push, searchParams]
  );

  return (
    <>
      <SearchBar onButtonClick={onSearch} defaultValue={searchValue} />

      {isLoading && <Loading />}

      {!isLoading && (
        <Table
          rows={data?.organisations || []}
          pageSizeOptions={[50, 100]}
          rowCount={data?.pagination?.total || 0}
          paginationModel={{ page: page as number, pageSize: limit as number }}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          columns={[
            {
              field: "siren",
              headerName: "SIREN",
              flex: 1,
            },
            {
              field: "email_domain",
              headerName: "Domaines Email",
              flex: 1,
            },
            {
              field: "source",
              headerName: "Source",
              flex: 1,
            },
            {
              field: "actions",
              type: "actions",
              headerName: "Actions",
              getActions: ({ row: { _id } }) => {
                return [
                  <Button
                    key="view"
                    iconId="fr-icon-arrow-right-line"
                    linkProps={{
                      href: PAGES.adminViewOrganisation(_id).path,
                    }}
                    priority="tertiary no outline"
                    title="Voir l'organisation"
                  />,
                ];
              },
            },
          ]}
          disableColumnFilter
          disableColumnMenu
          disableColumnSorting
        />
      )}
    </>
  );
};

export default OrganisationList;

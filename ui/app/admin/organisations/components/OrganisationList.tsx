import { Button } from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type { IOrganisationJson } from "shared/models/organisation.model";

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

  const { data: organisations, isLoading } = useQuery<IOrganisationJson[]>({
    queryKey: ["organistations", { searchValue, page, limit }],
    queryFn: async () =>
      apiGet("/admin/organisations", {
        querystring: { q: searchValue, page, limit },
      }),
    throwOnError: true,
  });

  const onSearch = (q: string) => {
    const url = formatUrlWithNewParams(PAGES.adminOrganisations().path, searchParams, {
      q,
      page,
      limit,
    });

    push(url);
  };

  return (
    <>
      <SearchBar onButtonClick={onSearch} defaultValue={searchValue} />

      {isLoading && <Loading />}

      {!isLoading && (
        <Table
          rows={organisations || []}
          columns={[
            {
              field: "nom",
              headerName: "Nom",
              flex: 1,
            },
            {
              field: "siren",
              headerName: "SIREN",
              flex: 1,
            },
            {
              field: "email_domains",
              headerName: "Domaines",
              flex: 1,
              valueFormatter: (_value, row) => row.email_domains?.join(", "),
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
        />
      )}
    </>
  );
};

export default OrganisationList;

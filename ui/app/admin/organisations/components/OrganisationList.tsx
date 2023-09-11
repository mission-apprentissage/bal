import Button from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrganisationJson } from "shared/models/organisation.model";

import SearchBar from "../../../../components/SearchBar";
import Table from "../../../../components/table/Table";
import { apiGet } from "../../../../utils/api.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "../../../../utils/query.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";

const OrganisationList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data: organisations } = useQuery<IOrganisationJson[]>({
    queryKey: ["organistations", { searchValue, page, limit }],
    queryFn: async () =>
      apiGet("/admin/organisations", {
        querystring: { q: searchValue, page, limit },
      }),
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

      <Table
        fixed
        data={organisations || []}
        columns={{
          nom: {
            id: "nom",
            size: 100,
            header: () => "Nom",
          },
          email_domains: {
            id: "email_domains",
            size: 100,
            header: () => "Domaines",
            cell: ({ row }) => row.original.email_domains?.join(", ") ?? "",
          },
          actions: {
            id: "actions",
            size: 25,
            header: () => "",
            cell: ({ row }) => (
              <Button
                iconId="fr-icon-arrow-right-line"
                linkProps={{
                  href: PAGES.adminViewOrganisation(row.original._id).path,
                }}
                priority="tertiary no outline"
                title="Voir l'organisation"
              />
            ),
          },
        }}
        searchValue={searchValue}
      />
    </>
  );
};

export default OrganisationList;

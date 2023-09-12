import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrganisationJson } from "shared/models/organisation.model";

import FormSearch from "../../../../components/formSearch/FormSearch";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
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
      <FormSearch onSearch={onSearch} defaultValue={searchValue} />
      <Table
        mt={4}
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
              <Link href={`/admin/organisations/${row.original._id}`}>
                <ArrowRightLine w="1w" />
              </Link>
            ),
          },
        }}
        searchValue={searchValue}
      />
    </>
  );
};

export default OrganisationList;

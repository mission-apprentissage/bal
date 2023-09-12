import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonWithOrganisationJson } from "shared/models/person.model";

import FormSearch from "../../../../components/formSearch/FormSearch";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { apiGet } from "../../../../utils/api.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "../../../../utils/query.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";

const PersonList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data: persons } = useQuery<PersonWithOrganisationJson[]>({
    queryKey: ["persons", { searchValue, page, limit }],
    queryFn: async () =>
      apiGet("/admin/persons", {
        querystring: { q: searchValue, page, limit },
      }),
  });

  const onSearch = (q: string) => {
    const url = formatUrlWithNewParams(PAGES.adminPersons().path, searchParams, {
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
        data={persons || []}
        columns={{
          name: {
            id: "name",
            size: 100,
            header: () => "Nom complet",
            cell: ({ row }) => {
              const { nom, prenom, _id } = row.original;
              return nom || prenom ? `${nom ?? ""} ${prenom ?? ""}` : _id;
            },
          },
          email: {
            id: "email",
            size: 100,
            header: () => "Email",
          },
          civility: {
            id: "civility",
            size: 100,
            header: () => "Civilité",
          },
          organisation_id: {
            id: "organisation_id",
            size: 100,
            header: () => "Organisation",
            cell: ({ row }) => {
              const { organisation } = row.original;

              return organisation ? (
                <Text as={Link} href={PAGES.adminViewOrganisation(organisation._id as unknown as string).path}>
                  {organisation.nom}
                </Text>
              ) : (
                ""
              );
            },
          },
          source: {
            id: "source",
            size: 100,
            header: () => "Source",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }) => (row.original._meta as any)?.source ?? "",
          },
          actions: {
            id: "actions",
            size: 25,
            header: () => "",
            cell: ({ row }) => (
              <Link href={`/admin/personnes/${row.original._id}`}>
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

export default PersonList;

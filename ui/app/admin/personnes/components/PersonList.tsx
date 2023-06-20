import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import FormSearch from "../../../../components/formSearch/FormSearch";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { api } from "../../../../utils/api.utils";
import {
  formatUrlWithNewParams,
  getSearchParamsForQuery,
} from "../../../../utils/query.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";
import { IResGetPersons } from "shared/routes/person.routes";

const PersonList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const {
    page: page,
    limit: limit,
    q: searchValue,
  } = getSearchParamsForQuery(searchParams);

  const { data: persons } = useQuery<IResGetPersons>({
    queryKey: ["persons", { searchValue, page, limit }],
    queryFn: async () => {
      const { data } = await api.get("/admin/persons", {
        params: { q: searchValue, page, limit },
      });

      return data;
    },
  });

  const onSearch = (q: string) => {
    const url = formatUrlWithNewParams(
      PAGES.adminPersons().path,
      searchParams,
      {
        q,
        page,
        limit,
      }
    );

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
                <Text
                  as={Link}
                  href={PAGES.adminViewOrganisation(organisation._id).path}
                >
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
            cell: ({ row }) => row.original._meta?.source ?? "",
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

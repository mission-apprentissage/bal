import { Button } from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { PersonWithOrganisationJson } from "shared/models/person.model";

import SearchBar from "@/components/SearchBar";
import Table from "@/components/table/Table";
import { apiGet } from "@/utils/api.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "@/utils/query.utils";
import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import Loading from "@/app/loading";

const PersonList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data: persons, isLoading } = useQuery<PersonWithOrganisationJson[]>({
    queryKey: ["persons", { searchValue, page, limit }],
    queryFn: async () =>
      apiGet("/admin/persons", {
        querystring: { q: searchValue, page, limit },
      }),
    throwOnError: true,
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
      <SearchBar onButtonClick={onSearch} defaultValue={searchValue} />

      {isLoading && <Loading />}

      {!isLoading && (
        <Table
          rows={persons || []}
          columns={[
            {
              field: "name",
              headerName: "Nom complet",
              flex: 1,
              valueGetter: (_value, row) => {
                const { nom, prenom, _id } = row;
                return nom || prenom ? `${nom ?? ""} ${prenom ?? ""}` : _id;
              },
            },
            {
              field: "email",
              headerName: "Email",
              flex: 1,
            },
            {
              field: "civility",
              headerName: "Civilité",
              minWidth: 50,
            },
            {
              field: "organisation_id",
              headerName: "Organisation",
              flex: 1,
              valueFormatter: (_value, row) => {
                if (!row.organisation) return null;
                return (
                  <Link href={PAGES.adminViewOrganisation(row.organisation._id as unknown as string).path}>
                    {row.organisation.nom}
                  </Link>
                );
              },
            },
            {
              field: "sources",
              headerName: "Sources",
              valueGetter: (_value, row) => {
                // @ts-expect-error
                return row._meta?.sources?.join(", ") ?? "";
              },
            },
            {
              field: "actions",
              type: "actions",
              headerName: "Actions",
              getActions: ({ row: { _id } }) => [
                <Button
                  key="view"
                  iconId="fr-icon-arrow-right-line"
                  linkProps={{
                    href: PAGES.adminViewPerson(_id).path,
                  }}
                  priority="tertiary no outline"
                  title="Voir la personne"
                />,
              ],
            },
          ]}
        />
      )}
    </>
  );
};

export default PersonList;

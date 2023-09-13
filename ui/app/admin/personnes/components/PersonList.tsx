import Button from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonWithOrganisationJson } from "shared/models/person.model";

import SearchBar from "../../../../components/SearchBar";
import Table from "../../../../components/table/Table";
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
      <SearchBar onButtonClick={onSearch} defaultValue={searchValue} />

      <Table
        fixed
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
              if (!organisation) return null;
              return (
                <Link href={PAGES.adminViewOrganisation(organisation._id as unknown as string).path}>
                  {organisation.nom}
                </Link>
              );
            },
          },
          source: {
            id: "sources",
            size: 100,
            header: () => "Sources",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }) => (row.original._meta as any)?.sources?.join(", ") ?? "",
          },
          actions: {
            id: "actions",
            size: 25,
            header: () => "",
            cell: ({ row }) => (
              <Button
                iconId="fr-icon-arrow-right-line"
                linkProps={{
                  href: PAGES.adminViewPerson(row.original._id).path,
                }}
                priority="tertiary no outline"
                title="Voir la personne"
              />
            ),
          },
        }}
        searchValue={searchValue}
      />
    </>
  );
};

export default PersonList;

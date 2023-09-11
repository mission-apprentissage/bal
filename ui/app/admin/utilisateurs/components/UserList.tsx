import Button from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IUserWithPersonPublic } from "shared/models/user.model";

import SearchBar from "../../../../components/SearchBar";
import Table from "../../../../components/table/Table";
import { apiGet } from "../../../../utils/api.utils";
import { formatDate } from "../../../../utils/date.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "../../../../utils/query.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";
import { getPersonDisplayName } from "../../personnes/persons.format";

const UserList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data: users } = useQuery<IUserWithPersonPublic[]>({
    queryKey: ["users", { searchValue, page, limit }],
    queryFn: async () => {
      const data = await apiGet("/admin/users", {
        querystring: { q: searchValue, page, limit },
      });

      return data;
    },
  });

  const onSearch = (q: string) => {
    const url = formatUrlWithNewParams(PAGES.adminUsers().path, searchParams, {
      q,
      page,
      limit,
    });

    push(url);
  };

  return (
    <>
      <SearchBar onButtonClick={onSearch} defaultValue={searchParams.get("q") ?? ""} />
      <Table
        fixed
        searchValue={searchValue}
        data={users || []}
        columns={{
          email: {
            id: "email",
            header: () => "Email",
            cell: ({ row }) => row.original.email,
          },
          person: {
            id: "person",
            header: () => "Personne",
            cell: ({ row }) => {
              const { person } = row.original;
              if (!person) return null;

              return <Link href={PAGES.adminViewPerson(person._id).path}>{getPersonDisplayName(person)}</Link>;
            },
          },
          is_admin: {
            id: "is_admin",
            header: () => "Administrateur",
            cell: ({ row }) => (row.original.is_admin ? "Oui" : "Non"),
          },
          api_key_used_at: {
            id: "api_key_used_at",
            header: () => "Dernière utilisation API",
            cell: ({ row }) => {
              const date = row.original.api_key_used_at;
              return date ? formatDate(date as unknown as string, "PPP à p") : "Jamais";
            },
          },
          actions: {
            size: 25,
            id: "actions",
            header: () => "",
            cell: ({ row }) => (
              <Button
                iconId="fr-icon-arrow-right-line"
                linkProps={{
                  href: PAGES.adminUserView(row.original._id).path,
                }}
                priority="tertiary no outline"
                title="Voir l'utilisateur"
              />
            ),
          },
        }}
      />
    </>
  );
};

export default UserList;

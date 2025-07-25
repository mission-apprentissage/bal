import { Button } from "@codegouvfr/react-dsfr/Button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { IUserWithPersonPublic } from "shared/models/user.model";

import SearchBar from "@/components/SearchBar";
import Table from "@/components/table/Table";
import { apiGet } from "@/utils/api.utils";
import { formatDate } from "@/utils/date.utils";
import { formatUrlWithNewParams, getSearchParamsForQuery } from "@/utils/query.utils";
import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";
import Loading from "@/app/loading";
import { getPersonDisplayName } from "@/app/admin/personnes/persons.format";

const UserList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const { page: page, limit: limit, q: searchValue } = getSearchParamsForQuery(searchParams);

  const { data: users, isLoading } = useQuery<IUserWithPersonPublic[]>({
    queryKey: ["users", { searchValue, page, limit }],
    queryFn: async () => {
      const data = await apiGet("/admin/users", {
        querystring: { q: searchValue, page, limit },
      });

      return data;
    },
    throwOnError: true,
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
        rows={users || []}
        columns={[
          {
            field: "email",
            headerName: "Email",
            flex: 1,
          },
          {
            field: "person",
            headerName: "Personne",
            flex: 1,
            renderCell: ({ value: person }) => {
              if (!person) return null;

              return <Link href={PAGES.adminViewPerson(person._id).path}>{getPersonDisplayName(person)}</Link>;
            },
          },
          {
            field: "is_admin",
            headerName: "Administrateur",
            valueGetter: ({ value }) => (value ? "Oui" : "Non"),
            minWidth: 150,
          },
          {
            field: "api_key_used_at",
            headerName: "Dernière utilisation API",
            valueGetter: ({ value }) => {
              return value ? formatDate(value as unknown as string, "PPP à p") : "Jamais";
            },
            minWidth: 180,
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
                  href: PAGES.adminUserView(_id).path,
                }}
                priority="tertiary no outline"
                title="Voir l'utilisateur"
              />,
            ],
          },
        ]}
      />
      {isLoading && <Loading />}
    </>
  );
};

export default UserList;

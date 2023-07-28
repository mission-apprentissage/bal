import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IUserWithPersonPublic } from "shared/models/user.model";

import FormSearch from "../../../../components/formSearch/FormSearch";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { apiGet } from "../../../../utils/api.utils";
import { formatDate } from "../../../../utils/date.utils";
import {
  formatUrlWithNewParams,
  getSearchParamsForQuery,
} from "../../../../utils/query.utils";
import { PAGES } from "../../../components/breadcrumb/Breadcrumb";
import { getPersonDisplayName } from "../../personnes/persons.format";

const UserList = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const {
    page: page,
    limit: limit,
    q: searchValue,
  } = getSearchParamsForQuery(searchParams);

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
      <FormSearch onSearch={onSearch} defaultValue={searchValue} />
      <Table
        mt={4}
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

              return (
                <Text
                  as={Link}
                  href={`/admin/personnes/${person._id}`}
                  flexGrow={1}
                >
                  <Text isTruncated maxWidth={400}>
                    {getPersonDisplayName(person)}
                  </Text>
                </Text>
              );
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
              return date
                ? formatDate(date as unknown as string, "PPP à p")
                : "Jamais";
            },
          },
          actions: {
            size: 25,
            id: "actions",
            header: () => "",
            cell: ({ row }) => (
              <Link href={`/admin/utilisateurs/${row.original._id}`}>
                <ArrowRightLine w="1w" />
              </Link>
            ),
          },
        }}
      />
    </>
  );
};

export default UserList;

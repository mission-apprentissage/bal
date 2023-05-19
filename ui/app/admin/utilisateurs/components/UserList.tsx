import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IResGetUsers } from "../../../../../shared/routes/user.routes";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { api } from "../../../../utils/api.utils";
import { formatDate } from "../../../../utils/date.utils";

const UserList = () => {
  const [users, setUsers] = useState<IResGetUsers>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/admin/users");

      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <Table
      mt={4}
      data={users || []}
      columns={{
        email: {
          size: 100,
          header: () => "Email",
        },
        person: {
          size: 100,
          header: () => "Personne",
          cell: ({ getValue }) => {
            const person = getValue();

            if (!person) return null;

            return (
              <Text
                as={Link}
                href={`/admin/personnes/${person._id}`}
                flexGrow={1}
              >
                <Text isTruncated maxWidth={400}>
                  {person?.nom ?? person?._id}
                </Text>
              </Text>
            );
          },
        },
        is_admin: {
          size: 100,
          header: () => "Administrateur",
          cell: ({ getValue }: any) => (getValue() ? "Oui" : "Non"),
        },
        api_key_used_at: {
          size: 100,
          header: () => "Dernière utilisation API",
          cell: ({ getValue }: any) =>
            getValue() ? formatDate(getValue(), "PPP à p") : "Jamais",
        },
        actions: {
          size: 25,
          header: () => "",
          cell: ({ row }) => (
            <Link href={`/admin/utilisateurs/${row.original._id}`}>
              <ArrowRightLine w="1w" />
            </Link>
          ),
        },
      }}
    />
  );
};

export default UserList;

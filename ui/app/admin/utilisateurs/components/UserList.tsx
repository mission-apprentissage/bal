import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IResGetUsers } from "../../../../../shared/routes/user.routes";
import Table from "../../../../components/table/Table";
import { ArrowRightLine } from "../../../../theme/icons/ArrowRightLine";
import { api } from "../../../../utils/api.utils";
import { formatDate } from "../../../../utils/date.utils";
import { getPersonDisplayName } from "../../personnes/persons.format";

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
            return date ? formatDate(date, "PPP à p") : "Jamais";
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
  );
};

export default UserList;

import { useEffect, useState } from "react";

import { IResGetUsers } from "../../../../../shared/routes/user.routes";
import Table from "../../../../components/table/Table";
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
        is_admin: {
          size: 100,
          header: () => "Administrateur",
          cell: ({ getValue }) => (getValue() ? "Oui" : "Non"),
        },
        api_key_used_at: {
          size: 100,
          header: () => "Dernière utilisation API",
          cell: ({ getValue }) =>
            getValue() ? formatDate(getValue(), "PPP à p") : "Jamais",
        },
      }}
    />
  );
};

export default UserList;

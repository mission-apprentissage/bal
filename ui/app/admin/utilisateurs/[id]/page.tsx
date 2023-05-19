import { headers } from "next/headers";

import { apiServer } from "../../../../utils/api.utils";
import UserView from "./components/UserView";

interface Props {
  params: { id: string };
}

const AdminUserViewPage = async ({ params }: Props) => {
  const { data: user } = await apiServer.get(`/admin/users/${params.id}`, {
    headers: {
      cookie: headers().get("cookie") ?? "",
    },
  });

  return <UserView user={user} />;
};

export default AdminUserViewPage;

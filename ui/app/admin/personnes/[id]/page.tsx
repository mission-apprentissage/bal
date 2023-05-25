import { headers } from "next/headers";

import { apiServer } from "../../../../utils/api.utils";
import PersonView from "./components/PersonView";

interface Props {
  params: { id: string };
}

const AdminPersonViewPage = async ({ params }: Props) => {
  const { data: person } = await apiServer.get(`/admin/persons/${params.id}`, {
    headers: {
      cookie: headers().get("cookie") ?? "",
    },
  });

  return <PersonView person={person} />;
};

export default AdminPersonViewPage;

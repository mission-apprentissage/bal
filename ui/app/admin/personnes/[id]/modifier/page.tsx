import { headers } from "next/headers";

import { apiServer } from "../../../../../utils/api.utils";
import PersonUpdate from "./components/PersonUpdate";

interface Props {
  params: { id: string };
}

const AdminPersonUpdatePage = async ({ params }: Props) => {
  const { data: person } = await apiServer.get(`/admin/persons/${params.id}`, {
    headers: {
      cookie: headers().get("cookie") ?? "",
    },
  });

  return <PersonUpdate person={person} />;
};

export default AdminPersonUpdatePage;

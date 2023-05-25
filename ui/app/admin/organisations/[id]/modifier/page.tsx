import { headers } from "next/headers";

import { apiServer } from "../../../../../utils/api.utils";
import OrganisationUpdate from "./components/OrganisationUpdate";

interface Props {
  params: { id: string };
}

const AdminOrganisationUpdatePage = async ({ params }: Props) => {
  const { data: organisation } = await apiServer.get(
    `/admin/organisations/${params.id}`,
    {
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }
  );

  return <OrganisationUpdate organisation={organisation} />;
};

export default AdminOrganisationUpdatePage;

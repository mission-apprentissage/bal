import { headers } from "next/headers";

import { api } from "@/utils/api.utils";

import OrganisationView from "./components/OrganisationView";

interface Props {
  params: { id: string };
}

const AdminOrganisationViewPage = async ({ params }: Props) => {
  const { data: organisation } = await api.get(
    `/api/admin/organisations/${params.id}`,
    {
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }
  );

  return <OrganisationView organisation={organisation} />;
};

export default AdminOrganisationViewPage;

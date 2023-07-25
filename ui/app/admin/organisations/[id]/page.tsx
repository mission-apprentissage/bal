import { headers } from "next/headers";

import { apiGet } from "@/utils/api.utils";

import OrganisationView from "./components/OrganisationView";

interface Props {
  params: { id: string };
}

const AdminOrganisationViewPage = async ({ params }: Props) => {
  const organisation = await apiGet(
    `/admin/organisations/:id`,
    {
      params,
    },
    {
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }
  );

  return <OrganisationView organisation={organisation} />;
};

export default AdminOrganisationViewPage;

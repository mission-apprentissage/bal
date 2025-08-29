import OrganisationView from "./components/OrganisationView";
import { apiGet } from "@/utils/api.utils";

interface Props {
  params: Promise<{ id: string }>;
}

const AdminOrganisationViewPage = async ({ params }: Props) => {
  const { id } = await params;
  const organisation = await apiGet(`/admin/organisations/:id`, {
    params: { id },
  });

  return <OrganisationView organisation={organisation} />;
};

export default AdminOrganisationViewPage;

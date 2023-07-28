import { apiGet } from "@/utils/api.utils";

import PersonView from "./components/PersonView";

interface Props {
  params: { id: string };
}

const AdminPersonViewPage = async ({ params }: Props) => {
  const person = await apiGet(`/admin/persons/:id`, {
    params,
  });

  return <PersonView person={person} />;
};

export default AdminPersonViewPage;

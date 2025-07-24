import PersonView from "./components/PersonView";
import { apiGet } from "@/utils/api.utils";

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

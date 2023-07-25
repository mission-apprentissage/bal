import { headers } from "next/headers";

import { apiGet } from "@/utils/api.utils";

import PersonView from "./components/PersonView";

interface Props {
  params: { id: string };
}

const AdminPersonViewPage = async ({ params }: Props) => {
  const person = await apiGet(
    `/admin/persons/:id`,
    {
      params,
    },
    {
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }
  );

  return <PersonView person={person} />;
};

export default AdminPersonViewPage;

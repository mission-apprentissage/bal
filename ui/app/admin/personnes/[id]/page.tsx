import { apiGet } from "@/utils/api.utils"
import PersonView from "./components/PersonView"

interface Props {
  params: Promise<{ id: string }>
}

const AdminPersonViewPage = async ({ params }: Props) => {
  const { id } = await params
  const person = await apiGet(`/admin/persons/:id`, {
    params: { id },
  })

  return <PersonView person={person} />
}

export default AdminPersonViewPage

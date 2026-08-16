import { apiGet } from "@/utils/api.utils"
import UserView from "./components/UserView"

interface Props {
  params: Promise<{ id: string }>
}

const AdminUserViewPage = async ({ params }: Props) => {
  const { id } = await params
  const user = await apiGet(`/admin/users/:id`, { params: { id } })

  return <UserView user={user} />
}

export default AdminUserViewPage

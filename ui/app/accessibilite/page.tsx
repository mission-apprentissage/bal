import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb"
import Accessibilite from "./components/Accessibilite"

const AccessibilitePage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.accessibilite()]} />
      <Accessibilite />
    </>
  )
}
export default AccessibilitePage

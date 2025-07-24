import Accessibilite from "./components/Accessibilite";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const AccessibilitePage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.accessibilite()]} />
      <Accessibilite />
    </>
  );
};
export default AccessibilitePage;

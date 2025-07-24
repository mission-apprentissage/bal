import PolitiqueConfidentialite from "./components/PolitiqueConfidentialite";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const PolitiqueConfidentialitePage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.politiqueConfidentialite()]} />
      <PolitiqueConfidentialite />
    </>
  );
};
export default PolitiqueConfidentialitePage;

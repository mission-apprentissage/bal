import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import PolitiqueConfidentialite from "./components/PolitiqueConfidentialite";

const PolitiqueConfidentialitePage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.politiqueConfidentialite()]} />
      <PolitiqueConfidentialite />
    </>
  );
};
export default PolitiqueConfidentialitePage;

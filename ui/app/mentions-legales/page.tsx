"use client";

import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import MentionsLegales from "./components/MentionLegales";

const MentionsLegalesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.mentionsLegales()]} />
      <MentionsLegales />
    </>
  );
};
export default MentionsLegalesPage;

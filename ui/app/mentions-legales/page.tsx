"use client";

import MentionsLegales from "./components/MentionLegales";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const MentionsLegalesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.mentionsLegales()]} />
      <MentionsLegales />
    </>
  );
};
export default MentionsLegalesPage;

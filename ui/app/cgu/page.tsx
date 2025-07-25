"use client";

import Cgu from "./components/Cgu";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const CGUPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.cgu()]} />
      <Cgu />
    </>
  );
};
export default CGUPage;

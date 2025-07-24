"use client";

import DonneesPersonnelles from "./components/DonneesPersonnelles";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const DonneesPersonnellesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.donneesPersonnelles()]} />
      <DonneesPersonnelles />
    </>
  );
};
export default DonneesPersonnellesPage;

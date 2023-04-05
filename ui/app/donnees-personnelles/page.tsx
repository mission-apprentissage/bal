"use client";

import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import DonneesPersonnelles from "./components/DonneesPersonnelles";

const DonneesPersonnellesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.donneesPersonnelles()]} />
      <DonneesPersonnelles />
    </>
  );
};
export default DonneesPersonnellesPage;

"use client"

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb"
import DonneesPersonnelles from "./components/DonneesPersonnelles"

const DonneesPersonnellesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.donneesPersonnelles()]} />
      <DonneesPersonnelles />
    </>
  )
}
export default DonneesPersonnellesPage

"use client"

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb"
import Cgu from "./components/Cgu"

const CGUPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.cgu()]} />
      <Cgu />
    </>
  )
}
export default CGUPage

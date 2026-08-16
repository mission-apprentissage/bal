"use client"

import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb"
import MentionsLegales from "./components/MentionLegales"

const MentionsLegalesPage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.mentionsLegales()]} />
      <MentionsLegales />
    </>
  )
}
export default MentionsLegalesPage

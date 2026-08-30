"use client"

import { PAGES } from "@/app/components/breadcrumb/Breadcrumb"
import { Redirect } from "@/components/Redirect"

const UsagePage = () => {
  // redirect to first tab
  return <Redirect to={PAGES.usageApiValidation().path} />
}

export default UsagePage

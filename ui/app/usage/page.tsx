"use client";

import { useRouter } from "next/navigation";

import { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

const UsagePage = () => {
  const { push } = useRouter();

  // redirect to first tab
  push(PAGES.usageApiValidation().path);

  return null;
};

export default UsagePage;

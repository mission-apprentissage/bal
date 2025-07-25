"use client";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import type { FC, PropsWithChildren } from "react";

import type { Page } from "@/app/components/breadcrumb/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb, { PAGES } from "@/app/components/breadcrumb/Breadcrumb";

interface Tab extends Page {
  secure?: boolean;
}

const tabs: Tab[] = [{ ...PAGES.usageApiValidation(), secure: true }, PAGES.usageApiHealthcheck()];

const UsageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();
  const selectedTabId = tabs.find((tab) => pathname.startsWith(tab.path))?.path ?? tabs[0].path;

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.usageApi()]} />
      <Typography variant="h2" gutterBottom>
        Tester l'API
      </Typography>
      <Tabs
        selectedTabId={selectedTabId}
        tabs={tabs.map((tab) => ({
          tabId: tab.path,
          label: tab.title,
          ...(tab?.secure && { iconId: "fr-icon-lock-fill" }),
        }))}
        onTabChange={push}
      >
        {children}
      </Tabs>
    </>
  );
};

export default UsageLayout;

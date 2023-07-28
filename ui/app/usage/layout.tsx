"use client";
import { Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import { useAuth } from "../../context/AuthContext";
import { LockFill } from "../../theme/icons/LockFill";
import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";

const tabs = [
  { ...PAGES.usageApiValidation(), secure: true },
  PAGES.usageApiHealthcheck(),
];

const UsageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();
  const index = tabs.findIndex((tab) => tab.path === pathname);

  const handleChange = (index: number) => {
    push(tabs[index].path);
  };

  if (!user) {
    push("/auth/connexion");
    return null;
  }

  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.usageApi()]} />
      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Tester l'API
      </Heading>
      <Tabs mb={8} index={index} onChange={handleChange}>
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.path}>
              {tab.title}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(tab as any).secure && (
                <LockFill color={"grey.625"} boxSize="4" ml={2} mb="0.250em" />
              )}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      {children}
    </>
  );
};

export default UsageLayout;

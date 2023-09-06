"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { FC, useRef } from "react";

import { publicConfig } from "../config.public";
import { theme } from "../theme/theme";
import { queryClient } from "../utils/query.utils";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import Section from "./components/section/Section";

interface Props {
  children: React.ReactNode;
}

const RootTemplate: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams?.get("notracking") !== "true");

  return (
    <PlausibleProvider trackLocalhost={false} enabled={tracking.current} domain={publicConfig.host}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <MuiDsfrThemeProvider>
              <Header />
              <Section>{children}</Section>
              <Footer />
            </MuiDsfrThemeProvider>
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

export default RootTemplate;

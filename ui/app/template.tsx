"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { FC, useRef } from "react";

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
  const tracking = useRef(searchParams.get("notracking") !== "true");

  return (
    <PlausibleProvider
      trackLocalhost={false}
      enabled={tracking.current}
      domain={`${process.env.NEXT_PUBLIC_BASE_HOST}`}
    >
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <Header />
            <Box minH={"40vh"}>
              <Section my={8}>{children}</Section>
            </Box>
            <Footer />
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

export default RootTemplate;

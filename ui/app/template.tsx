"use client";

import { Box, Container } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import type { FC } from "react";
import { useRef } from "react";

import Footer from "./components/Footer";
import { Header } from "./components/header/Header";
import { publicConfig } from "@/config.public";
import { queryClient } from "@/utils/query.utils";

interface Props {
  children: React.ReactNode;
}

const RootTemplate: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams?.get("notracking") !== "true");

  return (
    <PlausibleProvider trackLocalhost={false} enabled={tracking.current} domain={publicConfig.host}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Container maxWidth="xl">
          <Box minHeight="60vh">{children}</Box>
        </Container>
        <Footer />
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

export default RootTemplate;

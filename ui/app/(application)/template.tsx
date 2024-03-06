"use client";

import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { Box } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { publicConfig } from "config.public";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { FC, useRef } from "react";
import { queryClient } from "utils/query.utils";

import Footer from "./components/Footer";
import { Header } from "./components/header/Header";

interface Props {
  children: React.ReactNode;
}

const RootTemplate: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams?.get("notracking") !== "true");

  return (
    <PlausibleProvider trackLocalhost={false} enabled={tracking.current} domain={publicConfig.host}>
      <QueryClientProvider client={queryClient}>
        <MuiDsfrThemeProvider>
          <Header />
          <Box minHeight="60vh">{children}</Box>
          <Footer />
        </MuiDsfrThemeProvider>
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

export default RootTemplate;

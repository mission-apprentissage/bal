"use client";
import "./globals.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { FC, useRef } from "react";

import { theme } from "../theme/theme";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import Section from "./components/section/Section";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams.get("notracking") !== "true");

  return (
    <html lang="fr">
      <head>
        <PlausibleProvider
          trackLocalhost={false}
          enabled={tracking.current}
          domain="bal.apprentissage.beta.gouv.fr"
        />
      </head>
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <Header />
            <Box minH={"40vh"}>
              <Section my={8}>{children}</Section>
            </Box>
            <Footer />
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;

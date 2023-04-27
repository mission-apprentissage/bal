"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  Box,
  ChakraProvider,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Metadata } from "next";
import PlausibleProvider from "next-plausible";

import { NotFound } from "../theme/icons/NotFound";
import { theme } from "../theme/theme";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import Section from "./components/section/Section";

export const metadata: Metadata = {
  title: "404",
};

export default async function NotFoundPage() {
  return (
    <PlausibleProvider
      trackLocalhost={false}
      domain={`${process.env.NEXT_PUBLIC_BASE_HOST}`}
    >
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <Header />
          <Box minH={"40vh"}>
            <Section my={8}>
              <Box
                w="100%"
                pt={[4, 8]}
                px={[1, 1, 6, 8]}
                color="grey.800"
                paddingY="4w"
              >
                <Box
                  border="1px solid"
                  borderColor="#E3E3FD"
                  padding="4w"
                  marginTop="6w"
                  w="100%"
                >
                  <Stack alignItems="center" spacing="4w">
                    <NotFound />
                    <Heading fontSize="28px" fontWeight="bold">
                      Page non trouvée
                    </Heading>
                    <Text color="grey.800" fontSize="zeta" marginBottom="2w">
                      La page que vous recherchez n’existe pas ou a été déplacée
                    </Text>

                    <Link
                      href="/"
                      _hover={{
                        textDecoration: "none",
                        color: "grey.800",
                        background: "galt",
                      }}
                      color="bluefrance"
                    >
                      <Box
                        as="i"
                        className="ri-arrow-left-line"
                        marginRight="1w"
                        verticalAlign="middle"
                      />
                      <Box as="span" verticalAlign="middle">
                        Retourner à la page d&apos;accueil
                      </Box>
                    </Link>
                  </Stack>
                </Box>
              </Box>
            </Section>
          </Box>
          <Footer />
        </ChakraProvider>
      </CacheProvider>
    </PlausibleProvider>
  );
}

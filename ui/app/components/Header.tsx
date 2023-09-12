import { Box, Container, Flex, Heading, HStack, Img, Text, VStack } from "@chakra-ui/react";

import Link from "../../components/link/Link";
import { useAuth } from "../../context/AuthContext";
import { AccountFill } from "../../theme/icons/AccountFill";
import LoggedIn from "./LoggedIn";
import { Nav } from "./Nav";

export const Header = () => {
  const { user } = useAuth();

  return (
    <VStack
      zIndex={1}
      spacing="0"
      divider={<Box width="100%" borderBottom="1px solid" borderBottomColor="grey.850" />}
      align={"start"}
      boxShadow="0 2px 3px rgba(0,0,18,0.16)"
    >
      <HStack as={Container} py={2} maxWidth={"container.xl"}>
        <HStack as={Link} spacing={10} align="center" href="/">
          <Img src="/images/logo_gouvernement.svg" />
          <Heading as={"h1"} size={"md"}>
            BAL
          </Heading>
        </HStack>
        <Flex justifyContent="flex-end" width="full">
          {!user ? (
            <Link href="/auth/connexion" variant="pill" px={3} py={1}>
              <Text lineHeight={6}>
                <AccountFill boxSize={5} mr={2} />
                Se connecter
              </Text>
            </Link>
          ) : (
            <LoggedIn user={user} />
          )}
        </Flex>
      </HStack>
      <Container maxWidth={"container.xl"}>
        <Nav />
      </Container>
    </VStack>
  );
};

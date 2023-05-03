"use client";

import { Heading, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import NextLink from "next/link";

import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";

const UsagePage = () => {
  return (
    <>
      <Breadcrumb pages={[PAGES.homepage(), PAGES.usageApi()]} />

      <Heading as="h2" fontSize="2xl" mb={[3, 6]}>
        Usage API
      </Heading>

      <UnorderedList>
        <ListItem>
          <Link href="/usage/validation" as={NextLink}>
            Validation
          </Link>
        </ListItem>
      </UnorderedList>
    </>
  );
};

export default UsagePage;

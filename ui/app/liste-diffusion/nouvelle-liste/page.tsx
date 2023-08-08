"use client";
import { Heading } from "@chakra-ui/react";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import Form from "./components/Form";

const NouvelleListePage = () => {
  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.listeDiffusion(),
          PAGES.nouvelleListe(),
        ]}
      />

      <Heading as="h2" fontSize="2xl" mt={8}>
        Créer nouvelle liste
      </Heading>

      <Form onSuccess={() => {}} />
    </>
  );
};

export default NouvelleListePage;

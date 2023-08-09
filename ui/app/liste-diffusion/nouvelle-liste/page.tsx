"use client";
import { Heading } from "@chakra-ui/react";
import { IBody, IPostRoutes } from "shared";

import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
// import ChoixColonnesIdentifiant from "./components/ChoixColonnesIdentifiant";
import ChoixSource from "./components/ChoixSource";

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

      <ChoixSource
        onSuccess={({ source }: IBody<IPostRoutes["/mailing-list"]>) => {
          console.log(source);
        }}
      />
      {/* <ChoixColonnesIdentifiant
        onSuccess={({ source }: IBody<IPostRoutes["/mailing-list"]>) => {
          console.log(source);
        }}
      /> */}
    </>
  );
};

export default NouvelleListePage;

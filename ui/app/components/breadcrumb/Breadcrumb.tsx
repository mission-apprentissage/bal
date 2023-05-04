import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import NavLink from "next/link";
import React, { FC } from "react";

import ArrowDropRightLine from "../../../theme/icons/ArrowDropRightLine";

export const PAGES = {
  homepage: () => ({
    title: "Accueil",
    path: "/",
  }),
  mentionsLegales: () => ({
    title: "Mentions Légales",
    path: "/mentions-legales",
  }),
  accessibilite: () => ({
    title: "Accessibilité",
    path: "/accessibilite",
  }),
  cgu: () => ({
    title: "Conditions Générales d'Utilisation",
    path: "/cgu",
  }),
  donneesPersonnelles: () => ({
    title: "Données Personnelles",
    path: "/donnees-personnelles",
  }),
  politiqueConfidentialite: () => ({
    title: "Politique de Confidentialité",
    path: "/politique-confidentialite",
  }),
  connexion: () => ({
    title: "Se connecter",
    path: "/connexion",
  }),
  motDePasseOublie: () => ({
    title: "Mot de passe oublié",
    path: "/mot-de-passe-oublie",
  }),
  modifierMotDePasse: () => ({
    title: "Modifier mon mot de passe",
    path: "/modifier-mot-de-passe",
  }),
  adminFichier: () => ({
    title: "Fichier source",
    path: "/admin/fichier",
  }),
  adminImport: () => ({
    title: "Import de fichier",
    path: "/admin/fichier/import",
  }),
  usageApi: () => ({
    title: "API",
    path: "/usage",
  }),
  usageApiValidation: () => ({
    title: "Vérification appartenance",
    path: "/usage/validation",
  }),
  usageApiHealthcheck: () => ({
    title: "Healthcheck",
    path: "/usage/healthcheck",
  }),
};

interface Page {
  title: string;
  path?: string;
}

interface Props {
  pages: Page[];
}

const Breadcrumb: FC<Props> = ({ pages }) => {
  return (
    <ChakraBreadcrumb
      separator={<ArrowDropRightLine color="grey.600" boxSize={3} mb={1} />}
      textStyle="xs"
      color={"grey.800"}
      mb={4}
    >
      {pages?.map((page, index) => {
        if (index === pages.length - 1 || !page.path) {
          return (
            <BreadcrumbItem key={page.title} isCurrentPage>
              <BreadcrumbLink
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                cursor="default"
              >
                {page.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        } else {
          return (
            <BreadcrumbItem key={page.title}>
              <BreadcrumbLink
                as={NavLink}
                href={page.path}
                color={"grey.600"}
                textDecoration="underline"
                _focus={{
                  boxShadow: "0 0 0 3px #2A7FFE",
                  outlineColor: "#2A7FFE",
                }}
                _focusVisible={{ outlineColor: "#2A7FFE" }}
              >
                {page.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        }
      })}
    </ChakraBreadcrumb>
  );
};

export default Breadcrumb;

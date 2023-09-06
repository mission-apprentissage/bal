import { Header as DSFRHeader } from "@codegouvfr/react-dsfr/Header";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";

import { useAuth } from "../../context/AuthContext";
import { PAGES } from "./breadcrumb/Breadcrumb";

export const Header = () => {
  const { user } = useAuth();

  let navigation: MainNavigationProps.Item[] = [
    {
      isActive: true,
      text: "Accueil",
      linkProps: {
        href: "/",
      },
    },
  ];

  if (user) {
    navigation = [
      ...navigation,
      {
        text: "API",
        menuLinks: [
          {
            linkProps: {
              href: PAGES.usageApiValidation().path,
            },
            text: PAGES.usageApiValidation().title,
          },
          {
            linkProps: {
              href: PAGES.usageApiHealthcheck().path,
            },
            text: PAGES.usageApiHealthcheck().title,
          },
        ],
      },
      {
        text: PAGES.listeDiffusion().title,
        linkProps: {
          href: PAGES.listeDiffusion().path,
        },
      },
    ];
  }

  if (user?.is_admin) {
    navigation = [
      ...navigation,
      {
        text: "Administration",
        menuLinks: [
          {
            text: PAGES.adminUsers().title,
            linkProps: {
              href: PAGES.adminUsers().path,
            },
          },
          {
            text: PAGES.adminPersons().title,
            linkProps: {
              href: PAGES.adminPersons().path,
            },
          },
          {
            text: PAGES.adminOrganisations().title,
            linkProps: {
              href: PAGES.adminOrganisations().path,
            },
          },
          {
            text: PAGES.adminFichier().title,
            linkProps: {
              href: PAGES.adminFichier().path,
            },
          },
        ],
      },
    ];
  }

  return (
    <DSFRHeader
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - BAL",
      }}
      quickAccessItems={[
        user
          ? {
              linkProps: {
                href: PAGES.compteProfil().path,
              },
              iconId: "ri-account-box-line",
              text: "Mon compte",
            }
          : {
              iconId: "ri-account-box-line",
              linkProps: {
                href: PAGES.connexion().path,
              },
              text: "Se connecter",
            },
      ]}
      serviceTitle="BAL"
      navigation={navigation}
    />
  );
};

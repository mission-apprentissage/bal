import {
  Header as DSFRHeader,
  HeaderProps,
} from "@codegouvfr/react-dsfr/Header";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/navigation";

import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api.utils";
import { PAGES } from "./breadcrumb/Breadcrumb";

export const Header = () => {
  const { user, setUser } = useAuth();
  const { push } = useRouter();

  const handleLogout = async () => {
    await apiGet("/auth/logout", {});
    setUser();
    push("/");
  };

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

  const loggedOut: HeaderProps.QuickAccessItem[] = [
    {
      iconId: "ri-account-box-line",
      linkProps: {
        href: PAGES.connexion().path,
      },
      text: "Se connecter",
    },
  ];

  const loggedIn: HeaderProps.QuickAccessItem[] = [
    {
      linkProps: {
        href: PAGES.compteProfil().path,
      },
      iconId: "ri-account-box-line",
      text: "Mon compte",
    },
    {
      buttonProps: {
        onClick: handleLogout,
      },
      text: "Se deconnecter",
      iconId: "ri-logout-box-line",
    },
  ];

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
      quickAccessItems={user ? loggedIn : loggedOut}
      serviceTitle="BAL"
      navigation={navigation}
    />
  );
};

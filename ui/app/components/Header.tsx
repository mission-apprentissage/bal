import { Header as DSFRHeader, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../utils/api.utils";
import { PAGES } from "./breadcrumb/Breadcrumb";

export const Header = () => {
  const { user, setUser } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await apiGet("/auth/logout", {});
    setUser();
    push(PAGES.homepage().path);
  };

  let navigation: MainNavigationProps.Item[] = [
    {
      isActive: pathname === PAGES.homepage().path,
      text: "Accueil",
      linkProps: {
        href: PAGES.homepage().path,
      },
    },
  ];

  if (user) {
    navigation = [
      ...navigation,
      {
        text: "API",
        isActive: [PAGES.usageApiValidation().path, PAGES.usageApiHealthcheck().path].includes(pathname),
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
        isActive: pathname === PAGES.listeDiffusion().path,
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
        isActive: [
          PAGES.adminUsers().path,
          PAGES.adminPersons().path,
          PAGES.adminOrganisations().path,
          PAGES.adminFichier().path,
        ].includes(pathname),
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
      iconId: "fr-icon-lock-line",
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
      iconId: "fr-icon-account-line",
      text: "Mon compte",
    },
    {
      buttonProps: {
        onClick: handleLogout,
      },
      text: "Se deconnecter",
      iconId: "fr-icon-logout-box-r-line",
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

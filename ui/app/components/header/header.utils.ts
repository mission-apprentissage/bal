import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { IUserPublic } from "shared/models/user.model";

import { PAGES } from "../breadcrumb/Breadcrumb";

interface GetNavigationItemsProps {
  user?: IUserPublic;
  pathname: string;
}

export const getNavigationItems = ({ user, pathname }: GetNavigationItemsProps): MainNavigationProps.Item[] => {
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
            isActive: pathname === PAGES.usageApiValidation().path,
            text: PAGES.usageApiValidation().title,
          },
          {
            linkProps: {
              href: PAGES.usageApiHealthcheck().path,
            },
            isActive: pathname === PAGES.usageApiHealthcheck().path,
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
            isActive: pathname === PAGES.adminUsers().path,
            linkProps: {
              href: PAGES.adminUsers().path,
            },
          },
          {
            text: PAGES.adminPersons().title,
            isActive: pathname === PAGES.adminPersons().path,
            linkProps: {
              href: PAGES.adminPersons().path,
            },
          },
          {
            text: PAGES.adminOrganisations().title,
            isActive: pathname === PAGES.adminOrganisations().path,
            linkProps: {
              href: PAGES.adminOrganisations().path,
            },
          },
          {
            text: PAGES.adminFichier().title,
            isActive: pathname === PAGES.adminFichier().path,
            linkProps: {
              href: PAGES.adminFichier().path,
            },
          },
        ],
      },
    ];
  }

  return navigation.map((item) => {
    const { menuLinks } = item;

    const menuLinkWithActive = menuLinks?.map((link) => ({ ...link, isActive: link.linkProps.href === pathname }));
    const isActive = pathname === item.linkProps?.href || menuLinkWithActive?.some((link) => link.isActive);

    return { ...item, isActive, menuLinks };
  }) as MainNavigationProps.Item[];
};

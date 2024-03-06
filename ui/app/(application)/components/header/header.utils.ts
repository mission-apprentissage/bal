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
    {
      isActive: pathname === PAGES.cerfa().path,
      text: PAGES.cerfa().title,
      linkProps: {
        href: PAGES.cerfa().path,
      },
    },
  ];

  if (user?.is_admin) {
    navigation = [
      ...navigation,
      {
        text: "Administration",
        isActive: [PAGES.adminUsers().path, PAGES.adminFichier().path].includes(pathname),
        menuLinks: [
          {
            text: PAGES.adminUsers().title,
            isActive: pathname === PAGES.adminUsers().path,
            linkProps: {
              href: PAGES.adminUsers().path,
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

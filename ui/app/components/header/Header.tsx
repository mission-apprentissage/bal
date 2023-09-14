import { Header as DSFRHeader, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../../../context/AuthContext";
import { apiGet } from "../../../utils/api.utils";
import { PAGES } from "../breadcrumb/Breadcrumb";
import { getNavigationItems } from "./header.utils";

export const Header = () => {
  const { user, setUser } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await apiGet("/auth/logout", {});
    setUser();
    push(PAGES.homepage().path);
  };

  const navigation = getNavigationItems({ user, pathname });

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

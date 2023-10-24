import { Breadcrumb as DSFRBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import React, { FC } from "react";

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
    path: "/auth/connexion",
  }),
  motDePasseOublie: () => ({
    title: "Mot de passe oublié",
    path: "/auth/mot-de-passe-oublie",
  }),
  modifierMotDePasse: () => ({
    title: "Modifier mon mot de passe",
    path: "/modifier-mot-de-passe",
  }),
  compteProfil: () => ({
    title: "Mon profil",
    path: "/compte/profil",
  }),
  nouveauDossier: () => ({
    title: "Nouveau dossier",
    path: "/dossiers/nouveau",
  }),
  adminFichier: () => ({
    title: "Gestion des fichiers",
    path: "/admin/fichier",
  }),
  adminImport: () => ({
    title: "Import de fichier",
    path: "/admin/fichier/import",
  }),
  adminUsers: () => ({
    title: "Gestion des utilisateurs",
    path: "/admin/utilisateurs",
  }),
  adminUserView: (id: string) => ({
    title: "Fiche utilisateur",
    path: `/admin/utilisateurs/${id}`,
  }),
  cerfa: () => ({
    title: "Cerfa",
    path: "/cerfa",
  }),
};

export interface Page {
  title: string;
  path: string;
}

interface Props {
  pages: Page[];
}

const Breadcrumb: FC<Props> = ({ pages }) => {
  const currentPage = pages.pop();

  return (
    <DSFRBreadcrumb
      currentPageLabel={currentPage?.title}
      homeLinkProps={{
        href: PAGES.homepage().path,
      }}
      segments={pages.map((page) => ({
        label: page.title,
        linkProps: {
          href: page.path,
        },
      }))}
    />
  );
};

export default Breadcrumb;

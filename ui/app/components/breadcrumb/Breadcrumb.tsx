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
    path: `/admin/utilisateur/${id}`,
  }),
  adminPersons: () => ({
    title: "Gestion des personnes",
    path: "/admin/personnes",
  }),
  adminViewPerson: (id: string) => ({
    title: "Fiche personne",
    path: `/admin/personnes/${id}`,
  }),
  adminOrganisations: () => ({
    title: "Gestion des organisations",
    path: "/admin/organisations",
  }),
  adminViewOrganisation: (id: string) => ({
    title: "Fiche organisation",
    path: `/admin/organisations/${id}`,
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
  listeDiffusion: () => ({
    title: "Liste de diffusion",
    path: "/liste-diffusion",
  }),
  nouvelleListe: () => ({
    title: "Créer une nouvelle liste",
    path: "/liste-diffusion/nouvelle-liste",
  }),
};

interface Page {
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

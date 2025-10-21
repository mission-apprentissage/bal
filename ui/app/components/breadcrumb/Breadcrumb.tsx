import { Breadcrumb as DSFRBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import type { FC } from "react";
import React from "react";

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
    path: `/admin/utilisateurs/${id}`,
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
  mailingList: () => ({
    title: "Listes de diffusion",
    path: "/mailing-list",
  }),
  mailingListCreate: () => ({
    title: "Créer une liste de diffusion",
    path: "/mailing-list/create",
  }),
  mailingListView: (id: string) => ({
    title: `Liste de diffusion ${id}`,
    path: `/mailing-list/view/${id}`,
  }),
  listeDepot: () => ({
    title: "Fichiers déposés",
    path: "/support/liste-fichiers",
  }),
  adminProcessor: () => ({
    path: `/admin/processeur`,
    index: false,
    title: "Administration du processeur",
  }),
  adminProcessorJob: (name: string) => ({
    path: `/admin/processeur/job/${name}`,
    index: false,
    title: `Job ${name}`,
  }),
  adminProcessorJobInstance: (params: { name: string; id: string }) => ({
    path: `/admin/processeur/job/${params.name}/${params.id}`,
    index: false,
    title: `Tâche Job ${params.id}`,
  }),
  adminProcessorCron: (name: string) => ({
    path: `/admin/processeur/cron/${name}`,
    index: false,
    title: `CRON ${name}`,
  }),
  adminProcessorCronTask: (params: { name: string; id: string }) => ({
    path: `/admin/processeur/cron/${params.name}/${params.id}`,
    index: false,
    title: `Tâche CRON ${params.id}`,
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
  const currentPage = pages.at(-1);
  const parentPages = pages.slice(0, -1);

  return (
    <DSFRBreadcrumb
      currentPageLabel={currentPage?.title}
      homeLinkProps={{
        href: PAGES.homepage().path,
      }}
      segments={parentPages.map((page) => ({
        label: page.title,
        linkProps: {
          href: page.path,
        },
      }))}
    />
  );
};

export default Breadcrumb;

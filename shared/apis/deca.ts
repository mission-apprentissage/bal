export interface Contrat {
  alternant: Alternant;
  formation: Formation;
  etablissementFormation: EtablissementFormation;
  organismeFormationResponsable: OrganismeFormationResponsable;
  detailsContrat: DetailsContrat;
  rupture?: Rupture;
  employeur: Employeur;
}

interface Alternant {
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  departementNaissance: string;
  nationalite?: number;
  handicap?: boolean;
  courriel?: string;
  telephone?: string;
  adresse?: Adresse;
  derniereClasse?: string;
}

interface Adresse {
  numero?: number;
  voie?: string;
  codePostal?: string;
}

interface DetailsContrat {
  noContrat: string;
  dateDebutContrat: string;
  statut: Statut;
  dateFinContrat: string;
  dateEffetAvenant: string;
  noAvenant?: string;
}

enum Statut {
  Annule = "Annulé",
  Corrige = "Corrigé",
  Empty = "",
  Rompu = "Rompu",
  Supprime = "Supprimé",
}

interface Employeur {
  codeIdcc: string;
}

interface EtablissementFormation {
  siret?: string; // Organisme responsable
}

interface Formation {
  dateDebutFormation: string;
  dateFinFormation: string;
  codeDiplome: string;
  rncp?: string;
  intituleOuQualification: string;
}

interface OrganismeFormationResponsable {
  uaiCfa?: string;
  siret?: string;
}

interface Rupture {
  dateEffetRupture: string;
}

interface Metadonnees {
  page: number;
  totalPages: number;
  totalElements: number;
}

export type ApiDeca = {
  metadonnees: Metadonnees;
  contrats: Contrat[];
};

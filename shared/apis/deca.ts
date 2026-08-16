/**
 * Payload de l'API Deca.
 *
 * Hormis `detailsContrat.noContrat`, tous les champs feuilles sont optionnels : `buildDecaContract`
 * les lit systématiquement au travers de `ifDefined`, et les fixtures de `hydrate-deca.test.ts`
 * couvrent explicitement le cas d'un contrat quasi vide. Certains champs numériques arrivent tantôt
 * en nombre, tantôt en chaîne, d'où les unions.
 */
export interface Contrat {
  alternant: Alternant
  formation: Formation
  etablissementFormation?: EtablissementFormation
  organismeFormationResponsable: OrganismeFormationResponsable
  detailsContrat: DetailsContrat
  rupture?: Rupture
  employeur: Employeur
  suiviASP?: SuiviASP
}

interface Alternant {
  nom?: string
  prenom?: string
  sexe?: string
  dateNaissance?: string
  departementNaissance?: string
  nationalite?: number | string
  handicap?: boolean | string
  courriel?: string
  telephone?: string
  adresse?: Adresse
  derniereClasse?: string
}

interface Adresse {
  numero?: number | string
  voie?: string
  codePostal?: string
}

interface DetailsContrat {
  noContrat: string
  dateDebutContrat?: string
  statut?: Statut
  dateFinContrat?: string
  dateEffetAvenant?: string
  noAvenant?: string
  typeContrat?: number | string
  dispositif?: string
  dateConclusion?: string
}

// union plutôt qu'un enum : jamais utilisé comme valeur, et un enum refuse les littéraux bruts
type Statut = "Annulé" | "Corrigé" | "" | "Rompu" | "Supprimé"

interface Employeur {
  codeIdcc?: string
  siret?: string
  adresse?: Adresse
  naf?: string
  nombreDeSalaries?: number
  courriel?: string
  telephone?: string
  denomination?: string
  typeEmployeur?: number | string
}

interface EtablissementFormation {
  siret?: string // Organisme responsable
}

interface Formation {
  dateDebutFormation?: string
  dateFinFormation?: string
  codeDiplome?: string
  rncp?: string
  intituleOuQualification?: string
  typeDiplome?: string
}

interface OrganismeFormationResponsable {
  uaiCfa?: string
  siret?: string
}

interface Rupture {
  dateEffetRupture?: string
  codeMotifRupture?: string
  commentaireRupture?: string
  dateSignalement?: string
}

interface SuiviASP {
  drfc?: string
}

interface Metadonnees {
  page: number
  totalPages: number
  totalElements: number
}

export type ApiDeca = {
  metadonnees: Metadonnees
  contrats: Contrat[]
}

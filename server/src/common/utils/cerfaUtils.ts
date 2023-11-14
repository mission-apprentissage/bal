export interface PdfField {
  name: string;
  ref: number;
  type: "PDFTextField" | "PDFCheckBox" | "PDFSignature";
  attribute?: string;
  getValue?: (value: any) => string | boolean;
}

export const pdfFields: PdfField[] = [
  {
    name: "employeur public",
    ref: 603,
    type: "PDFCheckBox",
    attribute: "employeur.privePublic",
    getValue: (value) => value === "public",
  },
  {
    name: "employeur privé",
    ref: 601,
    type: "PDFCheckBox",
    attribute: "employeur.privePublic",
    getValue: (value) => value === "prive",
  },
  {
    name: "Nom et prénom ou dénomination :",
    ref: 604,
    type: "PDFTextField",
    attribute: "employeur.denomination",
  },
  {
    name: "N°SIRET de l’établissement d’exécution du contrat :",
    ref: 605,
    type: "PDFTextField",
    attribute: "employeur.siret",
  },

  { name: "N°", ref: 606, type: "PDFTextField", attribute: "employeur.adresse.numero" },
  { name: "Voie", ref: 607, type: "PDFTextField", attribute: "employeur.adresse.voie" },
  { name: "Complément", ref: 608, type: "PDFTextField", attribute: "employeur.adresse.complement" },
  { name: "Code postal", ref: 609, type: "PDFTextField", attribute: "employeur.adresse.codePostal" },
  { name: "Commune", ref: 610, type: "PDFTextField", attribute: "employeur.adresse.commune" },
  {
    name: "Téléphone",
    ref: 611,
    type: "PDFTextField",
    attribute: "employeur.telephone",
    getValue: (value) => value?.value,
  },
  {
    name: "Courriel 1",
    ref: 612,
    type: "PDFTextField",
    attribute: "employeur.courriel",
    getValue: (value) => (value as string).split("@")[0],
  },
  {
    name: "Courriel 2",
    ref: 613,
    type: "PDFTextField",
    attribute: "employeur.courriel",
    getValue: (value) => (value as string).split("@")[1],
  },
  {
    name: "Effectif total salariés de l’entreprise :",
    ref: 615,
    type: "PDFTextField",
    attribute: "employeur.nombreDeSalaries",
  },
  {
    name: "Code activité de l’entreprise (NAF) :",
    ref: 614,
    type: "PDFTextField",
    attribute: "employeur.naf",
  },
  { name: "Type d’employeur", ref: 616, type: "PDFTextField", attribute: "employeur.typeEmployeur" },
  {
    name: "Code IDCC de la convention collective applicable :",
    ref: 618,
    type: "PDFTextField",
    attribute: "employeur.codeIdcc",
  },
  { name: "Employeur spécifique", ref: 617, type: "PDFTextField", attribute: "employeur.employeurSpecifique" },
  {
    name: "*Pour les employeurs du secteur public, adhésion de l’apprenti au régime spécifique d’assurance chômage :",
    ref: 619,
    type: "PDFCheckBox",
  },

  /**
   * Apprenti
   */
  { name: "Sexe F", ref: 621, type: "PDFCheckBox" },
  { name: "Sexe M", ref: 620, type: "PDFCheckBox" },
  {
    name: "Déclare être inscrit sur la liste des sportifs de haut niveau NON",
    ref: 623,
    type: "PDFCheckBox",
  },
  {
    name: "Déclare être inscrit sur la liste des sportifs de haut niveau OUI",
    ref: 622,
    type: "PDFCheckBox",
  },
  {
    name: "Déclare bénéficier de la reconnaissance travailleur handicapé NON",
    ref: 625,
    type: "PDFCheckBox",
  },
  {
    name: "Déclare bénéficier de la reconnaissance travailleur handicapé OUI",
    ref: 624,
    type: "PDFCheckBox",
  },
  {
    name: "Déclare avoir un projet de création ou de reprise d’entreprise OUI",
    ref: 626,
    type: "PDFCheckBox",
  },
  {
    name: "Déclare avoir un projet de création ou de reprise d’entreprise NON",
    ref: 627,
    type: "PDFCheckBox",
  },

  {
    name: "Nom de naissance de l’apprenti(e) :",
    ref: 628,
    type: "PDFTextField",
  },
  { name: "Nom d’usage", ref: 629, type: "PDFTextField" },
  { name: "NIR de l’apprenti(e)", ref: 631, type: "PDFTextField" },
  { name: "Adresse de l’apprenti(e) N°", ref: 635, type: "PDFTextField" },
  {
    name: "Adresse de l’apprenti(e) Voie",
    ref: 632,
    type: "PDFTextField",
  },
  {
    name: "Adresse de l’apprenti(e) Complément",
    ref: 633,
    type: "PDFTextField",
  },
  { name: "Adresse de l’apprenti(e) CP", ref: 634, type: "PDFTextField" },
  {
    name: "Adresse de l’apprenti(e) Commune",
    ref: 636,
    type: "PDFTextField",
  },
  {
    name: "Adresse de l’apprenti(e) Téléphone",
    ref: 637,
    type: "PDFTextField",
  },
  {
    name: "Adresse de l’apprenti(e) Courriel1",
    ref: 638,
    type: "PDFTextField",
  },
  {
    name: "Adresse de l’apprenti(e) Courriel2",
    ref: 639,
    type: "PDFTextField",
  },
  {
    name: "Le premier prénom de l’apprenti(e) selon l’état civil :",
    ref: 630,
    type: "PDFTextField",
  },
  {
    name: "Département naissance apprenti",
    ref: 648,
    type: "PDFTextField",
  },
  { name: "Nationalité apprenti", ref: 650, type: "PDFTextField" },
  { name: "Régime social apprenti", ref: 651, type: "PDFTextField" },
  { name: "Situation avant ce contrat", ref: 652, type: "PDFTextField" },
  {
    name: "Dernier diplôme ou titre préparé",
    ref: 653,
    type: "PDFTextField",
  },
  { name: "Commune naissance apprenti", ref: 649, type: "PDFTextField" },
  {
    name: "Intitulé précis du dernier diplôme ou titre préparé :",
    ref: 655,
    type: "PDFTextField",
  },
  {
    name: "Dernière classe / année suivie",
    ref: 654,
    type: "PDFTextField",
  },
  {
    name: "Diplôme ou titre le plus élevé obtenu",
    ref: 656,
    type: "PDFTextField",
  },
  {
    name: "Représentant légal Nom / Prénom",
    ref: 640,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n° 2Nom de naissance",
    ref: 658,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Nom de naissance",
    ref: 657,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal Courriel1",
    ref: 646,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal Courriel2",
    ref: 647,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Prénom",
    ref: 659,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 NIR",
    ref: 660,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Courriel1",
    ref: 661,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Courriel2",
    ref: 662,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Prénom",
    ref: 665,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 NIR",
    ref: 666,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Courriel1",
    ref: 667,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Courriel2",
    ref: 668,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Courriel2suite",
    ref: 669,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Emploi occupé :",
    ref: 670,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Courriel2suite",
    ref: 663,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Emploi occupé :",
    ref: 664,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Diplôme ou titre le plus élevé obtenu :",
    ref: 103,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1Diplôme ou titre le plus élevé obtenu :",
    ref: 105,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Niveau de diplôme ou titre le plus élevé obtenu :",
    ref: 106,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Niveau de diplôme ou titre le plus élevé obtenu :",
    ref: 104,
    type: "PDFTextField",
  },
  { name: "Type de dérogation :", ref: 110, type: "PDFTextField" },
  {
    name: "Date de début d’exécution du contrat : _af_date",
    ref: 114,
    type: "PDFTextField",
  },
  {
    name: "Date de début de formation pratique chez l’employeur : _af_date",
    ref: 124,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°1 Date naissance_af_date",
    ref: 672,
    type: "PDFTextField",
  },
  {
    name: "Maître d’apprentissage n°2 Date naissance_af_date",
    ref: 671,
    type: "PDFTextField",
  },
  {
    name: "Apprenti Date naissance_af_date",
    ref: 673,
    type: "PDFTextField",
  },
  {
    name: "Date de conclusion : _af_date",
    ref: 113,
    type: "PDFTextField",
  },
  {
    name: "Si avenant, date d’effet :_af_date",
    ref: 121,
    type: "PDFTextField",
  },
  {
    name: "ate de fin du contrat ou de la période d'apprentissage_af_date",
    ref: 111,
    type: "PDFTextField",
  },
  {
    name: "Type de contrat ou d’avenant :",
    ref: 107,
    type: "PDFTextField",
  },
  {
    name: "Durée hebdomadaire du travail  heure",
    ref: 112,
    type: "PDFTextField",
  },
  {
    name: "Durée hebdomadaire du travail  minutes",
    ref: 115,
    type: "PDFTextField",
  },
  {
    name: "Travail sur machines dangereuses ou exposition à des risques particuliers : NON",
    ref: 122,
    type: "PDFCheckBox",
  },
  {
    name: "Numéro du contrat précédent ou du contrat sur lequel porte l’avenant :",
    ref: 116,
    type: "PDFTextField",
  },
  {
    name: "Salaire brut mensuel à l’embauche :",
    ref: 108,
    type: "PDFTextField",
  },
  {
    name: "Caisse de retraite complémentaire :",
    ref: 117,
    type: "PDFTextField",
  },
  {
    name: "Avantages en nature, le cas échéant : Nourriture",
    ref: 118,
    type: "PDFTextField",
  },
  {
    name: "Avantages en nature, le cas échéant : Logement",
    ref: 123,
    type: "PDFTextField",
  },
  {
    name: "Avantages en nature, le cas échéant : Autre",
    ref: 109,
    type: "PDFTextField",
  },
  {
    name: "Travail sur machines dangereuses ou exposition à des risques particuliers : OUI",
    ref: 120,
    type: "PDFCheckBox",
  },
  { name: "CFA d’entreprise NON", ref: 127, type: "PDFCheckBox" },
  {
    name: "Adresse du représentant légal N°",
    ref: 641,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal Voie",
    ref: 642,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal Complément",
    ref: 643,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal CP",
    ref: 644,
    type: "PDFTextField",
  },
  {
    name: "Adresse du représentant légal Commune",
    ref: 645,
    type: "PDFTextField",
  },
  { name: "CFA d’entreprise OUI", ref: 119, type: "PDFCheckBox" },
  {
    name: "Visa du CFA (cachet et signature du directeur) :",
    ref: 126,
    type: "PDFSignature",
  },
  {
    name: "Si le CFA responsable est le lieu de formation principal cochez la case ci-contre",
    ref: 132,
    type: "PDFCheckBox",
  },
  {
    name: "L’employeur atteste disposer de l’ensemble des pièces justificatives nécessaires au dépôt du contrat",
    ref: 52,
    type: "PDFCheckBox",
  },
  { name: "Fait à", ref: 53, type: "PDFTextField" },
  { name: "Signature de l’employeur", ref: 51, type: "PDFSignature" },
  { name: "Signature de l’apprenti(e)", ref: 54, type: "PDFSignature" },
  {
    name: "Signature du représentant légal de l’apprenti(e) mineur(e)",
    ref: 50,
    type: "PDFSignature",
  },
  {
    name: "Adresse du CFA responsable N°",
    ref: 130,
    type: "PDFTextField",
  },
  {
    name: "Adresse du CFA responsable Complément",
    ref: 125,
    type: "PDFTextField",
  },
  {
    name: "Adresse du CFA responsable CP",
    ref: 129,
    type: "PDFTextField",
  },
  {
    name: "Adresse du CFA responsable Commune",
    ref: 131,
    type: "PDFTextField",
  },
  {
    name: "Adresse du lieu de formation principal : N°",
    ref: 55,
    type: "PDFTextField",
  },
  {
    name: "Adresse du lieu de formation principal : Complément",
    ref: 69,
    type: "PDFTextField",
  },
  {
    name: "Adresse du lieu de formation principal : CP",
    ref: 59,
    type: "PDFTextField",
  },
  {
    name: "Adresse du lieu de formation principal : Commune",
    ref: 60,
    type: "PDFTextField",
  },
  {
    name: "Adresse du lieu de formation principal : Voie",
    ref: 56,
    type: "PDFTextField",
  },
  { name: "N° SIRET :", ref: 62, type: "PDFTextField" },
  {
    name: "Dénomination du lieu de formation principal :",
    ref: 70,
    type: "PDFTextField",
  },
  {
    name: "Date prévue de fin des épreuves ou examens :_af_date",
    ref: 71,
    type: "PDFTextField",
  },
  {
    name: "Date de début de formation en CFA :  _af_date",
    ref: 72,
    type: "PDFTextField",
  },
  { name: "N° UAI :", ref: 64, type: "PDFTextField" },
  { name: "Code RNCP", ref: 65, type: "PDFTextField" },
  { name: "Code du diplôme", ref: 57, type: "PDFTextField" },
  {
    name: "Diplôme ou titre visé par l’apprenti : Intitulé précis :",
    ref: 58,
    type: "PDFTextField",
  },
  {
    name: "Diplôme ou titre visé par l’apprenti :",
    ref: 61,
    type: "PDFTextField",
  },
  { name: "Durée de la formation :", ref: 73, type: "PDFTextField" },
  {
    name: "Adresse du CFA responsable Voie",
    ref: 128,
    type: "PDFTextField",
  },
  {
    name: "Dénomination du CFA responsable :",
    ref: 66,
    type: "PDFTextField",
  },
  { name: "N° UAI du CFA", ref: 63, type: "PDFTextField" },
  { name: "N° SIRET CFA", ref: 67, type: "PDFTextField" },
  {
    name: "Rémunération - 2e  année, du _af_date",
    ref: 84,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 3e  année, du _af_date",
    ref: 92,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 4e  année, du _af_date",
    ref: 89,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 2e  année, au_af_date",
    ref: 87,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 3e  année, au_af_date",
    ref: 77,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 4e  année, au_af_date",
    ref: 93,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 1re  année, du _af_date",
    ref: 68,
    type: "PDFTextField",
  },
  {
    name: "Rémunération - 1re  année, au_af_date",
    ref: 101,
    type: "PDFTextField",
  },
  { name: "1e année % du", ref: 161, type: "PDFTextField" },
  { name: "1e année % du *", ref: 162, type: "PDFTextField" },
  { name: "1e année du_af_date", ref: 98, type: "PDFTextField" },
  { name: "1e année au_af_date", ref: 76, type: "PDFTextField" },
  { name: "2e année du_af_date", ref: 100, type: "PDFTextField" },
  { name: "3e année du_af_date", ref: 86, type: "PDFTextField" },
  { name: "4e année du_af_date", ref: 94, type: "PDFTextField" },
  { name: "2e année au_af_date", ref: 78, type: "PDFTextField" },
  { name: "3e année au_af_date", ref: 80, type: "PDFTextField" },
  { name: "4e année au_af_date", ref: 95, type: "PDFTextField" },
  { name: "2e année % du", ref: 163, type: "PDFTextField" },
  { name: "3e année % du", ref: 164, type: "PDFTextField" },
  { name: "4e année % du", ref: 165, type: "PDFTextField" },
  { name: "2e année % du *", ref: 166, type: "PDFTextField" },
  { name: "3e année % du *", ref: 167, type: "PDFTextField" },
  { name: "4e année % du *", ref: 168, type: "PDFTextField" },
];

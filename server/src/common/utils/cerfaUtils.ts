export interface PdfField {
  name: string;
  ref: number;
  type: "PDFTextField" | "PDFCheckBox" | "PDFSignature";
  attribute: string;
  getValue?: (value: any) => string | boolean;
}

export const pdfFields: PdfField[] = [
  { type: "PDFTextField", name: "mode contractuel", ref: 830, attribute: "contrat.modeContractuel" },
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
    attribute: "",
  },

  /**
   * Apprenti
   */

  { name: "Sexe F", ref: 621, type: "PDFCheckBox", attribute: "apprenti.sexe", getValue: (value) => value === "F" },
  { name: "Sexe M", ref: 620, type: "PDFCheckBox", attribute: "apprenti.sexe", getValue: (value) => value === "M" },
  {
    name: "Déclare être inscrit sur la liste des sportifs de haut niveau NON",
    ref: 623,
    type: "PDFCheckBox",
    attribute: "apprenti.inscriptionSportifDeHautNiveau",
    getValue: (value) => value === "non",
  },
  {
    name: "Déclare être inscrit sur la liste des sportifs de haut niveau OUI",
    ref: 622,
    type: "PDFCheckBox",
    attribute: "apprenti.inscriptionSportifDeHautNiveau",
    getValue: (value) => value === "oui",
  },
  {
    name: "Déclare bénéficier de la reconnaissance travailleur handicapé NON",
    ref: 625,
    type: "PDFCheckBox",
    attribute: "apprenti.handicap",
    getValue: (value) => value === "non",
  },
  {
    name: "Déclare bénéficier de la reconnaissance travailleur handicapé OUI",
    ref: 624,
    type: "PDFCheckBox",
    attribute: "apprenti.handicap",
    getValue: (value) => value === "oui",
  },
  {
    name: "Déclare avoir un projet de création ou de reprise d’entreprise OUI",
    ref: 626,
    type: "PDFCheckBox",
    attribute: "apprenti.projetCreationRepriseEntreprise",
    getValue: (value) => value === "oui",
  },
  {
    name: "Déclare avoir un projet de création ou de reprise d’entreprise NON",
    ref: 627,
    type: "PDFCheckBox",
    attribute: "apprenti.projetCreationRepriseEntreprise",
    getValue: (value) => value === "non",
  },
  {
    name: "Nom de naissance de l’apprenti(e) :",
    ref: 628,
    type: "PDFTextField",
    attribute: "apprenti.nom",
  },
  { name: "Nom d’usage", ref: 629, type: "PDFTextField", attribute: "apprenti.nomUsage" },
  { name: "NIR de l’apprenti(e)", ref: 631, type: "PDFTextField", attribute: "apprenti.nir" },
  {
    name: "Adresse de l’apprenti(e) N°",
    ref: 635,
    type: "PDFTextField",
    attribute: "apprenti.adresse.numero",
  },
  {
    name: "Adresse de l’apprenti(e) Voie",
    ref: 632,
    type: "PDFTextField",
    attribute: "apprenti.adresse.voie",
  },
  {
    name: "Adresse de l’apprenti(e) Complément",
    ref: 633,
    type: "PDFTextField",
    attribute: "apprenti.adresse.complement",
  },
  { name: "Adresse de l’apprenti(e) CP", ref: 634, type: "PDFTextField", attribute: "apprenti.adresse.codePostal" },
  {
    name: "Adresse de l’apprenti(e) Commune",
    ref: 636,
    type: "PDFTextField",
    attribute: "apprenti.adresse.commune",
  },
  {
    name: "Adresse de l’apprenti(e) Téléphone",
    ref: 637,
    type: "PDFTextField",
    attribute: "apprenti.telephone",
    getValue: (value) => value?.value,
  },
  {
    name: "Adresse de l’apprenti(e) Courriel1",
    ref: 638,
    type: "PDFTextField",
    attribute: "apprenti.courriel",
    getValue: (value) => (value as string).split("@")[0],
  },
  {
    name: "Adresse de l’apprenti(e) Courriel2",
    ref: 639,
    type: "PDFTextField",
    attribute: "apprenti.courriel",
    getValue: (value) => (value as string).split("@")[1],
  },
  {
    name: "Le premier prénom de l’apprenti(e) selon l’état civil :",
    ref: 630,
    type: "PDFTextField",
    attribute: "apprenti.prenom",
  },
  {
    name: "Département naissance apprenti",
    ref: 648,
    type: "PDFTextField",
    attribute: "apprenti.departementNaissance",
  },
  { name: "Nationalité apprenti", ref: 650, type: "PDFTextField", attribute: "apprenti.nationalite" },
  { name: "Régime social apprenti", ref: 651, type: "PDFTextField", attribute: "apprenti.regimeSocial" },
  { name: "Situation avant ce contrat", ref: 652, type: "PDFTextField", attribute: "apprenti.situationAvantContrat" },
  {
    name: "Dernier diplôme ou titre préparé",
    ref: 653,
    type: "PDFTextField",
    attribute: "apprenti.diplomePrepare",
  },
  { name: "Commune naissance apprenti", ref: 649, type: "PDFTextField", attribute: "apprenti.communeNaissance" },
  {
    name: "Intitulé précis du dernier diplôme ou titre préparé :",
    ref: 655,
    type: "PDFTextField",
    attribute: "apprenti.intituleDiplomePrepare",
  },
  {
    name: "Dernière classe / année suivie",
    ref: 654,
    type: "PDFTextField",
    attribute: "apprenti.derniereClasse",
  },
  {
    name: "Diplôme ou titre le plus élevé obtenu",
    ref: 656,
    type: "PDFTextField",
    attribute: "apprenti.diplome",
  },
  {
    name: "Représentant légal Nom / Prénom",
    ref: 640,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.nom",
  },
  {
    name: "Maître d’apprentissage n° 2Nom de naissance",
    ref: 658,
    type: "PDFTextField",
    attribute: "maitre2.nom",
  },
  {
    name: "Maître d’apprentissage n°1 Nom de naissance",
    ref: 657,
    type: "PDFTextField",
    attribute: "maitre1.nom",
  },
  { type: "PDFCheckBox", name: "employeur atteste", ref: 837, attribute: "maitre1.attestationEligibilite" },
  {
    name: "Adresse du représentant légal Courriel1",
    ref: 646,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.courriel",
    getValue: (value) => (value as string).split("@")[0],
  },
  {
    name: "Adresse du représentant légal Courriel2",
    ref: 647,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.courriel",
    getValue: (value) => (value as string).split("@")[1],
  },
  {
    name: "Maître d’apprentissage n°1 Prénom",
    ref: 659,
    type: "PDFTextField",
    attribute: "maitre1.prenom",
  },
  {
    name: "Maître d’apprentissage n°1 NIR",
    ref: 660,
    type: "PDFTextField",
    attribute: "maitre1.nir",
  },
  {
    name: "Maître d’apprentissage n°1 Courriel1",
    ref: 661,
    type: "PDFTextField",
    attribute: "maitre1.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      if (atPos < 24) return (value as string).split("@")[0];
      return value.substring(0, 24);
    },
  },
  {
    name: "Maître d’apprentissage n°1 Courriel2",
    ref: 662,
    type: "PDFTextField",
    attribute: "maitre1.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      const part2 = (value as string).split("@")[1];
      if (atPos < 24) {
        if (part2.length < 10) return part2;
        return part2.substring(0, 10);
      }
      return value.substring(24, 99).substring(0, 10);
    },
  },
  {
    name: "Maître d’apprentissage n°2 Prénom",
    ref: 665,
    type: "PDFTextField",
    attribute: "maitre2.prenom",
  },
  {
    name: "Maître d’apprentissage n°2 NIR",
    ref: 666,
    type: "PDFTextField",
    attribute: "maitre2.nir",
  },
  {
    name: "Maître d’apprentissage n°2 Courriel1",
    ref: 667,
    type: "PDFTextField",
    attribute: "maitre2.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      if (atPos < 24) return (value as string).split("@")[0];
      return value.substring(0, 24);
    },
  },
  {
    name: "Maître d’apprentissage n°2 Courriel2",
    ref: 668,
    type: "PDFTextField",
    attribute: "maitre2.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      const part2 = (value as string).split("@")[1];
      if (atPos < 24) {
        if (part2.length < 10) return part2;
        return part2.substring(0, 10);
      }
      return value.substring(24, 99).substring(0, 10);
    },
  },
  {
    name: "Maître d’apprentissage n°2 Courriel2suite",
    ref: 669,
    type: "PDFTextField",
    attribute: "maitre2.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      const part2 = (value as string).split("@")[1];
      if (atPos < 24) {
        return part2.substring(10, 99);
      }
      return value.substring(33, 99);
    },
  },
  {
    name: "Maître d’apprentissage n°2 Emploi occupé :",
    ref: 670,
    type: "PDFTextField",
    attribute: "maitre2.emploiOccupe",
  },
  {
    name: "Maître d’apprentissage n°1 Courriel2suite",
    ref: 663,
    type: "PDFTextField",
    attribute: "maitre1.courriel",
    getValue: (value) => {
      const atPos = value.indexOf("@");
      const part2 = (value as string).split("@")[1];
      if (atPos < 24) {
        return part2.substring(10, 99);
      }
      return value.substring(33, 99);
    },
  },
  {
    name: "Maître d’apprentissage n°1 Emploi occupé :",
    ref: 664,
    type: "PDFTextField",
    attribute: "maitre1.emploiOccupe",
  },
  {
    name: "Maître d’apprentissage n°2 Diplôme ou titre le plus élevé obtenu :",
    ref: 103,
    type: "PDFTextField",
    attribute: "maitre2.diplome",
  },
  {
    name: "Maître d’apprentissage n°1Diplôme ou titre le plus élevé obtenu :",
    ref: 105,
    type: "PDFTextField",
    attribute: "maitre1.diplome",
  },
  {
    name: "Maître d’apprentissage n°2 Niveau de diplôme ou titre le plus élevé obtenu :",
    ref: 106,
    type: "PDFTextField",
    attribute: "maitre2.niveauDiplome",
  },
  {
    name: "Maître d’apprentissage n°1 Niveau de diplôme ou titre le plus élevé obtenu :",
    ref: 104,
    type: "PDFTextField",
    attribute: "maitre1.niveauDiplome",
  },
  { name: "Type de dérogation :", ref: 110, type: "PDFTextField", attribute: "contrat.typeDerogation" },
  {
    name: "Date de début d’exécution du contrat : _af_date",
    ref: 114,
    type: "PDFTextField",
    attribute: "contrat.dateDebutContrat",
  },
  {
    name: "Date de début de formation pratique chez l’employeur : _af_date",
    ref: 124,
    type: "PDFTextField",
    attribute: "contrat.dateDebutFormationPratique",
  },
  {
    name: "Maître d’apprentissage n°1 Date naissance_af_date",
    ref: 672,
    type: "PDFTextField",
    attribute: "maitre1.dateNaissance",
  },
  {
    name: "Maître d’apprentissage n°2 Date naissance_af_date",
    ref: 671,
    type: "PDFTextField",
    attribute: "maitre2.dateNaissance",
  },
  {
    name: "Apprenti Date naissance_af_date",
    ref: 673,
    type: "PDFTextField",
    attribute: "apprenti.dateNaissance",
  },
  {
    name: "Date de conclusion : _af_date",
    ref: 113,
    type: "PDFTextField",
    attribute: "contrat.dateSignature",
  },
  {
    name: "Si avenant, date d’effet :_af_date",
    ref: 121,
    type: "PDFTextField",
    attribute: "contrat.dateEffetAvenant",
  },
  {
    name: "ate de fin du contrat ou de la période d'apprentissage_af_date",
    ref: 111,
    type: "PDFTextField",
    attribute: "contrat.dateFinContrat",
  },
  {
    name: "Type de contrat ou d’avenant :",
    ref: 107,
    type: "PDFTextField",
    attribute: "contrat.typeContratApp",
  },
  {
    name: "Durée hebdomadaire du travail  heure",
    ref: 112,
    type: "PDFTextField",
    attribute: "contrat.dureeTravailHebdoHeures",
  },
  {
    name: "Durée hebdomadaire du travail  minutes",
    ref: 115,
    type: "PDFTextField",
    attribute: "contrat.dureeTravailHebdoMinutes",
  },
  {
    name: "Travail sur machines dangereuses ou exposition à des risques particuliers : NON",
    ref: 122,
    type: "PDFCheckBox",
    attribute: "contrat.travailRisque",
    getValue: (value) => value === "non",
  },
  {
    name: "Numéro du contrat précédent ou du contrat sur lequel porte l’avenant :",
    ref: 116,
    type: "PDFTextField",
    attribute: "contrat.numeroContratPrecedent",
  },
  {
    name: "Salaire brut mensuel à l’embauche :",
    ref: 108,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.11.salaireBrut",
  },
  {
    name: "Caisse de retraite complémentaire :",
    ref: 117,
    type: "PDFTextField",
    attribute: "contrat.caisseRetraiteSupplementaire",
  },
  {
    name: "Avantages en nature, le cas échéant : Nourriture",
    ref: 118,
    type: "PDFTextField",
    attribute: "contrat.avantageNourriture",
  },
  {
    name: "Avantages en nature, le cas échéant : Logement",
    ref: 123,
    type: "PDFTextField",
    attribute: "contrat.avantageLogement",
  },
  {
    name: "Avantages en nature, le cas échéant : Autre",
    ref: 109,
    type: "PDFTextField",
    attribute: "contrat.autreAvantageEnNature",
    getValue: (value) => (value ? "ok" : ""),
  },
  {
    name: "Travail sur machines dangereuses ou exposition à des risques particuliers : OUI",
    ref: 120,
    type: "PDFCheckBox",
    attribute: "contrat.travailRisque",
    getValue: (value) => value === "oui",
  },
  {
    name: "CFA d’entreprise NON",
    ref: 127,
    type: "PDFCheckBox",
    attribute: "organismeFormation.formationInterne",
    getValue: (value) => value === "non",
  },
  {
    name: "Adresse du représentant légal N°",
    ref: 641,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.adresse.numero",
  },
  {
    name: "Adresse du représentant légal Voie",
    ref: 642,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.adresse.voie",
  },
  {
    name: "Adresse du représentant légal Complément",
    ref: 643,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.adresse.complement",
  },
  {
    name: "Adresse du représentant légal CP",
    ref: 644,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.adresse.codePostal",
  },
  {
    name: "Adresse du représentant légal Commune",
    ref: 645,
    type: "PDFTextField",
    attribute: "apprenti.responsableLegal.adresse.commune",
  },
  {
    name: "CFA d’entreprise OUI",
    ref: 119,
    type: "PDFCheckBox",
    attribute: "organismeFormation.formationInterne",
    getValue: (value) => value === "oui",
  },
  {
    name: "Visa du CFA (cachet et signature du directeur) :",
    ref: 126,
    type: "PDFSignature",
    attribute: "",
  },
  {
    name: "Si le CFA responsable est le lieu de formation principal cochez la case ci-contre",
    ref: 132,
    type: "PDFCheckBox",
    attribute: "etablissementFormation.memeResponsable",
    getValue: (value) => value === "oui",
  },
  {
    name: "L’employeur atteste disposer de l’ensemble des pièces justificatives nécessaires au dépôt du contrat",
    ref: 52,
    type: "PDFCheckBox",
    attribute: "signatures.attestationPiecesJustificatives",
  },
  { name: "Fait à", ref: 53, type: "PDFTextField", attribute: "signatures.lieu" },
  { name: "Signature de l’employeur", ref: 51, type: "PDFSignature", attribute: "" },
  { name: "Signature de l’apprenti(e)", ref: 54, type: "PDFSignature", attribute: "" },
  {
    name: "Signature du représentant légal de l’apprenti(e) mineur(e)",
    ref: 50,
    type: "PDFSignature",
    attribute: "",
  },
  {
    name: "Adresse du CFA responsable N°",
    ref: 130,
    type: "PDFTextField",
    attribute: "organismeFormation.adresse.numero",
  },
  {
    name: "Adresse du CFA responsable Complément",
    ref: 125,
    type: "PDFTextField",
    attribute: "organismeFormation.adresse.complement",
  },
  {
    name: "Adresse du CFA responsable CP",
    ref: 129,
    type: "PDFTextField",
    attribute: "organismeFormation.adresse.codePostal",
  },
  {
    name: "Adresse du CFA responsable Commune",
    ref: 131,
    type: "PDFTextField",
    attribute: "organismeFormation.adresse.commune",
  },
  {
    name: "Adresse du lieu de formation principal : N°",
    ref: 55,
    type: "PDFTextField",
    attribute: "etablissementFormation.adresse.numero",
  },
  {
    name: "Adresse du lieu de formation principal : Complément",
    ref: 69,
    type: "PDFTextField",
    attribute: "etablissementFormation.adresse.complement",
  },
  {
    name: "Adresse du lieu de formation principal : CP",
    ref: 59,
    type: "PDFTextField",
    attribute: "etablissementFormation.adresse.codePostal",
  },
  {
    name: "Adresse du lieu de formation principal : Commune",
    ref: 60,
    type: "PDFTextField",
    attribute: "etablissementFormation.adresse.commune",
  },
  {
    name: "Adresse du lieu de formation principal : Voie",
    ref: 56,
    type: "PDFTextField",
    attribute: "etablissementFormation.adresse.voie",
  },
  {
    name: "N° SIRET :",
    ref: 62,
    type: "PDFTextField",
    attribute: "etablissementFormation.siret",
  },
  {
    name: "Dénomination du lieu de formation principal :",
    ref: 70,
    type: "PDFTextField",
    attribute: "etablissementFormation.denomination",
  },
  {
    name: "Date prévue de fin des épreuves ou examens :_af_date",
    ref: 71,
    type: "PDFTextField",
    attribute: "formation.dateFinFormation",
  },
  {
    name: "Date de début de formation en CFA :  _af_date",
    ref: 72,
    type: "PDFTextField",
    attribute: "formation.dateDebutFormation",
  },
  { name: "N° UAI :", ref: 64, type: "PDFTextField", attribute: "etablissementFormation.uaiCfa" },
  { name: "Code RNCP", ref: 65, type: "PDFTextField", attribute: "formation.rncp" },
  { name: "Code du diplôme", ref: 57, type: "PDFTextField", attribute: "formation.codeDiplome" },
  {
    name: "Diplôme ou titre visé par l’apprenti : Intitulé précis :",
    ref: 58,
    type: "PDFTextField",
    attribute: "formation.intituleQualification",
  },
  {
    name: "Diplôme ou titre visé par l’apprenti :",
    ref: 61,
    type: "PDFTextField",
    attribute: "formation.typeDiplome",
  },
  { name: "Durée de la formation :", ref: 73, type: "PDFTextField", attribute: "formation.dureeFormation" },
  {
    name: "Adresse du CFA responsable Voie",
    ref: 128,
    type: "PDFTextField",
    attribute: "organismeFormation.adresse.voie",
  },
  {
    name: "Dénomination du CFA responsable :",
    ref: 66,
    type: "PDFTextField",
    attribute: "organismeFormation.denomination",
  },
  { name: "N° UAI du CFA", ref: 63, type: "PDFTextField", attribute: "organismeFormation.uaiCfa" },
  { name: "N° SIRET CFA", ref: 67, type: "PDFTextField", attribute: "organismeFormation.siret" },
  ///// 1er Année
  {
    name: "Rémunération - 1re  année, du _af_date",
    ref: 68,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.11.dateDebut",
  },
  {
    name: "Rémunération - 1re  année, au_af_date",
    ref: 101,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.11.dateFin",
  },
  {
    name: "1e année % du",
    ref: 161,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.11.taux",
  },
  {
    name: "1e année % du *",
    ref: 162,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.11.typeSalaire",
  },
  {
    name: "1e année du_af_date",
    ref: 98,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.12.dateDebut",
  },
  {
    name: "1e année au_af_date",
    ref: 76,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.12.dateFin",
  },
  {
    name: "1e année % du1",
    type: "PDFTextField",
    ref: 90,
    attribute: "contrat.remunerationsAnnuelles.12.taux",
  },
  {
    name: "1e année % du *1",
    type: "PDFTextField",
    ref: 83,
    attribute: "contrat.remunerationsAnnuelles.12.typeSalaire",
  },
  ////// 2eme année
  {
    name: "Rémunération - 2e  année, du _af_date",
    ref: 84,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.21.dateDebut",
  },
  {
    name: "Rémunération - 2e  année, au_af_date",
    ref: 87,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.21.dateFin",
  },
  {
    name: "2e année % du",
    ref: 163,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.21.taux",
  },
  {
    name: "2e année % du *",
    ref: 166,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.21.typeSalaire",
  },
  {
    name: "2e année du_af_date",
    ref: 100,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.22.dateDebut",
  },
  {
    name: "2e année au_af_date",
    ref: 78,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.22.dateFin",
  },
  {
    type: "PDFTextField",
    name: "2e année % du1",
    ref: 79,
    attribute: "contrat.remunerationsAnnuelles.22.taux",
  },
  {
    type: "PDFTextField",
    name: "2e année % du *1",
    ref: 81,
    attribute: "contrat.remunerationsAnnuelles.22.typeSalaire",
  },
  ////// 3eme année
  {
    name: "Rémunération - 3e  année, du _af_date",
    ref: 92,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.31.dateDebut",
  },
  {
    name: "Rémunération - 3e  année, au_af_date",
    ref: 77,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.31.dateFin",
  },
  {
    name: "3e année % du",
    ref: 164,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.31.taux",
  },
  {
    name: "3e année % du *",
    ref: 167,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.31.typeSalaire",
  },
  {
    name: "3e année du_af_date",
    ref: 86,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.32.dateDebut",
  },
  {
    name: "3e année au_af_date",
    ref: 80,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.32.dateFin",
  },
  {
    type: "PDFTextField",
    name: "3e année % du1",
    ref: 88,
    attribute: "contrat.remunerationsAnnuelles.32.taux",
  },
  {
    type: "PDFTextField",
    name: "3e année % du *1",
    ref: 75,
    attribute: "contrat.remunerationsAnnuelles.32.typeSalaire",
  },
  ////// 4eme année
  {
    name: "Rémunération - 4e  année, du _af_date",
    ref: 89,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.41.dateDebut",
  },
  {
    name: "Rémunération - 4e  année, au_af_date",
    ref: 93,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.41.dateFin",
  },
  {
    name: "4e année % du",
    ref: 165,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.41.taux",
  },
  {
    name: "4e année % du *",
    ref: 168,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.41.typeSalaire",
  },
  {
    name: "4e année du_af_date",
    ref: 94,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.42.dateDebut",
  },
  {
    name: "4e année au_af_date",
    ref: 95,
    type: "PDFTextField",
    attribute: "contrat.remunerationsAnnuelles.42.dateFin",
  },
  {
    type: "PDFTextField",
    name: "4e année % du1",
    ref: 133,
    attribute: "contrat.remunerationsAnnuelles.42.taux",
  },
  {
    type: "PDFTextField",
    name: "4e année % du *1",
    ref: 134,
    attribute: "contrat.remunerationsAnnuelles.42.typeSalaire",
  },
];

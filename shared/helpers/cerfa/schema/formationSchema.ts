import { DIPLOMES } from "shared/constants/diplomes";

import { CerfaFields } from "../types/cerfa.types";

export const formationSchema: CerfaFields = {
  "organismeFormation.formationInterne": {
    label: "Le centre de formation est-il un CFA d’entreprise ?",
    fieldType: "radio",
    required: true,
    completion: false,
    requiredMessage: "Merci de préciser s'il sagit d'un CFA d'entreprise",
    options: [
      {
        label: "Oui",
        value: "oui",
      },
      {
        label: "Non",
        value: "non",
      },
    ],
    messages: [
      {
        type: "assistive",
        content: `Si votre apprenti suit sa formation théorique auprès d'un organisme extérieur à votre entreprise, l'établissement de formation n'est pas un CFA d'entreprise et vous devez cocher "non".`,
      },
      {
        type: "bonus",
        content: `Un CFA d'entreprise est interne à l’entreprise ou constitué par plusieurs entreprises partageant des perspectives communes d’évolution des métiers ou qui interviennent dans des secteurs d’activité complémentaires.
Les CFA d'entreprise sont souvent des organismes qui forment pour de grands groupes.`,
      },
    ],
  },
  "organismeFormation.siret": {
    label: "N° SIRET du CFA responsable",
    placeholder: "Exemple : 98765432400019",
    required: true,
    requiredMessage: "Le siret est obligatoire",
    validateMessage: "n'est pas un siret valide",
    showsOverlay: true,
    mask: "00000000000000",
    messages: [
      {
        type: "assistive",
        content: `Vous devez renseigner le siret du CFA responsable. Le lieu principal de formation sera quant-à lui précisé dans d'autres champs ci-dessous.`,
        collapse: {
          label: "En savoir plus",
          content: `Le siret comporte 14 chiffres. Il doit être présent et actif dans la base [Entreprises de l'INSEE](https://www.sirene.fr/sirene/public/accueil) (regroupant employeurs privés et publics).`,
        },
      },
      {
        type: "bonus",
        content: `En tant qu'entreprise signataire, vous pouvez donner mandat à l'organisme de formation signataire de compléter le contrat d'apprentissage (le mandat couvre les opérations prévues à l’[article L. 6224-1 du code du travail](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038951657)).

Dans ce cas, il faudra cocher cette information dans la convention de formation assortie à ce contrat et qui sera fournie par l'organisme de formation (modèle de convention en annexe 2 du [Précis de l'apprentissage](https://travail-emploi.gouv.fr/demarches-ressources-documentaires/documentation-et-publications-officielles/guides/precis-apprentissage)).`,
      },
    ],
  },
  "organismeFormation.uaiCfa": {
    label: "N° UAI du CFA",
    placeholder: "Exemple : 0561910X",
    fieldType: "text",
    required: true,
    showInfo: true,
    requiredMessage: "Le N° UAI de l'organisme est obligatoire",
    validateMessage: "n'est pas un uai valide",
    messages: [
      {
        type: "bonus",
        content:
          "Chaque établissement scolaire (écoles, collèges, lycées, CFA, enseignement supérieur, public ou privé) est une Unité Administrative Immatriculée. Le numéro UAI est autocomplété ; il peut être recherché sur le [catalogue des formations en apprentissage](https://catalogue.apprentissage.beta.gouv.fr).",
      },
    ],
  },
  "organismeFormation.denomination": {
    label: "Dénomination du CFA responsable",
    placeholder: "Exemple : CFA Jean Moulin",
    fieldType: "text",
    required: true,
    requiredMessage: "La dénomination du CFA responsable est obligatoire",
  },
  "formation.rncp": {
    label: "Code RNCP",
    placeholder: "Exemple : 15151",
    fieldType: "text",
    required: true,
    requiredMessage: "Le code RNCP est obligatoire",
    validateMessage: "n'est pas un code RNCP valide. Le code RNCP doit être définit et contenir entre 3 et 5 chiffres",
    mask: "RNCP0[0000]",
    // maskBlocks: [
    //   {
    //     name: "X",
    //     mask: "Pattern",
    //     pattern: "^\\d*$",
    //   },
    // ],
    unmask: false,
    minLength: 7,
    maxLength: 9,
    messages: [
      {
        type: "bonus",
        content: `Le code RNCP peut être recherché sur le site [France compétences](https://www.francecompetences.fr/recherche_certificationprofessionnelle/).
Le code diplôme peut être déduit du code RNCP et à l'inverse, vous pouvez renseigner un code diplôme pour déduire le code RNCP correspondant.`,
      },
    ],
  },
  "formation.codeDiplome": {
    label: "Code diplôme (Éducation Nationale)",
    placeholder: "Exemple : 32332111",
    fieldType: "text",
    required: true,
    requiredMessage: "Le code diplôme est obligatoire",
    validateMessage:
      "n'est pas un code diplôme valide. Le code formation diplôme doit être au format 8 caractères ou 9 avec la lettre specialité",
    mask: "00C00000",
    definitions: {
      C: /[0-9a-zA-Z]/,
    },
    messages: [
      {
        type: "assistive",
        content: `Identification d'un titre ou diplôme préparé par voie d'apprentissage. Il est aussi appelé "code formation diplôme" ou "code scolarité". Plus dinformations sur le [ministère de l'Education Nationale](https://www.education.gouv.fr/codification-des-formations-et-des-diplomes-11270).

Le code diplôme peut être recherché sur le [catalogue des formations en apprentissage](https://catalogue-apprentissage.intercariforef.org/).`,
      },
      {
        type: "bonus",
        content: `Ce code à 8 caractères permet d'identifier un titre ou diplôme préparés par la voie de l'apprentissages.`,
      },
    ],
  },
  "formation.intituleQualification": {
    fieldType: "text",
    required: true,
    label: "Intitulé précis du diplôme ou titre visé par l'apprenti(e)",
    placeholder: "Exemple : CAP Maçon",
    requiredMessage: "L'intitulé du diplôme ou titre est obligatoire",
    validateMessage: " n'est pas un intitulé valide",
  },
  "formation.typeDiplome": {
    label: "Diplôme ou titre visé par l'apprenti(e)",
    fieldType: "select",
    required: true,
    requiredMessage: "Le diplôme ou titre visé est obligatoire",
    validateMessage: " n'est pas un diplôme ou titre valide",
    options: DIPLOMES,
  },

  "organismeFormation.adresse.numero": {
    label: "N°",
    placeholder: "Exemple : 1 ; 2",
    precision: 0,
    fieldType: "number",
    validateMessage: "le numéro de voie ne peut pas commencer par zéro",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "organismeFormation.adresse.repetitionVoie": {
    label: "Indice de répétition",
    placeholder: "Exemple : BIS, A",
    messages: [
      {
        type: "assistive",
        content:
          "Un indice de répétition est une mention qui complète un numéro de rue et permet de différencier plusieurs adresses portant le même numéro dans la même rue. Exemple :  bis, ter, quater, A, B, etc. sont des indices de répétition.",
      },
    ],
  },
  "organismeFormation.adresse.voie": {
    label: "Voie",
    placeholder: "Exemple : RUE MICHELET",
    required: true,
    requiredMessage: "Le nom de voie est obligatoire",
  },
  "organismeFormation.adresse.complement": {
    label: "Complément",
    placeholder: "Exemple : Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service",
  },
  "organismeFormation.adresse.codePostal": {
    label: "Code postal",
    placeholder: "Exemple : 21000",
    required: true,
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "00000",
  },
  "organismeFormation.adresse.commune": {
    label: "Commune",
    placeholder: "Exemple : Dijon",
    required: true,
    requiredMessage: "La commune est obligatoire",
  },
  "etablissementFormation.memeResponsable": {
    fieldType: "radio",
    required: true,
    label: "Si le CFA responsable est le lieu de formation principal, cochez la case ci-contre",
    options: [
      {
        label: "Oui",
        value: "oui",
      },
      {
        label: "Non",
        value: "non",
      },
    ],
  },
  "etablissementFormation.siret": {
    label: "N° SIRET CFA",
    placeholder: "Exemple : 98765432400019",
    requiredMessage: "Le siret est obligatoire",
    validateMessage: "n'est pas un siret valide",
    showsOverlay: true,
    mask: "00000000000000",
    messages: [
      {
        type: "assistive",
        content: `Vous devez renseigner le siret du CFA responsable. Le lieu principal de formation sera quant-à lui précisé dans d'autres champs ci-dessous.`,
        collapse: {
          label: "En savoir plus",
          content: `Le siret comporte 14 chiffres. Il doit être présent et actif dans la base [Entreprises de l'INSEE](https://www.sirene.fr/sirene/public/accueil) (regroupant employeurs privés et publics).`,
        },
      },
    ],
  },
  "etablissementFormation.uaiCfa": {
    label: "N° UAI du CFA",
    placeholder: "Exemple : 0561910X",
    fieldType: "text",
    showInfo: true,
    requiredMessage: "Le numéro UAI est obligatoire",
    validateMessage: "Le numéro UAI n'est pas au format 8 chiffres + 1 lettre",
    messages: [
      {
        type: "bonus",
        content:
          "Chaque établissement scolaire (écoles, collèges, lycées, CFA, enseignement supérieur, public ou privé) est une Unité Administrative Immatriculée. Le numéro UAI est autocomplété.",
        collapse: {
          label: "En savoir plus",
          content: `Il peut être recherché sur le [catalogue des formations en apprentissage](https://catalogue.apprentissage.beta.gouv.fr). Les 3 premiers numéros composant l'UAI correspondent au numéro de département de l'établissement.`,
        },
      },
    ],
  },
  "etablissementFormation.denomination": {
    label: "Dénomination du lieu de formation principal",
    placeholder: "Exemple : CFA Jean Moulin",
    fieldType: "text",
    requiredMessage: "La dénomination du lieu de formation est obligatoire",
  },
  "etablissementFormation.adresse.numero": {
    label: "N°",
    placeholder: "Exemple : 1 ; 2",
    precision: 0,
    fieldType: "number",
    validateMessage: "le numéro de voie ne peut pas commencer par zéro",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "etablissementFormation.adresse.repetitionVoie": {
    label: "Indice de répétition",
    placeholder: "Exemple : BIS, A",
    messages: [
      {
        type: "assistive",
        content:
          "Un indice de répétition est une mention qui complète un numéro de rue et permet de différencier plusieurs adresses portant le même numéro dans la même rue. Exemple :  bis, ter, quater, A, B, etc. sont des indices de répétition.",
      },
    ],
  },
  "etablissementFormation.adresse.voie": {
    label: "Voie",
    placeholder: "Exemple : RUE MICHELET",
    required: true,
    requiredMessage: "Le nom de voie est obligatoire",
  },
  "etablissementFormation.adresse.complement": {
    label: "Complément",
    placeholder: "Exemple : Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service",
  },
  "etablissementFormation.adresse.codePostal": {
    label: "Code postal",
    placeholder: "Exemple : 21000",
    required: true,
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "00000",
  },
  "etablissementFormation.adresse.commune": {
    label: "Commune",
    placeholder: "Exemple : Dijon",
    required: true,
    requiredMessage: "La commune est obligatoire",
  },

  "formation.dateDebutFormation": {
    label: "Date de début de formation en CFA",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de début de cycle est obligatoire",
    validateMessage: " n'est pas une date valide",
    messages: [
      {
        type: "assistive",
        content: "Date du 1er jour où débute effectivement la formation théorique en centre de formation.",
      },
      {
        type: "regulatory",
        content: `Le début de la période de formation au CFA et le début de la période en entreprise ne peuvent intervenir plus de trois mois après le début d'exécution du contrat.`,
      },
    ],
  },
  "formation.dateFinFormation": {
    label: "Date prévue de fin des épreuves ou examens",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de fin de cycle est obligatoire",
    validateMessage: " n'est pas une date valide",
    messages: [
      {
        type: "regulatory",
        content: `La date de fin du contrat doit englober l’ensemble des épreuves nécessaires à l’obtention du titre ou du diplôme. Lorsque la date précise n'est pas connue, il est possible de renseigner une date prévisionnelle avec une marge de 2 mois maximum.`,
        collapse: {
          label: "En savoir plus",
          content: `La date de fin de contrat intervient : 

au plus tôt le dernier jour de la dernière épreuve nécessaire à l’obtention du titre ou diplôme préparé par l'apprenti ;

au plus tard dans les deux mois après la dernière épreuve sanctionnant le cycle, ou à la veille du début du cycle de formation suivant.`,
        },
      },
    ],
  },
  "formation.dureeFormation": {
    label: "Durée de la formation en heures",
    placeholder: "Exemple : 400 (heures)",
    fieldType: "number",
    required: true,
    requiredMessage: "Le nombre d'heures de la formation est obligatoire",
    validateMessage: " n'est pas un nombre d'heures valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
    min: 1,
    messages: [
      {
        type: "regulatory",
        content: `La quotité de formation théorique du contrat d’apprentissage ne peut pas être inférieure à 25% de la durée globale du contrat`,
        collapse: {
          label: "Calcul de quotité",
          content: `Cette quotité de formation est calculée sur la base de la durée légale annuelle de travail, soit 1 607 heures, sauf aménagements spécifiques en cas de pratique du sport à haut niveau ou reconnaissance de handicap.`,
        },
      },
    ],
  },
};

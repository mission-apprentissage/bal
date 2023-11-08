import { INDICE_DE_REPETITION_OPTIONS } from "../domain/indiceRepetitionOptions";

export const employeurSchema = {
  "employeur.privePublic": {
    fieldType: "radio",
    required: true,
    label: "Vous êtes un : ",
    options: [
      {
        label: "Employeur public",
        value: "public",
      },
      {
        label: "Employeur privé",
        value: "prive",
      },
    ],
  },
  "employeur.siret": {
    required: true,
    showInfo: true,
    label: "N° SIRET de l'employeur",
    requiredMessage: "Le siret est obligatoire",
    validateMessage: "n'est pas un siret valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.denomination": {
    required: true,
    label: "Dénomination sociale de l'employeur",
    showInfo: true,
    requiredMessage: "La dénomination de l'employeur est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },

  "employeur.adresse.numero": {
    precision: 0,
    fieldType: "number",
    label: "N° :",
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
  "employeur.adresse.repetitionVoie": {
    fieldType: "select",
    label: "Indice de répétition",
    validateMessage: `n'est pas un indice de répétition valide`,
    options: INDICE_DE_REPETITION_OPTIONS,
  },
  "employeur.adresse.voie": {
    required: true,
    label: "Voie :",
    requiredMessage: "le nom de voie est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.adresse.complement": {
    label: "Complément d'adresse (optionnel):",
    requiredMessage: "le complement d'adress est obligatoire",
  },
  "employeur.adresse.codePostal": {
    required: true,
    label: "Code postal",
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },
  "employeur.adresse.commune": {
    required: true,
    label: "Commune: ",
    requiredMessage: "la commune est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.telephone": {
    fieldType: "phone",
    required: true,
    showInfo: true,
    label: "Téléphone de l'employeur :",
    requiredMessage: "Le téléphone de l'employeur est obligatoire",
  },
  "employeur.courriel": {
    required: true,
    fieldType: "email",
    showInfo: true,
    label: "Courriel de l'employeur :",
    requiredMessage: "Le courriel de l'employeur est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.typeEmployeur": {
    fieldType: "select",
    required: true,
    label: "Type d'employeur :",
    requiredMessage: "Le type d'employeur est obligatoire",
    options: [
      {
        label: "11 Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l’Alsace-Moselle",
        value: "11",
      },
      { label: "12 Entreprise inscrite uniquement au registre du commerce et des sociétés", value: "12" },
      { label: "13 Entreprises dont les salariés relèvent de la mutualité sociale agricole", value: "13" },
      { label: "14 Profession libérale", value: "14" },
      { label: "15 Association", value: "15" },
      { label: "16 Autre employeur privé", value: "16" },
    ],
  },
  "employeur.employeurSpecifique": {
    fieldType: "select",
    required: true,
    completion: false,
    label: "Est un employeur spécifique :",
    options: [
      {
        label: "0 Aucun des cas ci-dessous",
        value: 0,
      },
      {
        label: "1 Entreprise de travail temporaire",
        value: 1,
      },
      {
        label: "2 Groupement d'employeurs",
        value: 2,
      },
      {
        label: "3 Employeur saisonnier",
        value: 3,
      },
      {
        label: "4 Apprentissage familial : l'employeur est un ascendant de l'apprenti",
        value: 4,
      },
    ],
  },
  "employeur.naf": {
    required: true,
    showInfo: true,
    label: "Code NAF de l'employeur :",
    requiredMessage: "le code NAF est obligatoire",
    validateMessage: "le code NAF n'est pas au bon format",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^([0-9]{1,2})\\.?([0-9A-Za-z]{0,3})$",
      },
    ],
  },
  "employeur.nombreDeSalaries": {
    fieldType: "number",
    required: true,
    showInfo: true,
    label: "Effectif salarié de l'entreprise :",
    requiredMessage: "Effectif salarié de l'entreprise est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
    validate: ({ value }: { value: number }) => {
      if (value > 9999999) return { error: "Le nombre de salariés ne peut excéder 9999999" };
    },
  },
  "employeur.codeIdcc_special": {
    fieldType: "radio",
    showInfo: true,
    autosave: false,
    label: "Convention collective appliquée",
    options: [
      {
        label: "9999 - Sans convention collective",
        value: "9999",
      },
      {
        label: "9998 - Convention non encore en vigueur",
        value: "9998",
      },
    ],
  },
  "employeur.codeIdcc": {
    required: true,
    showInfo: true,
    label: "Code IDCC de la convention collective appliquée : ",
    requiredMessage: "le code idcc est obligatoire",
    validateMessage: "le code IDCC n'est pas au bon format",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
  },

  "employeur.libelleIdcc": {
    // required: true ??,
    label: "Libellé de la convention collective appliquée:",
    requiredMessage: "Le libellé de la convention collective est obligatoire",
  },
};

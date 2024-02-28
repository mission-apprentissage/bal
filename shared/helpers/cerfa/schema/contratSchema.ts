import { getLabelNumeroContratPrecedent } from "../domains/contrat/getLabelNumeroContratPrecedent";
import { getSmcMessages } from "../domains/contrat/getSmcMessages";
import { getTypeContratApprentiOptions } from "../domains/contrat/getTypeContratApprentiOptions";
import {
  getTypeDerogationInformationMessages,
  getTypeDerogationOptions,
} from "../domains/contrat/getTypeDerogationOptions";
import { isRequiredNumeroContratPrecedent } from "../domains/contrat/isRequiredNumeroContratPrecedent";
import { shouldAskDateEffetAvenant } from "../domains/contrat/shouldAskDateEffetAvenant";
import { CerfaFields, SelectNestedOption } from "../types/cerfa.types";

export const contratSchema: CerfaFields = {
  "contrat.modeContractuel": {
    label: "Mode contractuel de l’apprentissage",
    fieldType: "select",
    required: true,
    requiredMessage: "Veuillez sélectionner une option",
    options: [
      { label: "1 - durée limitée", value: "1" },
      { label: "2 - dans le cadre d'un CDI", value: "2" },
      { label: "3 - entreprise de travail temporaire", value: "3" },
      { label: "4 - activités saisonnières à deux employeurs", value: "4" },
    ],
    messages: [
      {
        type: "bonus",
        content: `Quand le contrat d'apprentissage est à durée limitée (CDL équivalent à CDD) la fin est appelée "fin de contrat" et dans le cadre d'un contrat CDI, la fin est appelée "fin de période d'apprentissage".`,
      },
    ],
  },
  "contrat.typeContratApp": {
    _init: ({ values }) => ({ options: getTypeContratApprentiOptions({ values }) as SelectNestedOption[] }),
    label: "Type de contrat ou d’avenant",
    fieldType: "select",
    required: true,
    requiredMessage: "Le type de contrat ou d'avenant est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `11 : c'est le tout premier contrat de l'apprenti, il n'a jamais été en apprentissage auparavant et vous serez son 1er employeur en apprentissage
        
21 : le contrat précédent de votre apprenti est arrivé à terme, vous signez ce nouveau contrat d'apprentissage avec lui pour prolonger l'apprentissage dans votre entreprise
        
22 : l'apprenti était en apprentissage chez un autre employeur, son contrat est arrivé à terme et vous signez ce contrat d'apprentissage avec lui
        
23 : l'apprenti était en apprentissage chez un autre employeur mais le contrat a été rompu avant son terme ; vous signez ce contrat d'apprentissage avec lui
        
33 :  vous devrez saisir au moins une nouvelle période de rémunération par rapport à la version précédente du contrat.  Le pourcentage de rémunération de la première période de l’avenant doit être supérieur ou égal au pourcentage de rémunération de la dernière période du contrat qui fait l'objet de cet avenant.`,
      },
    ],
  },
  "contrat.typeDerogation": {
    _init: ({ values }) => ({
      options: getTypeDerogationOptions({ values }),
      messages: getTypeDerogationInformationMessages({ values }),
    }),
    label: "Type de dérogation (optionnel)",
    fieldType: "select",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).

En cas d'allongement ou de réduction de la durée du contrat, le CFA vous enverra une convention d'aménagement à remplir et à signer.`,
      },
    ],
  },
  "contrat.numeroContratPrecedent": {
    _init: ({ values }) => ({
      label: getLabelNumeroContratPrecedent({ values }),
      required: isRequiredNumeroContratPrecedent({ values }),
    }),
    placeholder: "Exemple : 02B202212000000",
    fieldType: "text",
    showInfo: true,
    requiredMessage: "La numéro du contrat précédent est obligatoire",
    validateMessage: "n'est pas un numéro valide",
    mask: "DEP Y M N 0000",
    maskLazy: false,
    maskBlocks: [
      {
        name: "D",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: ["0", "9"],
        maxLength: 1,
      },
      {
        name: "E",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 0,
        to: 9,
        maxLength: 1,
      },
      {
        name: "P",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: ["A", "B", "a", "b", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        maxLength: 1,
      },
      {
        name: "Y",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 1900,
        to: 2999,
        maxLength: 4,
      },
      {
        name: "M",
        mask: "MaskedRange",
        placeholderChar: "_",
        from: 1,
        to: 12,
        maxLength: 2,
      },
      {
        name: "N",
        mask: "MaskedEnum",
        placeholderChar: "_",
        enum: [
          "NC",
          "nc",
          "00",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
          "47",
          "48",
          "49",
          "50",
          "51",
          "52",
          "53",
          "54",
          "55",
          "56",
          "57",
          "58",
          "59",
          "60",
          "61",
          "62",
          "63",
          "64",
          "65",
          "66",
          "67",
          "68",
          "69",
          "70",
          "71",
          "72",
          "73",
          "74",
          "75",
          "76",
          "77",
          "78",
          "79",
          "80",
          "81",
          "82",
          "83",
          "84",
          "85",
          "86",
          "87",
          "88",
          "89",
          "90",
          "91",
          "92",
          "93",
          "94",
          "95",
          "96",
          "97",
          "98",
          "99",
        ],
        maxLength: 2,
      },
    ],
  },

  "contrat.dateDebutContrat": {
    label: "Date de début d'exécution du contrat",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de début d'exécution de contrat est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `Indiquez la date du 1er jour où débute effectivement le contrat (chez l'employeur ou dans le centre de formation).`,
      },
      {
        type: "bonus",
        content: `A partir de cette date, vous avez 5 jours ouvrables pour transmettre le document à votre OPCO (les étapes sur la suite de la procédure seron détaillées lorsque vous téléchargerez le présent document).`,
      },
      {
        type: "regulatory",
        content: `Cette date correspond à la date de début du cycle de formation au sens de [l’article L6222-7-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038951821).`,
      },
    ],
  },
  "contrat.dateDebutFormationPratique": {
    label: "Date de début de formation pratique chez l'employeur",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de début de la formation pratique est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: "Date du 1er jour où débute effectivement la formation pratique chez l’employeur.",
      },
      {
        type: "bonus",
        content:
          "La formation pratique en entreprise doit démarrer au plus tôt 3 mois avant le début des cours et au plus tard 3 mois après le début des cours.",
      },
    ],
  },
  "contrat.dateFinContrat": {
    label: "Date de fin du contrat ou de la période d'apprentissage",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de fin de contrat est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `Le contrat ne peut pas se terminer avant la fin de la formation dans l'organisme de formation, examens compris.

La période de contrat doit donc englober la date du dernier examen qui sanctionne l'obtention du diplôme. 
Si celle-ci n'est pas connue au moment de la conclusion du contrat, vous pouvez renseigner une date située maximum 2 mois au-delà de la date de fin prévisionnelle des examens.`,
        collapse: {
          label: "Détails",
          content: `La date de fin de contrat intervient donc : 

au plus tôt le dernier jour de la dernière épreuve nécessaire à l’obtention du titre ou diplôme préparé par l'apprenti ;

au plus tard dans les deux mois après la dernière épreuve sanctionnant le cycle, ou à la veille du début du cycle de formation suivant.
  
Dans le cadre d’un CDI, vous devez donc également préciser la date de fin de l’action de formation (examens inclus).`,
        },
      },
    ],
  },
  "contrat.dateSignature": {
    label: "Date de signature du présent contrat",
    fieldType: "date",
    required: true,
    requiredMessage: "La date de signature du contrat est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `Date à laquelle le présent contrat de travail (qu’il s’agisse d’un contrat initial ou d’un avenant) est conclu par les deux parties, c'est à dire le jour où les deux signatures des parties au contrat (employeur et apprenti) sont recueillies. 
Le contrat doit être signé avant de débuter.
      `,
      },
    ],
  },
  "contrat.dateEffetAvenant": {
    label: "Date d'effet d'avenant",
    fieldType: "date",
    _init: ({ values }) => ({ required: shouldAskDateEffetAvenant({ values }) }),
    showInfo: true,
    requiredMessage: "S'agissant d'un avenant sa date d'effet est obligatoire ",
    messages: [
      {
        type: "assistive",
        content: "Date à laquelle le changement va s'opérer.",
      },
    ],
  },
  "contrat.dureeTravailHebdoHeures": {
    label: "Heures",
    placeholder: "Exemple : 35",
    fieldType: "text",
    required: true,
    requiredMessage: "La durée hebdomadaire de travail est obligatoire",
    showInfo: true,
    mask: "00",
    messages: [
      {
        type: "regulatory",
        content: `L’horaire collectif de travail de l’entreprise peut être inférieur ou supérieur à 35 heures. 
Toutefois, la durée légale du travail effectif est fixée à 35h par semaine. Dans certains secteurs, quand l'organisation du travail le justifie, elle peut être portée à 40h.
        
Le temps de formation en CFA est du temps de travail effectif et compte dans l'horaire de travail.`,
        collapse: {
          label: "Détails",
          content: `La circulaire n° 2012-15 du 19 juillet 2012 de la DGEFP précise que le Cerfa doit indiquer 35 heures dans le cas de salariés travaillant plus de 35 heures hebdomadaires, les heures au-delà étant récupérées sous forme de RTT.
  
En savoir plus sur la durée du temps de travail de l'apprenti sur le [site du Service Public](https://www.service-public.fr/particuliers/vosdroits/F2918)
  
Les majorations pour heures supplémentaires sont applicables aux apprentis. Toutefois, les apprentis de moins de 18 ans ne peuvent pas effectuer d’heures supplémentaires sauf autorisation de l’inspecteur du travail après avis conforme du médecin du travail.`,
        },
      },
    ],
  },
  "contrat.dureeTravailHebdoMinutes": {
    label: "Minutes",
    fieldType: "text",
    showInfo: true,
    mask: "M0",
    definitions: {
      M: /[0-5]/,
    },
    messages: [
      {
        type: "regulatory",
        content: `L’horaire collectif de travail de l’entreprise peut être inférieur ou supérieur à 35 heures. 
Toutefois, la durée légale du travail effectif est fixée à 35h par semaine. Dans certains secteurs, quand l'organisation du travail le justifie, elle peut être portée à 40h.
        
Le temps de formation en CFA est du temps de travail effectif et compte dans l'horaire de travail.`,
        collapse: {
          label: "Détails",
          content: `La circulaire n° 2012-15 du 19 juillet 2012 de la DGEFP précise que le Cerfa doit indiquer 35 heures dans le cas de salariés travaillant plus de 35 heures hebdomadaires, les heures au-delà étant récupérées sous forme de RTT.
  
En savoir plus sur la durée du temps de travail de l'apprenti sur le [site du Service Public](https://www.service-public.fr/particuliers/vosdroits/F2918)
  
Les majorations pour heures supplémentaires sont applicables aux apprentis. Toutefois, les apprentis de moins de 18 ans ne peuvent pas effectuer d’heures supplémentaires sauf autorisation de l’inspecteur du travail après avis conforme du médecin du travail.`,
        },
      },
    ],
  },
  "contrat.travailRisque": {
    label: "Travail sur machines dangereuses ou exposition à des risques particuliers",
    fieldType: "radio",
    required: true,
    requiredMessage: "Cette déclaration est obligatoire",
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
        type: "regulatory",
        content: `Pour les apprentis mineurs, certaines catégories de travaux ne sont pas autorisées. Dans certains cas spécifiquement prévus par la règlementation, des dérogations sont possibles.

Pour les apprentis en contrat à durée limitée, quel que soit leur âge, leur sont interdits l'exécution des travaux listés à l’article D. 4154-1 du code du travail.`,
        collapse: {
          label: "Détails",
          content: `Catégories restreintes pour les mineurs dans l'article L. 4153-8 du code du travail. Dérogations listées dans [l'article L. 4153-9 du code du travail](https://code.travail.gouv.fr/code-du-travail/l4153-9)

La règlementation relative aux travaux interdits et réglementés pour les jeunes âgés de quinze ans au moins et de moins de dix-huit ans est détaillée aux [articles D. 4153-15 à D. 4153-37 du code du travail](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018488483/#LEGISCTA000028058860).  Le cadre des dérogations est précisé aux [articles R. 4153-38 à R. 4153-45 du code du travail](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018488563/#LEGISCTA000028058656).

Le cadre des dérogations pour un apprenti en contrat à durée limitée est précisé aux [articles D. 4154-2 à D. 4154-6 du code du travail](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037001003/2021-06-14).`,
        },
      },
    ],
  },
  "contrat.smc": {
    _init: ({ values }) => ({
      messages: getSmcMessages({ values }),
    }),
    label: "Salaire minimum conventionnel (SMC)",
    fieldType: "number",
    required: true,
    requiredMessage: "Le salaire minimum conventionnel est obligatoire",
  },
  "contrat.salaireEmbauche": {
    // locked: true,
    label: "Salaire brut mensuel à l'embauche",
  },
  "contrat.remunerationsAnnuelles[].dateDebut": {
    label: "Date de début",
    fieldType: "date",
    required: true,
    locked: true,
  },
  "contrat.remunerationsAnnuelles[].dateFin": {
    required: true,
    label: "Date de fin",
    fieldType: "date",
    locked: true,
  },
  "contrat.remunerationsAnnuelles[].ordre": {
    label: "ordre",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].salaireBrut": {
    fieldType: "number",
    label: "salaireBrut",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].taux": {
    fieldType: "numberStepper",
    label: "% de rémunération du SMIC ou SMC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].tauxMinimal": {
    fieldType: "number",
    showInfo: true,
    label: "% de rémunération du SMIC ou SMC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].typeSalaire": {
    label: "SMIC ou SMC",
    required: true,
    showInfo: true,
    options: [
      {
        label: "SMIC",
        value: "SMIC",
      },
      {
        label: "SMC",
        value: "SMC",
      },
    ],
  },
  "contrat.caisseRetraiteSupplementaire": {
    label: "Caisse de retraite complémentaire",
    fieldType: "select",
    required: true,
    requiredMessage: "La caisse de retraite complémentaire est manquante",
    options: [
      { label: "AGIRC-ARRCO", value: "AGIRC-ARRCO" },
      { label: "Banque de France", value: "Banque de France" },
      { label: "CARCDSF", value: "CARCDSF" },
      { label: "CARMF", value: "CARMF" },
      { label: "CARPIMKO", value: "CARPIMKO" },
      { label: "CARPV", value: "CARPV" },
      { label: "CAVAMAC", value: "CAVAMAC" },
      { label: "CAVEC", value: "CAVEC" },
      { label: "CAVOM", value: "CAVOM" },
      { label: "CAVP", value: "CAVP" },
      { label: "CIPAV", value: "CIPAV" },
      { label: "CNBF", value: "CNBF" },
      { label: "CNIEG", value: "CNIEG" },
      { label: "CPRN", value: "CPRN" },
      { label: "CPRP", value: "CPRP" },
      { label: "CROPERA", value: "CROPERA" },
      { label: "CRP", value: "CRP" },
      { label: "CRPCEN", value: "CRPCEN" },
      { label: "CRPCF", value: "CRPCF" },
      { label: "CRPN ", value: "CRPN " },
      { label: "ENIM", value: "ENIM" },
      { label: "FSPOEIE", value: "FSPOEIE" },
      { label: "IRCANTEC", value: "IRCANTEC" },
      { label: "IRCEC", value: "IRCEC" },
      { label: "MSA", value: "MSA" },
      { label: "Port autonome de Strasbourg", value: "Port autonome de Strasbourg" },
      { label: "RATP ", value: "RATP " },
      { label: "Retraite des mines", value: "Retraite des mines" },
      { label: "SNCF", value: "SNCF" },
      { label: "SSI", value: "SSI" },
    ],
    messages: [
      {
        type: "assistive",
        content:
          "Le rattachement à une caisse de retraite complémentaire est une obligation de l’employeur dès la première embauche d’un salarié. Vous pouvez vous rapprocher de votre comptable ou de l’URSSAF.",
      },
    ],
  },
  "contrat.avantageNature": {
    fieldType: "radio",
    required: true,
    requiredMessage: "Cette déclaration est obligatoire",
    showInfo: true,
    label: "L'apprenti(e) bénéficie d'avantages en nature",
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
        type: "bonus",
        content: `Les avantages en nature sont constitués par la fourniture par l’employeur d’un bien ou service. La mise à disposition peut être gratuite ou moyennant une participation du salarié inférieure à leur valeur réelle.`,
        collapse: {
          label: "Exemples",
          content: `Par exemple, une prime-panier, la mise à disposition d'un logement sont des avantages en nature, mais aussi la mise à disposition d'un véhicule, d'outils de communication (ordinateur, téléphone), lorsqu'ils peuvent être utilisés à usage privé.
        
En savoir plus sur le [site de l'URSSAF](https://www.urssaf.fr/portail/home/employeur/calculer-les-cotisations/les-elements-a-prendre-en-compte/les-avantages-en-nature.html)`,
        },
      },
    ],
  },
  "contrat.avantageNourriture": {
    label: "Nourriture",
    fieldType: "text",
    requiredMessage: "Cette déclaration est obligatoire",
    min: 1,
    placeholder: "€ / repas",
    mask: "X € / repas",
    maskLazy: true,
    precision: 2,
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true,
        normalizeZeros: true,
        max: 10000,
      },
    ],
  },
  "contrat.avantageLogement": {
    label: "Logement",
    fieldType: "text",
    min: 1,
    placeholder: "€ / mois",
    mask: "X € / mois",
    precision: 2,
    maskBlocks: [
      {
        name: "X",
        mask: "Number",
        signed: true,
        normalizeZeros: true,
        max: 10000,
      },
    ],
  },
  "contrat.autreAvantageEnNature": {
    label: "Autres avantages",
    fieldType: "consent",
  },
  "contrat.smic": {},
};

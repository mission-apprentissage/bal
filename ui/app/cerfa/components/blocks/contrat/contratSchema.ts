import { CerfaField } from "../../../utils/cerfaSchema";
import { getLabelNumeroContratPrecedent } from "./domain/getLabelNumeroContratPrecedent";
import { getTypeDerogationOptions } from "./domain/getTypeDerogationOptions";
import { isRequiredNumeroContratPrecedent } from "./domain/isRequiredNumeroContratPrecedent";
import { shouldAskDateEffetAvenant } from "./domain/shouldAskDateEffetAvenant";

export const contratSchema: Record<string, CerfaField> = {
  "contrat.typeContratApp": {
    label: "Type de contrat ou d’avenant",
    fieldType: "select",
    required: true,
    requiredMessage: "le type de contrat ou d'avenant est obligatoire",
    showInfo: true,
    options: [
      {
        name: "Contrat initial",
        options: [
          {
            label: "11 Premier contrat d'apprentissage de l'apprenti",
            value: 11,
          },
        ],
      },
      {
        name: "Succession de contrats",
        options: [
          {
            label: "21 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un même employeur",
            value: 21,
          },
          {
            label:
              "22 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un autre employeur",
            value: 22,
          },
          {
            label:
              "23 Nouveau contrat avec un apprenti dont le précédent contrat auprès d'un autre employeur a été rompu",
            value: 23,
          },
        ],
      },
      {
        name: "Avenant : modification des conditions du contrat",
        options: [
          {
            label: "31 Modification de la situation juridique de l'employeur",
            value: 31,
          },
          {
            label: "32 Changement d'employeur dans le cadre d'un contrat saisonnier",
            value: 32,
          },
          {
            label: "33 Prolongation du contrat suite à un échec à l'examen de l'apprenti",
            value: 33,
          },
          {
            label: "34 Prolongation du contrat suite à la reconnaissance de l'apprenti comme travailleur handicapé",
            value: 34,
          },
          {
            label: "35 Modification du diplôme préparé par l'apprenti",
            value: 35,
          },
          {
            label:
              "36 Autres changements : changement de maître d'apprentissage, de durée de travail hebdomadaire, réduction de durée, etc.",
            value: 36,
          },
          {
            label: "37 Modification du lieu d'exécution du contrat",
            value: 37,
          },
          {
            label: "38 Modification du lieu principal de réalisation de la formation théorique",
            value: 38,
          },
        ],
      },
    ],
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
    _init: ({ values }) => ({ options: getTypeDerogationOptions({ values }) }),
    label: "Type de dérogation (optionnel)",
    fieldType: "select",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).

      [voir si info à contextualiser dès lors que l'utilisateur a saisi 21 ou 22 ] : En cas de réduction ou allongement de la durée du contrat, vous devrez aussi remplir une convention d'aménagement de durée, que vous signerez avec l'organisme de formation et votre apprenti.`,
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
    requiredMessage: "la numéro du contrat précédent est obligatoire",
    validateMessage: "n'est pas un numéro valide",
    mask: "DEP Y M N 0000",
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
  "contrat.dateSignature": {
    label: "Date de signature du présent contrat",
    fieldType: "date",
    required: true,
    requiredMessage: "la date de signature du contrat est obligatoire",
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
  "contrat.dateFinContrat": {
    label: "Date de fin du contrat ou de la période d'apprentissage",
    fieldType: "date",
    required: true,
    requiredMessage: "la date de fin de contrat est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `Le contrat ne peut pas se terminer avant la fin de la formation dans l'organisme de formation, examens compris.

      La période de contrat doit donc englober la date du dernier examen qui sanctionne l'obtention du diplôme. 
      Si celle-ci n'est pas connue au moment de la conclusion du contrat, vous pouvez renseigner une date située maximum 2 mois au-delà de la date de fin prévisionnelle des examens.
      
      La date de fin de contrat intervient donc : 
      au plus tôt le dernier jour de la dernière épreuve nécessaire à l’obtention du titre ou diplôme préparé par l'apprenti ;
      au plus tard dans les deux mois après la dernière épreuve sanctionnant le cycle, ou à la veille du début du cycle de formation suivant.
      
      Dans le cadre d’un CDI, vous devez donc également préciser la date de fin de l’action de formation (examens inclus).`,
      },
    ],
  },
  "contrat.dateDebutContrat": {
    label: "Date de début d'exécution du contrat",
    fieldType: "date",
    required: true,
    requiredMessage: "la date de début d'exécution de contrat est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "assistive",
        content: `Indiquez la date du 1er jour où débute effectivement le contrat (chez l'employeur ou dans le centre de formation).`,
      },
      {
        type: "bonus",
        content: `A partir de cette date, vous avez 5 jours ouvrables pour transmettre le document à votre OPCO (les étapes sur la suite de la procédure seron détaillées lorsque vous téléchargerez le présent document).
        La date de début d'exécution du contrat est liée à la date de naissance de l'apprenti pour le calcul des périodes de rémunération.`,
      },
      {
        type: "regulatory",
        content: `Cette date correspond à la date de début du cycle de formation au sens de l’article L6222-7-1. [https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038951821](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038951821)`,
      },
    ],
  },
  "contrat.dateDebutFormationPratique": {
    label: "Date de début de formation pratique chez l'employeur",
    fieldType: "date",
    required: true,
    requiredMessage: "la date de début de la formation pratique est obligatoire",
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
    fieldType: "number",
    required: true,
    requiredMessage: "la durée hebdomadaire de travail est obligatoire",
    showInfo: true,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
      },
    ],
    messages: [
      {
        type: "regulatory",
        content: `L’horaire collectif de travail de l’entreprise peut être inférieur ou supérieur à 35 heures. 
        Toutefois, la durée légale du travail effectif est fixée à 35h par semaine. Dans certains secteurs, quand l'organisation du travail le justifie, elle peut être portée à 40h.
        La circulaire n° 2012-15 du 19 juillet 2012 de la DGEFP précise que le Cerfa doit indiquer 35 heures dans le cas de salariés travaillant plus de 35 heures hebdomadaires, les heures au-delà étant récupérées sous forme de RTT.
        
        Le temps de formation en CFA est du temps de travail effectif et compte dans l'horaire de travail. En savoir plus sur le site du Service Public  [https://www.service-public.fr/particuliers/vosdroits/F2918](https://www.service-public.fr/particuliers/vosdroits/F2918) - ouverture dans un nouvel onglet`,
      },
    ],
  },
  "contrat.dureeTravailHebdoMinutes": {
    label: "Minutes",
    fieldType: "number",
    showInfo: true,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^\\d*$",
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
  },
  "contrat.salaireEmbauche": {
    locked: true,
    label: "Salaire brut mensuel à l'embauche:",
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
    label: "% de rémunération du SMIC",
    required: true,
  },
  "contrat.remunerationsAnnuelles[].tauxMinimal": {
    fieldType: "number",
    showInfo: true,
    label: "% de rémunération du SMIC",
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
  },
  "contrat.avantageNourriture": {
    label: "Nourriture",
    fieldType: "number",
    requiredMessage: "Cette déclaration est obligatoire",
    min: 1,
    mask: "X € / rep\\as",
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
    fieldType: "number",
    min: 1,
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

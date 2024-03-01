import { CerfaFields } from "../types/cerfa.types";

export const employeurSchema: CerfaFields = {
  "employeur.privePublic": {
    fieldType: "radio",
    required: true,
    requiredMessage: "Veuillez sélectionner une option",
    label: "Employeur privé ou public",
    options: [
      {
        label: "Public",
        value: "public",
      },
      {
        label: "Privé",
        value: "prive",
      },
    ],
  },
  "employeur.siret": {
    label: "Siret",
    placeholder: "Exemple : 98765432400019",
    required: true,
    requiredMessage: "Le siret est obligatoire",
    validateMessage: "n'est pas un siret valide",
    showsOverlay: true,
    mask: "00000000000000",
    messages: [
      {
        type: "assistive",
        content:
          "Vous devez renseigner le siret correspondant à l'établissement du lieu d'exécution du contrat, là où l'apprenti(e) suivra sa formation pratique ; il ne correspond donc pas forcément au siège de l'entreprise.",
        collapse: {
          label: "En savoir plus",
          content:
            "Le siret comporte 14 chiffres. Il doit être présent et actif dans la base Entreprises de l'INSEE (regroupant employeurs privés et publics).",
        },
      },
      {
        type: "bonus",
        content:
          "Vous ne connaissez pas votre siret ? Rendez-vous sur l'[annuaire des entreprises](https://annuaire-entreprises.data.gouv.fr/)",
      },
    ],
  },
  "employeur.denomination": {
    label: "Dénomination",
    placeholder: "Exemple : SARL DUPOND",
    required: true,
    showInfo: true,
    requiredMessage: "La dénomination de l'employeur est obligatoire",
    messages: [
      {
        type: "assistive",
        content: "Le nom officiel de l'établissement dans lequel le contrat s'exécute",
      },
    ],
  },

  "employeur.adresse.numero": {
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
  "employeur.adresse.repetitionVoie": {
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
  "employeur.adresse.voie": {
    label: "Voie",
    placeholder: "Exemple : RUE MICHELET",
    required: true,
    requiredMessage: "Le nom de voie est obligatoire",
    messages: [
      {
        type: "assistive",
        content: "L'adresse de l'établissement dans lequel le contrat s'exécute doit correspondre au siret renseigné",
      },
    ],
  },
  "employeur.adresse.complement": {
    label: "Complément",
    placeholder: "Exemple : Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service",
  },
  "employeur.adresse.codePostal": {
    label: "Code postal",
    placeholder: "Exemple : 21000",
    required: true,
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "00000",
  },
  "employeur.adresse.commune": {
    label: "Commune",
    placeholder: "Exemple : Dijon",
    required: true,
    requiredMessage: "La commune est obligatoire",
  },
  "employeur.telephone": {
    label: "Téléphone",
    placeholder: "Exemple : 6 23 45 67 89",
    fieldType: "phone",
    required: true,
    showInfo: true,
    requiredMessage: "Le téléphone de l'employeur est manquant",
    messages: [
      {
        type: "assistive",
        content: `Le numéro de téléphone est ici au format international : vous n'avez pas à renseigner le 1er "0". 
        Ce numéro de téléphone sera utilisé pour vous contacter en cas d'erreur ou de précision nécessaire sur ce contrat : le renseigner peut vous faire gagner du temps par la suite.`,
      },
    ],
  },
  "employeur.courriel": {
    label: "Courriel de l'employeur",
    placeholder: "Exemple : contact@employeur.fr",
    required: true,
    fieldType: "email",
    showInfo: true,
    requiredMessage: "Le courriel de l'employeur est manquant",
    messages: [
      {
        type: "bonus",
        content: "Cette adresse email peut être utilisée par l'ASP dans le cadre du paiement des aides.",
      },
    ],
  },
  "employeur.typeEmployeur": {
    label: "Type d’employeur",
    fieldType: "select",
    required: true,
    requiredMessage: "Le type d'employeur est obligatoire",
    options: [
      {
        label:
          "11 - Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l’Alsace-Moselle",
        value: "11",
      },
      { label: "12 - Entreprise inscrite uniquement au registre du commerce et des sociétés", value: "12" },
      { label: "13 - Entreprises dont les salariés relèvent de la mutualité sociale agricole", value: "13" },
      { label: "14 - Profession libérale", value: "14" },
      { label: "15 - Association", value: "15" },
      { label: "16 - Autre employeur privé", value: "16" },
    ],
    messages: [
      { type: "assistive", content: "Le type d'employeur doit être en adéquation avec son statut juridique." },
    ],
  },
  "employeur.employeurSpecifique": {
    label: "Employeur spécifique",
    fieldType: "select",
    completion: false,
    options: [
      {
        label: "0 - Aucun des cas ci-dessous",
        value: "0",
      },
      {
        label: "1 - Entreprise de travail temporaire",
        value: "1",
      },
      {
        label: "2 - Groupement d'employeurs",
        value: "2",
      },
      {
        label: "3 - Employeur saisonnier",
        value: "3",
      },
      {
        label: "4 - Apprentissage familial : l'employeur est un ascendant de l'apprenti",
        value: "4",
      },
    ],
  },
  "employeur.naf": {
    label: "Code activité de l’entreprise (NAF)",
    placeholder: "Exemple : 84.11Z",
    required: true,
    showInfo: true,
    requiredMessage: "Le code NAF est obligatoire",
    validateMessage: "le code NAF n'est pas au bon format",
    mask: "00.00a",
    messages: [
      {
        type: "assistive",
        content: "Le code NAF est composé de 4 chiffres et 1 lettre.",
      },
      {
        type: "bonus",
        content:
          "Pour connaître votre code NAF, vous pouvez consulter l'[Annuaire des entreprises](https://annuaire-entreprises.data.gouv.fr/).",
        collapse: {
          label: "En savoir plus",
          content:
            "En savoir plus sur le [site du ministère de l'Economie](https://www.economie.gouv.fr/entreprises/activite-entreprise-code-ape-code-naf).",
        },
      },
    ],
  },
  "employeur.nombreDeSalaries": {
    label: "Effectif total salariés de l’entreprise",
    placeholder: "Exemple : 500",
    fieldType: "number",
    required: true,
    showInfo: true,
    requiredMessage: "L'effectif salarié est obligatoire",
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
        type: "assistive",
        content:
          "L'effectif renseigné est celui de l’entreprise dans sa globalité et non celui du seul établissement du lieu d'exécution du contrat.",
      },
      {
        type: "regulatory",
        content:
          "**[Article L. 130-1.-I du code de la sécurité sociale](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038610270/2021-10-08/)**",
      },
    ],
  },
  // TODO: transform to select when API down
  "employeur.codeIdcc": {
    label: "Code IDCC de la convention",
    placeholder: "Exemple : 1000",
    required: true,
    requiredMessage: "Le code idcc est obligatoire",
    validateMessage: "le code IDCC n'est pas au bon format",
    mask: "00[00]",
    messages: [
      {
        type: "assistive",
        content:
          "Identifiant de la convention collective de branche appliquée par l'établissement d'exécution du contrat ou à défaut de la convention d’entreprise (non adaptive d’une convention de branche) ou enfin dans le cas de certaines grandes entreprises du code du statut.",
      },
      {
        type: "bonus",
        content:
          "L'Identifiant Des Conventions Collectives est un code de 1 à 4 chiffres sous lequel une convention collective est enregistrée. Sauf exception, cette information se trouve inscrite sur les bulletins de salaires émis par votre entreprise.",
        collapse: {
          label: "Retouver votre IDCC",
          content:
            "Si vous ne connaissez pas votre IDCC, recherchez-le avec votre siret ou votre nom sur l'Annuaire des entreprises : [https://annuaire-entreprises.data.gouv.fr/](https://annuaire-entreprises.data.gouv.fr/) ou recherche-le par mot-clé d'activité sur le [site du Ministère du Travail](https://www.elections-professionnelles.travail.gouv.fr/web/guest/recherche-idcc).",
        },
      },
      {
        type: "regulatory",
        content:
          "La convention collective est un texte conclu au niveau d’une branche d’activité (par exemple, : Transports routiers). Elle adapte les règles du Code du travail sur des points précis, en fonction des situations particulières de la branche (primes, congés, salaires minima, préavis, prévoyance…).",
      },
    ],
  },
  "employeur.codeIdcc_special": {
    fieldType: "radio",
    label: "Convention collective appliquée",
    options: [
      {
        label: "9999 - Aucune convention collective",
        value: "9999",
      },
      {
        label: "9998 - Convention collective en cours de négociation",
        value: "9998",
      },
    ],
  },
  "employeur.libelleIdcc": {
    label: "Libellé de la convention collective appliquée",
    placeholder: "Exemple : Convention collective nationale du personnel des cabinets d'avocats",
    required: true,
    requiredMessage: "Le libellé de la convention collective est manquant",
  },
};

import { departementsList } from "shared/constants/departements";
import { DIPLOMES } from "shared/constants/diplomes";

import { shouldAskRepresentantLegal } from "../domains/apprenti/shouldAskRepresentantLegal";
import { shouldAskResponsableLegalAdresse } from "../domains/apprenti/shouldAskResponsableLegalAdresse";
import { nomPattern } from "../domains/common/nomPattern";
import { CerfaFields } from "../types/cerfa.types";

export const apprentiSchema: CerfaFields = {
  "apprenti.nom": {
    label: "Nom de naissance de l'apprenti(e)",
    placeholder: "Exemple : Martin",
    required: true,
    showInfo: true,
    requiredMessage: "Le nom de naissance de l'apprenti(e) est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
    messages: [
      {
        type: "assistive",
        content:
          "Le nom doit strictement correspondre à l'identité officielle de l'apprenti(e) (attention aux inversions). Le nom de naissance ou nom de famille est celui qui figure sur l’acte de naissance.",
      },
    ],
  },
  "apprenti.nomUsage": {
    label: "Nom d'usage",
    placeholder: "Exemple : Dupont ; Martin-Dupont",
    showInfo: true,
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
    messages: [
      {
        type: "assistive",
        content:
          "Le nom d'usage est le nom choisi par une personne pour être utilisé dans la vie courante : par exemple, une personne mariée peut  utiliser le nom de son époux(se). Plus d'information sur le [site du Service public](https://www.service-public.fr/particuliers/vosdroits/F868).",
      },
    ],
  },
  "apprenti.prenom": {
    label: "Le premier prénom de l'apprenti(e) selon l'état civil",
    placeholder: "Exemple : Jean-François",
    required: true,
    showInfo: true,
    requiredMessage: "Le prénom de l'apprenti(e) est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "apprenti.dateNaissance": {
    fieldType: "date",
    required: true,
    label: "Date de naissance",
    requiredMessage: "La date de naissance de l'apprenti(e) est obligatoire",
    showInfo: true,
    messages: [
      {
        type: "bonus",
        content:
          "La date de naissance combinée à la date d'exécution du contrat définira si l'apprenti(e) est mineur(e) ou majeur(e) et est bien âgé de 15 ans ou plus. Si l'apprenti(e) est mineur(e) à la date de signature du contrat, vous devrez renseigner le cas d'émancipation ou les informations relatives au réprésentant légal.",
      },
      {
        type: "regulatory",
        content:
          "Sauf dérogation, une personne ne peut être engagée en qualité d'apprenti que si elle est âgée entre seize ans au moins et vingt-neuf ans révolus au début de l'apprentissage.",
        collapse: {
          label: "Voir les dérogations ",
          content: `Dérogation <15 ans

Les jeunes âgés d'au moins quinze ans peuvent débuter un contrat d'apprentissage s'ils justifient avoir accompli la scolarité du premier cycle de l'enseignement secondaire. 
Les jeunes qui atteignent l'âge de quinze ans avant le terme de l'année civile peuvent être inscrits, sous statut scolaire, dans un lycée professionnel ou dans un centre de formation d'apprentis pour débuter leur formation, dans des conditions fixées par décret en Conseil d'Etat. 

Dérogation >29 ans 

L'apprenti peut être âgé au maximum de 35 ans révolus (36 ans moins 1 jour) dans les cas suivants : 
- Apprenti signant un nouveau contrat pour accéder à un niveau de diplôme supérieur à celui déjà obtenu 
- Précédent contrat de l'apprenti rompu pour des raisons indépendantes de sa volonté 
- Précédent contrat de l'apprenti rompu pour inaptitude physique et temporaire 
Dans ces cas, il ne doit pas s'écouler plus d'1 an entre les 2 contrats. 

Pas de limite d'âge si l'apprenti : 
- est reconnu travailleur handicapé 
- envisage de créer ou reprendre une entreprise supposant l'obtention d'un diplôme 
- est inscrit en tant que sportif de haut niveau 
- n'a pas obtenu son diplôme et conclue un nouveau contrat avec un autre employeur pour se présenter de nouveau à l'examen`,
        },
      },
    ],
  },
  "apprenti.sexe": {
    required: true,
    fieldType: "radio",
    label: "Sexe",
    requiredMessage: "Le sexe de l'apprenti(e) est obligatoire",
    options: [
      {
        label: "Féminin",
        value: "F",
      },
      {
        label: "Masculin",
        value: "M",
      },
    ],
  },
  "apprenti.lieuNaissanceFrance": {
    required: true,
    fieldType: "radio",
    label: "L’apprenti(e) est né(e) en France (Metropolitaine, DOM-TOM...)",
    requiredMessage: "Le lieu de naissance de l'apprenti(e) est obligatoire",
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

  "apprenti.communeNaissance": {
    label: "Commune de naissance",
    placeholder: "Exemple : Bourg-en-Bresse",
    required: true,
    requiredMessage: "La commune de naissance est manquante",
  },
  "apprenti.departementNaissance": {
    label: "Département de naissance",
    fieldType: "select",
    required: true,
    requiredMessage: "Le département de naissance est obligatoire",
    options: departementsList.map(({ code, name }) => ({
      label: `${code} - ${name}`,
      value: code,
    })),
    messages: [
      {
        type: "assistive",
        content: "Pour les personnes nées à l'étranger, indiquez 99.",
      },
    ],
  },
  "apprenti.nir": {
    label: "Numéro de sécurité sociale (NIR)",
    requiredMessage: "N'est pas un numéro de sécurité sociale valide",
    mask: "S 00 M0 0C 000 000",
    maskLazy: false,
    definitions: {
      S: /[1-2]/,
      M: /[0-1]/,
      C: /[1-9AB]/,
    },
    messages: [
      {
        type: "assistive",
        content: `Le numéro de sécurité sociale est inscrit sur la carte vitale, en dessous du nom et du prénom du porteur.

Il est officiellement appelé NIR - "Numéro d'Inscription au Répertoire des personnes physiques".`,
      },
    ],
  },
  "apprenti.nationalite": {
    label: "Nationalité",
    required: true,
    fieldType: "select",
    requiredMessage: "La nationalité de l'apprenti(e) est obligatoire",
    showInfo: true,
    options: [
      {
        label: "1 - Française",
        value: "1",
      },
      {
        label: "2 - Union Européenne",
        value: "2",
      },
      {
        label: "3 - Etranger hors Union Européenne",
        value: "3",
      },
    ],
  },
  "apprenti.regimeSocial": {
    label: "Régime social",
    fieldType: "select",
    required: true,
    requiredMessage: "Le régime social est manquant",
    options: [
      {
        label: "1 - MSA",
        value: 1,
      },
      {
        label: "2 - URSSAF",
        value: 2,
      },
    ],
  },
  "apprenti.adresse.numero": {
    label: "N°",
    placeholder: "Exemple : 1 ; 2",
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
  "apprenti.adresse.repetitionVoie": {
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
  "apprenti.adresse.voie": {
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
  "apprenti.adresse.complement": {
    label: "Complément",
    placeholder: "Exemple : Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service",
    requiredMessage: "Le complement d'adress est obligatoire",
  },
  "apprenti.adresse.codePostal": {
    label: "Code postal",
    placeholder: "Exemple : 21000",
    required: true,
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "00000",
  },
  "apprenti.adresse.commune": {
    label: "Commune",
    placeholder: "Exemple : Dijon",
    required: true,
    requiredMessage: "La commune est obligatoire",
  },
  "apprenti.telephone": {
    label: "Téléphone de l'apprenti(e)",
    placeholder: "Exemple : 6 23 45 67 89",
    fieldType: "phone",
    required: true,
    requiredMessage: "Le téléphone de l'apprenti(e) est manquant",
    messages: [
      {
        type: "assistive",
        content: `Le numéro de téléphone utilisé ici est au format international. Dans ce format, le +33 (indicateur pays) remplace le premier "0" de votre numéro de téléphone, il faut donc commencer par le second chiffre de votre numéro.`,
      },
    ],
  },
  "apprenti.courriel": {
    label: "Courriel de l'apprenti(e)",
    placeholder: "Exemple : jf.martin@email.fr",
    fieldType: "email",
    required: true,
    requiredMessage: "Le courriel de l'apprenti(e) est manquant",
  },

  "apprenti.projetCreationRepriseEntreprise": {
    label: "Déclare avoir un projet de création ou de reprise d'entreprise",
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
        content: `Il n'existe aucune limite d'âge lorsque le contrat d'apprentissage est conclu par une personne qui a un projet de création ou de reprise d’entreprise dont la réalisation est subordonnée à l’obtention du diplôme ou titre sanctionnant la formation poursuivie.

Vous devrez fournir une attestation sur l'honneur de l'apprenti de + de 29 ans en création d'entreprise, en plus du CERFA et des autres pièces demandées.`,
      },
    ],
  },
  "apprenti.inscriptionSportifDeHautNiveau": {
    label: "Déclare être inscrit(e) sur la liste des sportifs de haut niveau",
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
        content:
          "Il n'existe aucune limite d’âge lorsque le contrat d’apprentissage est conclu par une personne inscrite en tant que sportif de haut niveau sur la liste arrêtée par le ministre chargé des sports et conformément au 5° de l’article L6222-2 du code du travail.",
        collapse: {
          label: "Information facile",
          content: `Liste mentionnée au premier alinéa de l’article L. 221-2 du code du sport.
          Vous pouvez rechercher l'information sur l'inscription en tant que sportif de haut niveau sur le [site du ministère des Sports et jeux olympiques et paralympiques](https://www.sports.gouv.fr/liste-des-sportifs-francais-de-haut-niveau-60)`,
        },
      },
    ],
  },
  "apprenti.handicap": {
    label: "Déclare bénéficier de la reconnaissance travailleur handicapé",
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
        content:
          "Il n'existe aucune limite d'âge lorsque le contrat d'apprentissage est conclu par une personne reconnue travailleur handicapé.",
      },
      {
        type: "bonus",
        content:
          "Les contrats concernant des apprentis reconnus en qualité de travailleur handicapé (RQTH) bénéficient d'aménagements du contrat d'apprentissage.",

        collapse: {
          label: "Plus de détails",
          content: `**Détails sur les aménagements**

Plus de détails sur le [site du ministère du Travail](https://travail-emploi.gouv.fr/formation-professionnelle/formation-en-alternance-10751/apprentissage/article/handicap-contrat-d-apprentissage-amenage#:~:text=Cette%20majoration%20est%20limit%C3%A9e%20%C3%A0,de%20travailleur%20handicap%C3%A9%20(RQTH)).
          
**Guide apprentissage et handicap**

[https://travail-emploi.gouv.fr/IMG/pdf/guideaprentissage_handicap2023_28072023.pdf](https://travail-emploi.gouv.fr/IMG/pdf/guideaprentissage_handicap2023_28072023.pdf)`,
        },
      },
    ],
  },
  "apprenti.situationAvantContrat": {
    label: "Situation avant ce contrat",
    fieldType: "select",
    required: true,
    requiredMessage: "La situation de l'apprenti(e) avant ce contrat est obligatoire",
    options: [
      { value: "1", label: "1 - Scolaire" },
      { value: "2", label: "2 - Prépa apprentissage" },
      { value: "3", label: "3 - Etudiant" },
      { value: "4", label: "4 - Contrat d’apprentissage" },
      { value: "5", label: "5 - Contrat de professionnalisation" },
      { value: "6", label: "6 - Contrat aidé" },
      {
        value: "7",
        label:
          "7 - En formation au CFA sous statut de stagiaire de la formation professionnelle, avant signature d’un contrat d’apprentissage (L6222-12-1 du code du travail)",
      },
      {
        value: "8",
        label:
          "8 - En formation, au CFA sans contrat sous statut de stagiaire de la formation professionnelle, suite à rupture (5° de L6231-2 du code du travail)",
      },
      { value: "9", label: "9 - Autres situations sous statut de stagiaire de la formation professionnelle" },
      { value: "10", label: "10 - Salarié" },
      { value: "11", label: "11 - Personne à la recherche d’un emploi (inscrite ou non à Pôle emploi)" },
      { value: "12", label: "12 - Inactif" },
    ],
    messages: [{ type: "assistive", content: "Situation dans laquelle se trouvait l'apprenti(e) avant son embauche." }],
  },

  "apprenti.diplomePrepare": {
    label: "Dernier diplôme ou titre préparé",
    fieldType: "select",
    required: true,
    requiredMessage: "Le dernier diplôme ou titre préparé par l'apprenti(e) est obligatoire",
    options: DIPLOMES,
    messages: [
      {
        type: "assistive",
        content: `Dernier diplôme ou titre préparé par l'apprenti(e) avant son embauche.
Il faut sélectionner le diplôme ou le titre préparé avant la conclusion du présent contrat.`,
        collapse: {
          label: "Exemples",
          content: `
Exemple 1 : si l'entrée en apprentissage concerne la 2ème année de BTS, le dernier diplôme ou titre préparé est la 1ère année de BTS : il faut donc sélectionner "54 - Brevet de Technicien supérieur".

Exemple 2 : si l'entrée en apprentissage concerne la 1ère année de BTS, le dernier diplôme ou titre préparé est peut-être le Baccalauréat général : il faut donc sélectionner "42: Baccalauréat général"`,
        },
      },
    ],
  },
  "apprenti.derniereClasse": {
    label: "Dernière classe / année suivie",
    fieldType: "select",
    required: true,
    requiredMessage: "La dernière classe / année suivie par l'apprenti(e) est manquante",
    showInfo: true,
    options: [
      {
        label: "01 - l'apprenti a suivi la dernière année du cycle de formation et a obtenu le diplôme ou titre",
        value: "01",
      },
      {
        label:
          "11 - l'apprenti a suivi la 1ère année du cycle et l'a validée (examens réussis mais année non diplômante)",
        value: "11",
      },
      {
        label:
          "12 - l'apprenti a suivi la 1ère année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: "12",
      },
      {
        label:
          "21 - l'apprenti a suivi la 2è année du cycle et l'a validée (examens réussis mais année non diplômante)",
        value: "21",
      },
      {
        label:
          "22 - l'apprenti a suivi la 2è année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: "22",
      },
      {
        label:
          "31 - l'apprenti a suivi la 3è année du cycle et l'a validée (examens réussis mais année non diplômante, cycle adaptés)",
        value: "31",
      },
      {
        label:
          "32 - l'apprenti a suivi la 3è année du cycle mais ne l'a pas validée (échec aux examens, interruption ou abandon de formation)",
        value: "32",
      },
      {
        label: "40 - l'apprenti a achevé le 1er cycle de l'enseignement secondaire (collège)",
        value: "40",
      },
      {
        label: "41 - l'apprenti a interrompu ses études en classe de 3è",
        value: "41",
      },
      {
        label: "42 - l'apprenti a interrompu ses études en classe de 4è",
        value: "42",
      },
    ],
    messages: [
      {
        type: "assistive",
        content: `Sélectionnez la dernière classe/année suivie par l'apprenti(e) avant son embauche en contrat d'apprentissage.`,
        collapse: {
          label: "Exemple",
          content: `Par exemple, si le diplôme préparé avant était une 1ère année de BTS et que cette dernière a été validée, il faut sélectionner "11 - l'apprenti a suivi la première année du cycle et l'a validée (examens réussis mais année non diplômante)".`,
        },
      },
    ],
  },
  "apprenti.intituleDiplomePrepare": {
    label: "Intitulé précis du dernier diplôme ou titre préparé",
    placeholder: "Exemple : BTS Services et prestations des secteurs sanitaire et social",
    required: true,
    showInfo: true,
    requiredMessage: "L'intitulé du dernier diplôme ou titre préparé par l'apprenti(e) est manquant",
  },
  "apprenti.diplome": {
    label: "Diplôme ou titre le plus élevé obtenu",
    fieldType: "select",
    required: true,
    requiredMessage: "Le diplôme ou titre le plus élevé obtenu par l'apprenti(e) est obligatoire",
    options: DIPLOMES,
    messages: [
      {
        type: "assistive",
        content: `Sélectionnez le titre ou diplôme le plus élevé obtenu par l'apprenti.`,
        collapse: {
          label: "Exemples",
          content: `Par exemple, pour une entrée en apprentissage en vue de préparer une 2ème année de BTS, le  diplôme le plus élevé obtenu est le Baccalauréat (même si la première année de BTS a été validée, elle ne donne pas lieu à délivrance d'un titre ou diplôme).

Par exemple, pour une entrée en apprentissage en vue de préparer un CAP suite à une reconversion, il est possible que le diplôme le plus élevé obtenu soit un Master 2 dans une autre spécialité de formation que celle du CAP.`,
        },
      },
    ],
  },
  "apprenti.apprentiMineur": {
    label: "À la date de signature de ce contrat, l'apprenti(e) sera-t-il(elle) mineur(e) *",
    fieldType: "radio",
    required: true,
    requiredMessage: "L'apprenti(e) sera-t-il(elle) mineur(e) à la date de signature de ce contrat ?",
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
  "apprenti.apprentiMineurNonEmancipe": {
    label: "L'apprenti est sous la responsabilité d'un représentant légal (non émancipé)",
    fieldType: "radio",
    required: true,
    requiredMessage: "Merci de renseigner si l'apprenti(e) mineur(e) est emancipé(e) ou non",
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
        content: `Vous devez indiquer "oui" si l'apprenti est mineur non émancipé à la date de signature du contrat. Dans ce cas, le représentant légal devra également signer le contrat.`,
        collapse: {
          label: "Emancipation",
          content: `Un mineur émancipé peut accomplir seul les actes nécessitant la majorité légale.

Plus d'informations à propos de l'émancipation sur le [site du Service public](https://www.service-public.fr/particuliers/vosdroits/F1194)`,
        },
      },
    ],
  },
  "apprenti.responsableLegal.nom": {
    _init: ({ values }: any) => ({ required: shouldAskRepresentantLegal({ values }) }),
    label: "Nom de naissance et prénom",
    showInfo: true,
    requiredMessage: "Le nom du représentant légal est obligatoire",
    placeholder: "Exemple : Martin Jean-François",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "apprenti.responsableLegal.courriel": {
    _init: ({ values }: any) => ({ required: shouldAskRepresentantLegal({ values }) }),
    label: "Courriel du responsable légal",
    placeholder: "Exemple : jf.martin@email.fr",
    fieldType: "email",
    requiredMessage: "Le courriel du représentant légal est manquant",
  },
  "apprenti.responsableLegal.memeAdresse": {
    _init: ({ values }: any) => ({ required: shouldAskRepresentantLegal({ values }) }),
    label: "L'apprenti(e) vit à la même adresse que son responsable légal",
    fieldType: "radio",
    requiredMessage: "L'adresse du représentant légal est obligatoire",
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
  "apprenti.responsableLegal.adresse.numero": {
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
  "apprenti.responsableLegal.adresse.repetitionVoie": {
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
  "apprenti.responsableLegal.adresse.voie": {
    label: "Voie",
    placeholder: "Exemple : RUE MICHELET",
    requiredMessage: "Le nom de voie est obligatoire",
    messages: [
      {
        type: "assistive",
        content: "L'adresse de l'établissement dans lequel le contrat s'exécute doit correspondre au siret renseigné",
      },
    ],
  },
  "apprenti.responsableLegal.adresse.complement": {
    label: "Complément",
    placeholder: "Exemple : Hôtel de ville ; Entrée ; Bâtiment ; Etage ; Service",
  },
  "apprenti.responsableLegal.adresse.codePostal": {
    _init: ({ values }: any) => ({ required: shouldAskResponsableLegalAdresse({ values }) }),
    label: "Code postal",
    placeholder: "Exemple : 21000",
    requiredMessage: "Le code postal est obligatoire",
    validateMessage: "n'est pas un code postal valide",
    mask: "00000",
  },
  "apprenti.responsableLegal.adresse.commune": {
    _init: ({ values }: any) => ({ required: shouldAskResponsableLegalAdresse({ values }) }),
    label: "Commune",
    placeholder: "Exemple : Dijon",
    requiredMessage: "La commune est obligatoire",
  },

  "apprenti.age": { fieldType: "number" },
};

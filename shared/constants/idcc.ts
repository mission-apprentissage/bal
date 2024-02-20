export const IDCC_ETATS_JURIDIQUE = {
  VIGUEUR_ETEN: "VIGUEUR_ETEN",
  VIGUEUR_NON_ETEN: "VIGUEUR_NON_ETEN",
  MODIFIE: "MODIFIE",
  REMPLACE: "REMPLACE",
  PERIME: "PERIME",
  ABROGE: "ABROGE",
};

interface IdccMeta {
  legifrance?: {
    etat_juridique: string | null;
    url: string | null;
    titre: string | null;
    soustitre: string | null;
  }[];
  recherche_entreprise?: {
    titre: string;
    id_kali: string | null;
    cc_ti: string | null;
    nature: string | null;
    etat: string | null;
    debut: string | null;
    fin: string | null;
    url: string | null;
  };
}

interface Idcc {
  libelle: string | null;
  nature: string | null;
  url: string | null;
  convention_nationale_associees: string[] | null;
  _meta: IdccMeta;
}

type Idccs = Record<string, Idcc>;

export enum IdccSources {
  RECHERCHE_ENTREPRISE_API = "RECHERCHE_ENTREPRISE_API",
  API_ENTREPRISE = "API_ENTREPRISE",
  CFA_DOCK_SIRET = "CFA_DOCK_SIRET",
  CFA_DOCK_SIREN = "CFA_DOCK_SIREN",
}

export type IdccSource = keyof typeof IdccSources;

export const isIdccEnVigueur = (idcc: Idcc): boolean =>
  idcc._meta.legifrance?.some(
    (idcc) =>
      idcc.etat_juridique &&
      [IDCC_ETATS_JURIDIQUE.VIGUEUR_ETEN, IDCC_ETATS_JURIDIQUE.VIGUEUR_NON_ETEN].includes(idcc.etat_juridique)
  ) ?? true;

export const idcc: Idccs = {
  "0014": {
    libelle: "Production cinématographique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635719",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635719",
          titre: "Convention collective nationale des techniciens de la production cinématographique du 30 avril 1950",
          soustitre: "Production cinématographique",
        },
      ],
    },
  },
  "0016": {
    libelle: "Transports routiers et activités auxiliaires du transport",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635624",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635624",
          titre:
            "Convention collective nationale des transports routiers et activités auxiliaires du transport du 21 décembre 1950",
          soustitre: "Transports routiers et activités auxiliaires du transport",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des transports routiers et activités auxiliaires du transport",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0018": {
    libelle: "Industrie textile",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635689",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635689",
          titre:
            "Convention collective nationale de l'industrie textile du 1er  février 1951.  Etendue par arrêté du 17 décembre 1951, rectificatif du 13 janvier 1952, mise à jour le 29 mai 1979, en vigueur le 1er octobre 1979. Etendue par arrêté du 23 octobre 1979. JONC 12 janvier 1980.\n",
          soustitre: "Industrie textile",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des industries textiles",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0023": {
    libelle: "Personnel sédentaire des entreprises de navigation",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635659",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635659",
          titre:
            "Convention collective nationale du personnel sédentaire des entreprises de navigation du 20 février 1951.  Etendue par arrêté du 9 décembre 1983 JONC 4 janvier 1984. (1)",
          soustitre: "Personnel sédentaire des entreprises de navigation",
        },
      ],
    },
  },
  "0029": {
    libelle:
      "Hospitalisation privée : établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif (FEHAP)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635234",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635234",
          titre:
            "Convention collective nationale des établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif du 31 octobre 1951.",
          soustitre:
            "Hospitalisation privée : établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif (FEHAP)",
        },
        {
          etat_juridique: "MODIFIE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635234",
          titre:
            "Convention collective nationale des établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif du 31 octobre 1951.",
          soustitre:
            "Hospitalisation privée : établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif (FEHAP)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des établissements privés d'hospitalisation, de soins, de cure et de garde à but non lucratif (FEHAP, convention de 1951)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0043": {
    libelle:
      "Entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine (CCNIE)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635612",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635612",
          titre:
            "Convention collective nationale de l'import-export et du commerce international du 18 décembre 1952.  Etendue par arrêté du 18 octobre 1955 JORF 6 novembre 1955 rectificatif JORF 22 novembre 1955.\n",
          soustitre:
            "Entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine (CCNIE)",
        },
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635612",
          titre:
            "Convention collective nationale des entreprises de commerce et de commission importation-exportation de France métropolitaine du 18 décembre 1952.  Etendue par arrêté du 18 octobre 1955 JORF 6 novembre 1955 rectificatif JORF 22 novembre 1955",
          soustitre:
            "Entreprises de commission, de courtage et de commerce intracommunautaire et d'importation-exportation de France métropolitaine (CCNIE)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'Import-export et du Commerce international",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0044": {
    libelle: "Industries chimiques et connexes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635613",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635613",
          titre:
            "Convention collective nationale des industries chimiques et connexes du 30 décembre 1952. Étendue par arrêté du 13 novembre 1956 JONC 12 décembre 1956",
          soustitre: "Industries chimiques et connexes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des industries chimiques et connexes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0045": {
    libelle: "Caoutchouc",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635597",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635597",
          titre:
            "Convention collective nationale du caoutchouc du 6 mars 1953. Étendue par arrêté du 29 mai 1969 JORF 18 juin 1969 ",
          soustitre: "Caoutchouc",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du caoutchouc",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0054": {
    libelle: "Métallurgie : Région parisienne (industries métallurgiques, mécaniques et connexes)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635149",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635149",
          titre:
            "Convention collective régionale des industries métallurgiques, mécaniques et connexes de la région parisienne du 16 juillet 1954. Etendue par arrêté du 11 août 1965 (JO du 25 août 1965). \nRectificatif du 10 septembre 1965. \nMise à jour par accord du 13 juillet 1973, étendu par arrêté du 10 décembre 1979 (JO du 17 janvier 1980)",
          soustitre: "Métallurgie : Région parisienne (industries métallurgiques, mécaniques et connexes)",
        },
      ],
    },
  },
  "0086": {
    libelle: "Entreprises de la publicité et assimilées",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635630",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635630",
          titre:
            "Convention collective nationale de travail des cadres, techniciens et employés de la publicité française du 22 avril 1955. Étendue par arrêté du 29 juillet 1955 JORF 19 août 1955",
          soustitre: "Entreprises de la publicité et assimilées",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de publicité et assimilées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0087": {
    libelle: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635206",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635206",
          titre:
            "Convention collective nationale relative aux conditions de travail des ouvriers des industries de carrières et de matériaux du 22 avril 1955. Etendue par arrêté du 13 décembre 1960 JONC 21 décembre 1960 rectificatif 9 février 1961",
          soustitre: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des ouvriers des industries de carrières et de matériaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0112": {
    libelle: "Industrie laitière",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635449",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635449",
          titre:
            "Convention collective nationale de l'industrie laitière du 20 mai 1955, modifiée par avenant n° 34 du 29 juin 2006. Etendue par arrêté du 10 décembre 2007 JORF 18 décembre 2007",
          soustitre: "Industrie laitière",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635449",
          titre:
            "Convention collective nationale de l'industrie laitière  du 20 mai 1955, mise à jour le 1er décembre 1976.  Etendue par arrêté du 9 décembre 1977 JONC 21 janvier 1978.",
          soustitre: "Industrie laitière",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie laitière",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0135": {
    libelle: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635649",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635649",
          titre:
            "Convention collective nationale relative aux conditions de travail des employés, techniciens et agents de maîtrise des industries de carrières et de matériaux du 12 juillet 1955.  Etendue par arrêté du 13 décembre 1960 JONC 21 décembre 1960 rectificatif 9 février 1961",
          soustitre: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des employés techniciens et agents de maîtrise des industries de carrières et de matériaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0158": {
    libelle: "Travail mécanique du bois, des scieries, du négoce et de l'importation des bois",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635966",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635966",
          titre:
            "Convention collective nationale du travail mécanique du bois, des scieries, du négoce et de l'importation des bois du 28 novembre 1955. Étendue par arrêté du 28 mars 1956 JONC 8 avril 1956.\n",
          soustitre: "Travail mécanique du bois, des scieries, du négoce et de l'importation des bois",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du travail mécanique du bois, des scieries, du négoce et de l'importation des bois",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0172": {
    libelle: "Industrie du bois de pin maritime en forêt de Gascogne",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030264028",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030264028",
          titre:
            "Convention collective interrégionale de l'industrie du bois de pin maritime en forêt de Gascogne du 1er juillet 2014 (réactualisation).\n",
          soustitre: "Industrie du bois de pin maritime en forêt de Gascogne",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective interrégionale de l'industrie du bois de pin maritime en forêt de Gascogne (Charente, Aquitaine) (annexée à la convention collective nationale du travail mécanique du bois, des scieries, du négoce et de l'importation des bois 0158)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0176": {
    libelle: "Industrie pharmaceutique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635184",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635184",
          titre: "Convention collective nationale de l'industrie pharmaceutique (accord du 11 avril 2019)",
          soustitre: "Industrie pharmaceutique",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635184",
          titre:
            "Convention collective nationale de l'industrie pharmaceutique du 6 avril 1956.  Etendue par arrêté du 15 novembre 1956 JORF 14 décembre 1956.",
          soustitre: "Industrie pharmaceutique",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie pharmaceutique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0179": {
    libelle: "Coopératives de consommation : personnel",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635781",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635781",
          titre: "Convention collective nationale du personnel des coopératives de consommation du 30 avril 1956.",
          soustitre: "Coopératives de consommation : personnel",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635781",
          titre: "Convention collective nationale du personnel des coopératives de consommation.",
          soustitre: "Coopératives de consommation : personnel",
        },
      ],
    },
  },
  "0184": {
    libelle: "Imprimeries de labeur et industries graphiques",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635955",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635955",
          titre:
            "Convention collective nationale de travail du personnel des imprimeries de labeur et des industries graphiques.  En vigueur le 1er juin 1956.  Etendue par arrêté du 22 novembre 1956 JONC 15 décembre 1956.\n",
          soustitre: "Imprimeries de labeur et industries graphiques",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'imprimerie de labeur et des industries graphiques",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0200": {
    libelle: "Exploitations frigorifiques",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635258",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635258",
          titre:
            "Convention collective nationale des exploitations frigorifiques du 10 juillet 1956.  Etendue par arrêté du 15 novembre 1961 JONC 3 décembre 1961.",
          soustitre: "Exploitations frigorifiques",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des exploitations frigorifiques",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0207": {
    libelle: "Industrie des cuirs et peaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186",
          titre:
            "Convention collective nationale de travail de l'industrie des cuirs et peaux du 6 juin 2018 (Avenant du 6 juin 2018) - Etendue par arrêté du 10 juillet 2020 JORF 1er août 2020.\n",
          soustitre: "Industrie des cuirs et peaux",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635186",
          titre:
            "Convention collective nationale de travail de l'industrie des cuirs et peaux du 6 octobre 1956.  Etendue par arrêté du 27 octobre 1961 JORF 18 novembre 1961.",
          soustitre: "Industrie des cuirs et peaux",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de l'industrie des cuirs et peaux (annexée à la convention collective nationale de travail des industries de la maroquinerie, articles de voyage, chasse sellerie, gainerie, bracelets en cuir 2528)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0211": {
    libelle: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635430",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635430",
          titre:
            "Convention collective nationale des cadres des industries de carrières et matériaux du 6 décembre 1956.  Etendue par arrêté du 13 décembre 1960 JONC 21 décembre 1960 rectificatif 9 février 1961",
          soustitre: "Carrières : industries de carrières et de matériaux (UNICEM) (ouvriers, ETAM et cadres)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cadres des industries de carrières et matériaux (UNICEM)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0214": {
    libelle: "Convention collective régionale des ouvriers des entreprises de presse de la région parisienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ouvriers des entreprises de presse de la région parisienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0218": {
    libelle: "Organismes de sécurité sociale (8 février 1957)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038292684",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038292684",
          titre:
            "Convention collective nationale de travail du personnel des organismes de sécurité sociale du 8 février 1957",
          soustitre: "Organismes de sécurité sociale (8 février 1957)",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038292684",
          titre:
            "Convention collective nationale de travail du personnel des organismes de sécurité sociale du 8 février 1957",
          soustitre: "Organismes de sécurité sociale (8 février 1957)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de sécurité sociale",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0247": {
    libelle: "Industries de l'habillement",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635647",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635647",
          titre:
            "Convention collective nationale des industries de l'habillement du 17 février 1958.  Etendue par arrêté du 23 juillet 1959 JONC 8 août 1959 et rectificatif au JONC du 13 septembre 1959.\n",
          soustitre: "Industries de l'habillement",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des industries de l'habillement",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0255": {
    libelle: "Bâtiment ETAM",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635482",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635482",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise du bâtiment.  En vigueur le 1er juillet 1958.",
          soustitre: "Bâtiment ETAM",
        },
      ],
    },
  },
  "0275": {
    libelle: "Transport aérien (personnel au sol)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635872",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635872",
          titre:
            "Convention collective nationale du personnel au sol des entreprises de transport aérien du 22 mai 1959.  Etendue par arrêté du 10 janvier 1964 JONC 21 janvier 1964 et rectificatif JONC 4 février 1964.\n",
          soustitre: "Transport aérien (personnel au sol)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel au sol des entreprises de transport aérien",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0292": {
    libelle: "Plasturgie",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635856",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635856",
          titre:
            "Convention collective nationale de la plasturgie du 1er  juillet 1960.  Etendue par arrêté du 14 mai 1962 JONC 7 juin 1962 rectificatif 30 juin 1962.",
          soustitre: "Plasturgie",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la plasturgie (transformation des matières plastiques)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0294": {
    libelle: "Production cinématographique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635721",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635721",
          titre:
            "Convention collective nationale des ouvriers indépendants des studios de la production cinématographique du 1er août 1960.",
          soustitre: "Production cinématographique",
        },
      ],
    },
  },
  "0303": {
    libelle: "Couture parisienne",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635552",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635552",
          titre: "Convention collective nationale de la couture parisienne et des autres métiers de la mode \n",
          soustitre: "Couture parisienne",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la couture parisienne et des autres métiers de la mode",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0306": {
    libelle: "Convention collective régionale des cadres techniques de la presse quotidienne parisienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des cadres techniques de la presse quotidienne parisienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0349": {
    libelle: "Agences de voyages et d'excursions de la région parisienne : guides-interprètes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635697",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635697",
          titre:
            "Convention collective régionale de travail des guides interprètes de la région parisienne du 21 juin 1962. En vigueur le 1er avril 1962.\nChamp d'application fusionné avec celui de la convention collective nationale du personnel des agences de voyages et de tourisme (IDCC 1710) par arrêté ministériel du 5 janvier 2017.\nRemplacée par la convention collective nationale des opérateurs de voyages et des guides du 19 avril 2022 (IDCC 3245).",
          soustitre: "Agences de voyages et d'excursions de la région parisienne : guides-interprètes",
        },
      ],
    },
  },
  "0354": {
    libelle: "Ganterie de peau",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635672",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635672",
          titre:
            "Convention collective nationale de l'industrie de la ganterie de peau du 27 novembre 1962.  Etendue par arrêté du 14 novembre 1969 JONC 20 décembre 1969.\n",
          soustitre: "Ganterie de peau",
        },
      ],
    },
  },
  "0363": {
    libelle: "Ciment : industrie de la fabrication des ciments",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635462",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635462",
          titre:
            "Convention collective nationale de travail des ingénieurs et cadres de l'industrie de la fabrication des ciments du 5 juillet 1963. Étendue par arrêté du 16 avril 1968 JONC 10 mai 1968. \nRemplacée par la convention collective nationale de l’industrie de la fabrication des ciments du 2 octobre 2019 (IDCC 3233)",
          soustitre: "Ciment : industrie de la fabrication des ciments",
        },
      ],
    },
  },
  "0379": {
    libelle: "Convention collective départementale du travail des commerces de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale du travail des commerces de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0388": {
    libelle: "Production cinématographique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635984",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635984",
          titre:
            "Convention collective nationale des cadres, agents de maîtrise et assistants des auditoriums cinématographiques du 30 juin 1994.",
          soustitre: "Production cinématographique",
        },
      ],
    },
  },
  "0390": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635268",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635268",
          titre:
            "Convention collective de travail des professeurs de l'enseignement secondaire libre enseignant dans les établissements hors contrat et dans les établissements sous contrat mais sans être contractuels du 23 juillet 1964",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "0394": {
    libelle: "Convention collective régionale des employés de la presse quotidienne parisienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des employés de la presse quotidienne parisienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0398": {
    libelle: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635643",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635643",
          titre:
            "Convention collective nationale des ouvriers du négoce des matériaux de construction du 17 juin 1965, étendue par arrêté du 12 avril 1972 (JO du 1er juin 1972). Mise à jour par avenant n° 38 du 22 avril 1983, étendu par arrêté du 4 novembre 1983 (JO du 18 novembre 1983).\nRemplacée par la convention collective nationale des salariés du négoce des matériaux de construction du 8 décembre 2015 (IDCC 3216)",
          soustitre: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
        },
      ],
    },
  },
  "0403": {
    libelle: "",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635623",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635623",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise des entreprises de travaux publics.",
          soustitre: "",
        },
      ],
    },
  },
  "0405": {
    libelle: "Organisations syndicales des salariés : La CFDT ; La CGT-FO ; La CFTC ; La CFE-CGC,",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000026942733",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000026942733",
          titre:
            "Convention relative aux établissements médico-sociaux de l'union intersyndicale des secteurs sanitaires et sociaux (Avenant du 16 mars 2012 relatif à la mise à jour de la convention)",
          soustitre: "Organisations syndicales des salariés : La CFDT ; La CGT-FO ; La CFTC ; La CFE-CGC,",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des établissements médico-sociaux de l'union intersyndicale des secteurs sanitaires et sociaux (UNISSS, FFESCPE, convention de 1965, enfants, adolescents )",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0412": {
    libelle: "Agences de voyages et de tourisme : personnels, guides accompagnateurs et accompagnateurs",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635847",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635847",
          titre:
            "Convention collective nationale de travail des guides accompagnateurs et accompagnateurs au service des agences de voyages et de tourisme du 10 mars 1966.\nChamp d'application fusionné avec celui de la convention collective nationale du personnel des agences de voyages et de tourisme (IDCC 1710) par arrêté ministériel du 23 janvier 2019.\nRemplacée par la convention collective nationale des opérateurs de voyages et des guides du 19 avril 2022 (IDCC 3245).",
          soustitre: "Agences de voyages et de tourisme : personnels, guides accompagnateurs et accompagnateurs",
        },
      ],
    },
  },
  "0413": {
    libelle: "Handicapés : établissements et services pour les personnes inadaptées et handicapées",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635407",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635407",
          titre:
            "Convention collective nationale de travail des établissements et services pour personnes inadaptées et handicapées du 15 mars 1966. Mise à jour au 15 septembre 1976.\n",
          soustitre: "Handicapés : établissements et services pour les personnes inadaptées et handicapées",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des établissements et services pour personnes inadaptées et handicapées (convention de 1966, SNAPEI)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0418": {
    libelle:
      "Convention collective nationale de la chemiserie sur mesure (annexée à la convention collective nationale de la couture parisienne 0303)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la chemiserie sur mesure (annexée à la convention collective nationale de la couture parisienne 0303)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0435": {
    libelle: "Production cinématographique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635995",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635995",
          titre:
            "Convention collective nationale des acteurs et acteurs de complément de la production cinématographique du 1er septembre 1967",
          soustitre: "Production cinématographique",
        },
      ],
    },
  },
  "0438": {
    libelle:
      "Convention collective nationale de travail des échelons intermédiaires des services extérieurs de production des sociétés d'assurances",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des échelons intermédiaires des services extérieurs de production des sociétés d'assurances",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0440": {
    libelle: "Convention collective départementale des sucreries et sucreries-distilleries de la Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des sucreries et sucreries-distilleries de la Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0450": {
    libelle: "Jouets : entreprises de commerce de gros de jouets, bimboloterie, bazars",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635654",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "DENONCE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635654",
          titre:
            "Convention collective nationale des entreprises de commerce de gros de jouets, bimbeloterie, bazars du 1er mai 1968.  Etendue par arrêté du 14 mai 1970 JONC 31 mai 1970.",
          soustitre: "Jouets : entreprises de commerce de gros de jouets, bimboloterie, bazars",
        },
      ],
    },
  },
  "0454": {
    libelle: "Remontées mécaniques et domaines skiables",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635642",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635642",
          titre:
            "Convention collective nationale des remontées mécaniques et domaines skiables du 30 septembre 2021 (Avenant n° 73 du 30 septembre 2021). Etendue par arrêté du 11 mai 2023 JORF 7 juin 2023",
          soustitre: "Remontées mécaniques et domaines skiables",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635642",
          titre:
            "Convention collective nationale des remontées mécaniques et domaines skiables du 15 mai 1968. (1) Etendue par arrêté du 3 février 1971 JONC 27 février 1971.",
          soustitre: "Remontées mécaniques et domaines skiables",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des remontées mécaniques et domaines skiables",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0468": {
    libelle: "Commerce succursaliste de la chaussure",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635394",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635394",
          titre:
            "Convention collective nationale du commerce succursaliste de la chaussure du 2 juillet 1968, mise à jour le 18 novembre 1971 (1) ",
          soustitre: "Commerce succursaliste de la chaussure",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du commerce succursaliste de la chaussure",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0478": {
    libelle: "Sociétés financières",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635810",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635810",
          titre: "Convention collective nationale des sociétés financières du 22 novembre 1968",
          soustitre: "Sociétés financières",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des sociétés financières",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0489": {
    libelle: "Industries du cartonnage",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635973",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635973",
          titre:
            "Convention collective nationale du cartonnage du 17 avril 2019 (Accord du 17 avril 2019) - Étendue par arrêté du 17 décembre 2021 JORF 1 janvier 2022.\n",
          soustitre: "Industries du cartonnage",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635973",
          titre:
            "Convention collective nationale pour le personnel des industries de cartonnage du 9 janvier 1969. Etendue par arrêté du 2 août 1971 JONC 31 août 1971 et rectificatif au JONC du 28 novembre 1971.",
          soustitre: "Industries du cartonnage",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des industries du cartonnage",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0493": {
    libelle: "Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635438",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635438",
          titre:
            "Convention collective nationale des vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France du 13 février 1969.  Etendue par arrêté du 1er juin 1973 JONC 2 septembre 1973.",
          soustitre: "Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635438",
          titre:
            "Nouvelle convention collective nationale des vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France du 15 mars 2013",
          soustitre: "Vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des vins, cidres, jus de fruits, sirops, spiritueux et liqueurs de France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0500": {
    libelle: "Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635640",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635640",
          titre:
            "Convention collective des commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet du 13 mars 1969.  Etendue par arrêté du 2 novembre 1970 JONC 13 décembre 1970.",
          soustitre: "Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635640",
          titre:
            "Convention collective nationale des commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet du 11 avril 2022 (Accord du 11 avril 2022)",
          soustitre: "Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet",
        },
        {
          etat_juridique: "MODIFIE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635640",
          titre:
            "Convention collective nationale de travail des commerces de gros en bonneterie, lingerie, confection, mercerie, chaussures et négoces connexes du 13 mars 1969.  Etendue par arrêté du 2 novembre 1970 JONC 13 décembre 1970.",
          soustitre: "Commerces de gros de l'habillement, de la mercerie, de la chaussure et du jouet",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises de distribution en chaussure, jouet, textile et mercerie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0504": {
    libelle: "Industries alimentaires diverses",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635380",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635380",
          titre: "Convention collective nationale des industries alimentaires diverses du 27 mars 1969.",
          soustitre: "Industries alimentaires diverses",
        },
      ],
    },
  },
  "0509": {
    libelle: "Convention collective régionale des cadres administratifs de la presse quotidienne parisienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des cadres administratifs de la presse quotidienne parisienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0533": {
    libelle: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635634",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635634",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise du négoce des matériaux de construction du 17 novembre 1969, étendue par arrêté du 12 avril 1972 (JO du 1er juin 1972). Mise à jour par avenant n° 38 du 22 avril 1983, étendu par arrêté du 4 novembre 1983 (JO du 18 novembre 1983).\nRemplacée par la convention collective nationale des salariés du négoce des matériaux de construction du 8 décembre 2015 (IDCC 3216)",
          soustitre: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
        },
      ],
    },
  },
  "0538": {
    libelle: "Manutention ferroviaire et travaux connexes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635702",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635702",
          titre:
            "Convention collective nationale du personnel des entreprises de manutention ferroviaire et travaux connexes du 12 juin 2019 (Accord du 12 juin 2019) - Étendue par arrêté du 2 avril 2021 JORF 13 avril 2021 (1)",
          soustitre: "Manutention ferroviaire et travaux connexes",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635702",
          titre:
            "Convention collective nationale du personnel des entreprises de manutention ferroviaire et travaux connexes. En vigueur le 1er janvier 1970.  Etendue par arrêté du 16 mars 1971 JONC 11 mai 1971.",
          soustitre: "Manutention ferroviaire et travaux connexes",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel des entreprises de manutention ferroviaire et travaux connexes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0562": {
    libelle: "Aides familiales rurales et personnel de l'aide à domicile en milieu rural (ADMR)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635416",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635416",
          titre:
            "Convention collective nationale des aides familiales rurales et personnel de l'aide à domicile en milieu rural (ADMR) du 6 mai 1970",
          soustitre: "Aides familiales rurales et personnel de l'aide à domicile en milieu rural (ADMR)",
        },
      ],
    },
  },
  "0567": {
    libelle: "Bijouterie, joaillerie, orfèvrerie et activités qui s'y rattachent",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635412",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635412",
          titre:
            "Convention collective nationale de la bijouterie, joaillerie, orfèvrerie et activités qui s'y rattachent du 5 juin 1970 (mise à jour par accord du 20 mars 1973).  Etendue par arrêté du 27 septembre 1973 (JO du 22 novembre 1973).\n",
          soustitre: "Bijouterie, joaillerie, orfèvrerie et activités qui s'y rattachent",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la bijouterie, joaillerie, orfèvrerie et des activités qui s'y rattachent",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0573": {
    libelle: "Commerces de gros",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635373",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635373",
          titre:
            "Convention collective nationale de commerces de gros du 23 juin 1970. Etendue par arrêté du 15 juin 1972 JONC 29 août 1972. Mise à jour par accord du 27 septembre 1984 étendu par arrêté du 4 février 1985 JORF 16 février 1985.\n",
          soustitre: "Commerces de gros",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des commerces de gros",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0598": {
    libelle: "Presse quotidienne régionale et départementale : ouvriers et employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019459287",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019459287",
          titre:
            "Convention collective de travail des ouvriers de la presse quotidienne régionale du 2 décembre 1970. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : ouvriers et employés",
        },
      ],
    },
  },
  "0614": {
    libelle: "Industries de la sérigraphie et des procédés d'impression numérique connexes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635648",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635648",
          titre:
            "Convention collective nationale de travail des industries de la sérigraphie et des procédés d'impression numérique connexes du 23 mars 1971.\n",
          soustitre: "Industries de la sérigraphie et des procédés d'impression numérique connexes",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des industries de la sérigraphie et des procédés d'impression numérique connexes (annexée à la convention collective nationale de l'imprimerie de labeur et des industries graphiques 0184)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0627": {
    libelle:
      "Convention collective départementale des employés, techniciens et agents de maîtrise du bâtiment et des travaux publics de La Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des employés, techniciens et agents de maîtrise du bâtiment et des travaux publics de La Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0635": {
    libelle: "Négoce en fournitures dentaires",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635851",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635851",
          titre:
            "Convention collective nationale du négoce en fournitures dentaires du 26 novembre 1971. Mise à jour par accord du 27 mars 1974. Etendue par arrêté du 3 novembre 1976 JORF 25 novembre 1976.",
          soustitre: "Négoce en fournitures dentaires",
        },
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635851",
          titre:
            "Convention collective nationale du négoce en fournitures dentaires (Accord du 18 novembre 2014 modifiant les dispositions communes et l'annexe II « Avenant Cadres »).\n",
          soustitre: "Négoce en fournitures dentaires",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du négoce en fournitures dentaires (annexée à la convention collective nationale des commerces de gros 0573)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0637": {
    libelle: "Industries et commerce de la récupération",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635466",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635466",
          titre:
            "Convention collective nationale des industries et du commerce de la récupération du 6 décembre 1971.  Etendue par arrêté du 4 janvier 1974 JONC 23 janvier 1974.  Elargie par arrêté du 16 janvier 1985 JONC 25 janvier 1985.",
          soustitre: "Industries et commerce de la récupération",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des industries et du commerce de la récupération (recyclage, régions Nord-Pas-de-Calais, Picardie)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0650": {
    libelle: "Métallurgie : ingénieurs et cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635842",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635842",
          titre:
            "Convention collective nationale des ingénieurs et cadres de la métallurgie du 13 mars 1972. Etendue par arrêté du 27 avril 1973 (JO du 29 mai 1973)",
          soustitre: "Métallurgie : ingénieurs et cadres",
        },
      ],
    },
  },
  "0652": {
    libelle: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635417",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635417",
          titre:
            "Convention collective nationale des cadres du négoce des matériaux de construction du 21 mars 1972.  Etendue par arrêté du 7 août 1972 (JO du 20 août 1972).\nRemplacée par la convention collective nationale des salariés du négoce des matériaux de construction du 8 décembre 2015 (IDCC 3216)",
          soustitre: "Matériaux : négoce des matériaux de construction (cadres, ETAM et ouvriers)",
        },
      ],
    },
  },
  "0653": {
    libelle:
      "Convention collective nationale de travail des producteurs salariés de base des services extérieurs de production des sociétés d'assurances",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des producteurs salariés de base des services extérieurs de production des sociétés d'assurances",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0669": {
    libelle: "Industries de fabrication mécanique du verre",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635650",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635650",
          titre: "Convention collective nationale des industries de fabrication mécanique du verre du 8 juin 1972",
          soustitre: "Industries de fabrication mécanique du verre",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des industries de fabrication mécanique du verre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0673": {
    libelle: "Fourrure",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635193",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635193",
          titre: "Convention collective nationale de la fourrure du 29 juin 1972.\n",
          soustitre: "Fourrure",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la fourrure (annexée à la convention collective nationale de la couture parisienne 0303)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0675": {
    libelle: "Maisons à succursales de vente au détail d'habillement",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635617",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635617",
          titre:
            "Convention collective nationale des maisons à succursales de vente au détail d'habillement du 30 juin 1972.  Etendue par arrêté du 8 décembre 1972 (JO du 7 janvier 1973).",
          soustitre: "Maisons à succursales de vente au détail d'habillement",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des maisons à succursales de vente au détail d'habillement",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0693": {
    libelle: "Presse quotidienne régionale et départementale : ouvriers et employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635680",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635680",
          titre:
            "Convention collective de travail des employés de la presse quotidienne départementale du 11 octobre 1972. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : ouvriers et employés",
        },
      ],
    },
  },
  "0698": {
    libelle: "Presse quotidienne régionale et départementale : ouvriers et employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635465",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635465",
          titre:
            "Convention collective de travail des employés de la presse quotidienne régionale du 28 novembre 1972. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : ouvriers et employés",
        },
      ],
    },
  },
  "0700": {
    libelle: "Production des papiers, cartons et celluloses (Ingénieurs et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635440",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635440",
          titre:
            "Convention collective nationale des ingénieurs et cadres de la production des papiers, cartons et celluloses du 4 décembre 1972.",
          soustitre: "Production des papiers, cartons et celluloses (Ingénieurs et cadres)",
        },
      ],
    },
  },
  "0706": {
    libelle: "Personnel de la reprographie",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635891",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635891",
          titre:
            "Convention collective nationale du personnel de la reprographie du 18 décembre 1972. Mise à jour en juin 1976.  Etendue par arrêté du 23 novembre 1976 JONC 19 décembre 1976.\n",
          soustitre: "Personnel de la reprographie",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel de la reprographie (annexée à la convention collective nationale des commerces de détail de papeterie, fournitures de bureau, de bureautique et informatique et de librairie 1539)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0707": {
    libelle: "Transformation des papiers-cartons et de la pellicule cellulosique (ingénieurs et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635669",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635669",
          titre:
            "Convention collective nationale des ingénieurs et cadres de la transformation des papiers, cartons et de la pellicule cellulosique du 21 décembre 1972.",
          soustitre: "Transformation des papiers-cartons et de la pellicule cellulosique (ingénieurs et cadres)",
        },
      ],
    },
  },
  "0715": {
    libelle: "Instruments à écrire et industries connexes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635873",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635873",
          titre:
            "Convention collective nationale des instruments à écrire et des industries connexes du 13 février 1973. Etendue par arrêté du 14 septembre 1973 JONC 5 octobre 1973 rectificatif JONC 20 octobre 1973.\n\n",
          soustitre: "Instruments à écrire et industries connexes",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des instruments à écrire et des industries connexes (annexée à la convention collective du personnel des industries du cartonnage 0489)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0716": {
    libelle: "Cinéma : distribution de films (employés et ouvriers, cadres et agents de maîtrise)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635264",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635264",
          titre:
            "Convention collective nationale des employés et ouvriers de la distribution cinématographique du 1er mars 1973.  Etendue par arrêté du 18 octobre 1977 (JO du 17 décembre 1977)",
          soustitre: "Cinéma : distribution de films (employés et ouvriers, cadres et agents de maîtrise)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des employés et ouvriers de la distribution cinématographique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0731": {
    libelle:
      "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635592",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635592",
          titre:
            "Convention collective interrégionale des commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison des cadres.  Etendue par arrêté du 13 juillet 1973 JORF 9 septembre 1973.",
          soustitre:
            "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
        },
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635592",
          titre:
            "Convention collective nationale des cadres des commerces de quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison du 23 juin 1971 (anciennement convention collective interrégionale). Etendue par arrêté du 13 juillet 1973 JORF 9 septembre 1973.",
          soustitre:
            "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
        },
      ],
    },
  },
  "0733": {
    libelle: "Détaillants en chaussures",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635629",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635629",
          titre:
            "Convention collective nationale des détaillants en chaussures du 27 juin 1973 (actualisée par avenant n° 79 du 8 décembre 2014 étendu par arrêté du 11 décembre 2015 JORF 23 décembre 2015)",
          soustitre: "Détaillants en chaussures",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des détaillants en chaussure",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0735": {
    libelle: "Machines à coudre : commerce",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635695",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635695",
          titre:
            "Convention collective nationale du commerce des machines à coudre du 1er juillet 1973. Etendue par arrêté du 19 mars 1974 JONC 10 avril 1974. \n",
          soustitre: "Machines à coudre : commerce",
        },
      ],
    },
  },
  "0749": {
    libelle: "Convention collective départementale des ouvriers du bâtiment et des travaux publics de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des ouvriers du bâtiment et des travaux publics de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0759": {
    libelle: "Pompes funèbres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635490",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635490",
          titre:
            "Convention collective nationale des pompes funèbres du 1er  mars 1974.  Etendue par arrêté du 17 décembre 1993 JORF 28 janvier 1994.",
          soustitre: "Pompes funèbres",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des pompes funèbres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0766": {
    libelle: "Presse périodique : employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635169",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635169",
          titre: "Convention collective nationale des employés de la presse périodique du 1er avril 1974.",
          soustitre: "Presse périodique : employés",
        },
      ],
    },
  },
  "0771": {
    libelle:
      "Convention collective départementale des ingénieurs assimilés et cadres du bâtiment et des travaux publics de La Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des ingénieurs assimilés et cadres du bâtiment et des travaux publics de La Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0779": {
    libelle: "Voies ferrées d'intérêt local",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635651",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635651",
          titre:
            "Convention collective nationale du personnel des voies ferrées d'intérêt local du 26 septembre 1974.  Etendue par arrêté du 23 juin 1975 JORF 17 juillet 1975.",
          soustitre: "Voies ferrées d'intérêt local",
        },
      ],
    },
  },
  "0780": {
    libelle:
      "Convention collective régionale des tailleurs sur mesure de la région parisienne (annexée à la convention collective nationale de la couture parisienne 0303)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des tailleurs sur mesure de la région parisienne (annexée à la convention collective nationale de la couture parisienne 0303)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0781": {
    libelle: "Presse quotidienne régionale et départementale : cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635951",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635951",
          titre:
            "Convention collective des cadres administratifs de la presse quotidienne départementale du 1er octobre 1974. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : cadres",
        },
      ],
    },
  },
  "0783": {
    libelle:
      "Convention collective nationale des centres d'hébergement et de réadaptation sociale et dans les services d'accueil, d'orientation et d'insertion pour adultes (CHRS, SOP )",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des centres d'hébergement et de réadaptation sociale et dans les services d'accueil, d'orientation et d'insertion pour adultes (CHRS, SOP )",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0787": {
    libelle: "Personnel des cabinets d'experts-comptables et de commissaires aux comptes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635826",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635826",
          titre:
            "Convention collective nationale des cabinets d'experts-comptables et de commissaires aux comptes du 9 décembre 1974. Etendue par arrêté du 30 mai 1975 JONC 12 juin 1975.\n",
          soustitre: "Personnel des cabinets d'experts-comptables et de commissaires aux comptes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cabinets d'experts-comptables et de commissaires aux comptes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0802": {
    libelle: "Distribution et commerces de gros des papiers et cartons (OETAM)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635441",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635441",
          titre:
            "Convention collective nationale de la distribution des papiers-cartons commerces de gros pour les ouvriers, employés, techniciens et agents de maîtrise du 28 juillet 1975. Étendue par arrêté du 5 juillet 1977 JONC 3 août 1977.\nRemplacée par la convention collective nationale de la distribution et du commerce de gros des papiers-cartons (IDCC 3224)",
          soustitre: "Distribution et commerces de gros des papiers et cartons (OETAM)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la distribution de papiers-cartons commerces de gros pour les ouvriers, employés, techniciens et agents de maîtrise",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0804": {
    libelle: "Accord national interprofessionnel des voyageurs, représentants, placiers (VRP)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accord national interprofessionnel des voyageurs, représentants, placiers (VRP)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0832": {
    libelle: "Ciment : industrie de la fabrication des ciments",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635684",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635684",
          titre:
            "Convention collective nationale du personnel ouvrier de l'industrie de la fabrication des ciments du 2 février 1976. Etendue par arrêté du 29 juin 1994 JORF 13 juillet 1994.\nRemplacée par la convention collective nationale de l’industrie de la fabrication des ciments du 2 octobre 2019 (IDCC 3233)",
          soustitre: "Ciment : industrie de la fabrication des ciments",
        },
      ],
    },
  },
  "0833": {
    libelle: "Ciment : industrie de la fabrication des ciments",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635676",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635676",
          titre:
            "Convention collective nationale du personnel employés, techniciens, dessinateurs et agents de maîtrise de l'industrie de la fabrication des ciments du 2 février 1976. Etendue par arrêté du 29 juin 1994 JORF 13 juillet 1994.\nRemplacée par la convention collective nationale de l’industrie de la fabrication des ciments du 2 octobre 2019 (IDCC 3233)\n",
          soustitre: "Ciment : industrie de la fabrication des ciments",
        },
      ],
    },
  },
  "0843": {
    libelle: "Boulangerie-pâtisserie (entreprises artisanales)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635886",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635886",
          titre:
            "Convention collective nationale de la boulangerie-pâtisserie du 19 mars 1976. Etendue par arrêté du 21 juin 1978 JONC 28 juillet 1978.",
          soustitre: "Boulangerie-pâtisserie (entreprises artisanales)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la boulangerie-pâtisserie -entreprises artisanales-",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0892": {
    libelle: "Cinéma : distribution de films (employés et ouvriers, cadres et agents de maîtrise)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635265",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635265",
          titre:
            "Convention collective nationale des cadres et agents de maîtrise de la distribution des films de l'industrie cinématographique du 30 juin 1976.  Etendue par arrêté du 15 avril 1977 (JO du 29 mai 1977)",
          soustitre: "Cinéma : distribution de films (employés et ouvriers, cadres et agents de maîtrise)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des cadres et agents de maîtrise de la distribution de films de l'industrie cinématographique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0897": {
    libelle: "Services de santé au travail interentreprises",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635223",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635223",
          titre:
            "Convention collective nationale des services de santé au travail interentreprises du 20 juillet 1976. Etendue par arrêté du 18 octobre 1976 JORF 29 octobre 1976.",
          soustitre: "Services de santé au travail interentreprises",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635223",
          titre:
            "Convention collective nationale du personnel des services interentreprises de médecine du travail du 20 juillet 1976.  Etendu par arrêté du 18 octobre 1976 JORF 29 octobre 1976.",
          soustitre: "Services de santé au travail interentreprises",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des services de santé au travail interentreprises",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0901": {
    libelle: "Convention collective départementale des ouvriers de la boulangerie de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des ouvriers de la boulangerie de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0915": {
    libelle: "Entreprises d'expertises en matière d'évaluations industrielles et commerciales",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635660",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635660",
          titre:
            "Convention collective nationale des entreprises d'expertises en matière d'évaluations industrielles et commerciales du 7 décembre 1976.  Etendue par arrêté du 5 juillet 1977 JONC 31 juillet 1977.",
          soustitre: "Entreprises d'expertises en matière d'évaluations industrielles et commerciales",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des sociétés d'expertises et d'évaluations",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0919": {
    libelle:
      "Convention collective départementale du personnel des garages de la Martinique (Automobile, commerce, réparation)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale du personnel des garages de la Martinique (Automobile, commerce, réparation)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0925": {
    libelle: "Distribution et commerce de gros des papiers et cartons (ingénieurs et cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635914",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635914",
          titre:
            "Convention collective nationale des ingénieurs et cadres de la distribution des papiers et cartons, commerce de gros du 12 janvier 1977.   Etendue par arrêté du 27 septembre 1984 JONC 10 octobre 1984.\nRemplacée par la convention collective nationale de la distribution et du commerce de gros des papiers-cartons (IDCC 3224)",
          soustitre: "Distribution et commerce de gros des papiers et cartons (ingénieurs et cadres)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des ingénieurs et cadres de la distribution des papiers et cartons, commerce de gros",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0951": {
    libelle: "Théâtre : entreprises de spectacles vivants (théâtres privés)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635726",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635726",
          titre:
            "Convention collective nationale des théâtres privés du 25 novembre 1977.  Etendue par arrêté du 3 août 1993 JORF 4 septembre 1993.",
          soustitre: "Théâtre : entreprises de spectacles vivants (théâtres privés)",
        },
      ],
    },
  },
  "0953": {
    libelle: "Charcuterie de détail",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635375",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635375",
          titre: "Convention collective nationale de la charcuterie de détail du 4 avril 2007",
          soustitre: "Charcuterie de détail",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635375",
          titre:
            "Convention collective nationale de la charcuterie de détail du 1er décembre 1977. Etendue par arrêté du 6 juin 1978 JONC 22 juin 1978.",
          soustitre: "Charcuterie de détail",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la charcuterie de détail",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0959": {
    libelle: "Laboratoires de biologie médicale extrahospitaliers",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635844",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635844",
          titre:
            "Convention collective nationale des laboratoires de biologie médicale extra-hospitaliers du 3 février 1978.",
          soustitre: "Laboratoires de biologie médicale extrahospitaliers",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635844",
          titre:
            "Convention collective nationale des laboratoires d'analyses médicales extra-hospitaliers du 3 février 1978.  ",
          soustitre: "Laboratoires de biologie médicale extrahospitaliers",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des laboratoires de biologie médicale extra-hospitaliers",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0972": {
    libelle: "Parfumerie, esthétique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635182",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "DENONCE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635182",
          titre:
            "Convention collective nationale de la parfumerie de détail et de l'esthétique du 11 mai 1978.   Etendue par arrêté du 20 mai 1980 JONC 10 juin 1980.",
          soustitre: "Parfumerie, esthétique",
        },
      ],
    },
  },
  "0992": {
    libelle: "Boucherie, boucherie-charcuterie, boucherie hippophagique, triperie, commerces de volailles et gibiers",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635593",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635593",
          titre:
            "Convention collective nationale de la boucherie, boucherie-charcuterie, boucherie hippophagique, triperie, commerces de volailles et gibiers du 12 décembre 1978, actualisée par l'avenant n° 114 du 10 juillet 2006",
          soustitre:
            "Boucherie, boucherie-charcuterie, boucherie hippophagique, triperie, commerces de volailles et gibiers",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635593",
          titre:
            "Convention collective nationale de la boucherie, boucherie-charcuterie et boucherie hippophagique.  Etendue par arrêté du 15 mai 1979 JONC 3 juin 1979.",
          soustitre:
            "Boucherie, boucherie-charcuterie, boucherie hippophagique, triperie, commerces de volailles et gibiers",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la boucherie, boucherie-charcuterie et boucherie hippophagique, triperie, commerce de volailles et gibiers",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0993": {
    libelle: "Prothésistes dentaires et personnels des laboratoires de prothèses dentaires",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635414",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635414",
          titre:
            "Convention collective nationale des prothésistes dentaires et des personnels des laboratoires de prothèse dentaire du 18 décembre 1978. Etendue par arrêté du 28 février 1979 JORF 17 mars 1979.",
          soustitre: "Prothésistes dentaires et personnels des laboratoires de prothèses dentaires",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des prothésistes dentaires et des personnels des laboratoires de prothèse dentaire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "0998": {
    libelle: "Thermique : équipements thermiques (OETAM, cadres, ingénieurs et assimilés)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635452",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635452",
          titre:
            "Convention collective nationale des ouvriers, employés, techniciens et agents de maîtrise de l'exploitation d'équipements thermiques et de génie climatique du 7 février 1979.  ",
          soustitre: "Thermique : équipements thermiques (OETAM, cadres, ingénieurs et assimilés)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des ouvriers, employés, techniciens et agents de maîtrise de l'exploitation d'équipements thermiques et de génie climatique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1000": {
    libelle: "Avocats : personnel des cabinets",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635185",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635185",
          titre:
            "Convention collective nationale des avocats et de leur personnel du 20 février 1979. Etendue par arrêté du 13 novembre 1979 JONC 9 janvier 1980",
          soustitre: "Avocats : personnel des cabinets",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des cabinets d'avocats",
        id_kali: "KALICONT000005635185",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1979-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635185",
      },
    },
  },
  "1001": {
    libelle: "Handicapés : établissements et services pour les personnes inadaptées et handicapées",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635179",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635179",
          titre:
            "Convention collective nationale des médecins spécialistes qualifiés au regard du conseil de l'ordre travaillant dans les établissements et services pour personnes inadaptées et handicapées du 1er mars 1979.\n",
          soustitre: "Handicapés : établissements et services pour les personnes inadaptées et handicapées",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des médecins spécialistes qualifiés au regard du conseil de l'ordre travaillant dans des établissements et services pour personnes inadaptées et handicapées (annexée à la convention collective nationale de travail des établissements et services pour personnes inadaptées et handicapées 0413)",
        id_kali: "KALICONT000005635179",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "1979-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635179",
      },
    },
  },
  "1014": {
    libelle: "Sociétés d'économie mixte d'autoroutes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635915",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635915",
          titre: "Convention collective des sociétés d'économie mixte d'autoroutes du 1er  juin 1979",
          soustitre: "Sociétés d'économie mixte d'autoroutes",
        },
      ],
    },
  },
  "1016": {
    libelle: "Edition de musique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635947",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635947",
          titre:
            "Convention collective nationale des cadres et agents de maîtrise de l'édition de musique du 14 juin 1979.  Etendue par arrêté du 27 juin 1985 JONC 5 juillet 1985.\n",
          soustitre: "Edition de musique",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des cadres et agents de maîtrise de l'édition de musique (annexée à la convention collective nationale de l'édition 2121)",
        id_kali: "KALICONT000005635947",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1979-06-14 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635947",
      },
    },
  },
  "1018": {
    libelle: "Presse quotidienne régionale et départementale : cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635952",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635952",
          titre:
            "Convention collective des cadres techniques de la presse quotidienne départementale du 12 juin 1979.\nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : cadres",
        },
      ],
    },
  },
  "1031": {
    libelle: "Convention collective nationale de la fédération nationale des associations familiales rurales (FNAFR)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale de la fédération nationale des associations familiales rurales (FNAFR)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1043": {
    libelle: "Gardiens, concierges et employés d'immeubles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635953",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635953",
          titre:
            "Convention collective nationale des gardiens, concierges et employés d'immeubles (réécrite par l'avenant n° 74 du 27 avril 2009 portant modification de la convention)",
          soustitre: "Gardiens, concierges et employés d'immeubles",
        },
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635953",
          titre:
            "Convention collective nationale de travail des gardiens, concierges et employés d'immeubles du 11 décembre 1979.  Etendue par arrêté du 15 avril 1981 JONC 16 mai 1981.",
          soustitre: "Gardiens, concierges et employés d'immeubles",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des gardiens, concierges et employés d'immeubles",
        id_kali: "KALICONT000005635953",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2009-04-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635953",
      },
    },
  },
  "1044": {
    libelle: "Horlogerie : commerce de gros, pièces détachées, accessoires et outillage",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635887",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635887",
          titre: "Convention collective nationale de l'horlogerie du 17 décembre 1979.\n",
          soustitre: "Horlogerie : commerce de gros, pièces détachées, accessoires et outillage",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de l'horlogerie (annexée à la convention collective nationale de la bijouterie, joaillerie, orfèvrerie et des activités qui s'y rattachent 0567)",
        id_kali: "KALICONT000005635887",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1979-12-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635887",
      },
    },
  },
  "1049": {
    libelle:
      "Convention collective départementale du bâtiment, des travaux publics et de toutes professions concourant à l'acte de bâtir ou d'aménager de Saint Pierre-et-Miquelon",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale du bâtiment, des travaux publics et de toutes professions concourant à l'acte de bâtir ou d'aménager de Saint Pierre-et-Miquelon",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1050": {
    libelle: "Convention collective départementale du commerce et des services commerciaux de Saint-Pierre-et-Miquelon",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale du commerce et des services commerciaux de Saint-Pierre-et-Miquelon",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1057": {
    libelle: "Convention collective départementale des consignataires de navire et manutentionnaires de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des consignataires de navire et manutentionnaires de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1060": {
    libelle: "Convention collective départementale de la métallurgie de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de la métallurgie de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1069": {
    libelle: "Convention collective départementale de la répartition et des dépôts pharmaceutiques de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de la répartition et des dépôts pharmaceutiques de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1072": {
    libelle:
      "Convention collective locale du travail règlementant le travail de manutention dans le port de Saint-Pierre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective locale du travail règlementant le travail de manutention dans le port de Saint-Pierre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1077": {
    libelle: "Produits du sol, engrais et produits connexes : négoce et industrie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635910",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635910",
          titre:
            "Convention collective nationale des entreprises du négoce et de l'industrie des produits du sol, engrais et produits connexes du 2 juillet 1980.  ",
          soustitre: "Produits du sol, engrais et produits connexes : négoce et industrie",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale entreprises du négoce et de l'industrie des produits du sol, engrais et produits connexes",
        id_kali: "KALICONT000005635910",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1980-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635910",
      },
    },
  },
  "1083": {
    libelle: "Presse quotidienne régionale et départementale : ouvriers et employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635245",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635245",
          titre:
            "Convention collective de travail des ouvriers de la presse quotidienne départementale du 25 octobre 1980.\nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : ouvriers et employés",
        },
      ],
    },
  },
  "1090": {
    libelle:
      "Services de l'automobile (Commerce et réparation de l'automobile, du cycle et du motocycle, activités connexes, contrôle technique automobile, formation des conducteurs)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635191",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635191",
          titre:
            "Convention collective nationale du commerce et de la réparation de l'automobile, du cycle et du motocycle et des activités connexes, ainsi que du contrôle technique automobile du 15 janvier 1981. Etendue par arrêté du 30 octobre 1981 JONC 3 décembre 1981.",
          soustitre:
            "Services de l'automobile (Commerce et réparation de l'automobile, du cycle et du motocycle, activités connexes, contrôle technique automobile, formation des conducteurs)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des services de l'automobile (commerce et réparation de l'automobile, du cycle et du motocycle, activités connexes, contrôle technique automobile, formation des conducteurs auto-écoles CNPA )",
        id_kali: "KALICONT000005635191",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1981-04-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635191",
      },
    },
  },
  "1119": {
    libelle: "Industries de la fabrication de la chaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635668",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635668",
          titre:
            "Convention collective nationale pour le personnel d'encadrement de l'industrie de la fabrication de la chaux du 27 avril 1981, mise à jour au 1er mars 1982.  Etendue par arrêté du 5 novembre 1982 JONC 21 décembre 1982.",
          soustitre: "Industries de la fabrication de la chaux",
        },
      ],
    },
  },
  "1140": {
    libelle: "Convention collective départementale des hôtels cafés restaurants de Saint-Pierre-et-Miquelon(HCR)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des hôtels cafés restaurants de Saint-Pierre-et-Miquelon(HCR)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1147": {
    libelle: "Personnel des cabinets médicaux",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635409",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635409",
          titre: "Convention collective nationale du personnel des cabinets médicaux  du 14 octobre 1981",
          soustitre: "Personnel des cabinets médicaux",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des cabinets médicaux (médecin)",
        id_kali: "KALICONT000005635409",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1982-02-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635409",
      },
    },
  },
  "1170": {
    libelle: "Industries des tuiles et briques",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635251",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635251",
          titre: "Convention collective nationale de l'industrie des tuiles et briques du 17 février 1982",
          soustitre: "Industries des tuiles et briques",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie des tuiles et briques (CCNTB)",
        id_kali: "KALICONT000005635251",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1982-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635251",
      },
    },
  },
  "1177": {
    libelle: "Industries de la fabrication de la chaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635913",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635913",
          titre:
            "Convention collective nationale des industries de la fabrication de la chaux - Ouvriers du 15 juin 1970. Mise à jour au 1er mars 1982.  Etendue par arrêté du 5 novembre 1982 JONC 21 décembre 1982.",
          soustitre: "Industries de la fabrication de la chaux",
        },
      ],
    },
  },
  "1178": {
    libelle: "Industries de la fabrication de la chaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635667",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635667",
          titre:
            "Convention collective nationale du personnel Employé, technicien, dessinateur, et agent de maîtrise de l'industrie de la fabrication de la chaux du 21 mars 1974. Mise à jour au 1er mars 1982.  Etendue par arrêté du 5 novembre 1982 JONC 21 décembre 1982.",
          soustitre: "Industries de la fabrication de la chaux",
        },
      ],
    },
  },
  "1182": {
    libelle: "Ports de plaisance",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635906",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635906",
          titre: "Convention collective nationale des personnels des ports de plaisance du 8 mars 2012",
          soustitre: "Ports de plaisance",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635906",
          titre:
            "Convention collective nationale des personnels des ports de plaisance du 16 mars 1982.  Etendue par arrêté du 18 novembre 1982 JONC 11 janvier 1983.",
          soustitre: "Ports de plaisance",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des personnels des ports de plaisance",
        id_kali: "KALICONT000005635906",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635906",
      },
    },
  },
  "1194": {
    libelle: "Musique graphique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635254",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635254",
          titre:
            "Convention collective nationale des employés de l'édition de musique du 15 avril 1982.  Etendue par arrêté du 27 juin 1985 JONC 5 juillet 1985.\n",
          soustitre: "Musique graphique",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des employés de l'édition de musique (annexée à la convention collective nationale de l'édition 2121)",
        id_kali: "KALICONT000005635254",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1982-04-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635254",
      },
    },
  },
  "1203": {
    libelle: "Convention collective départementale du commerce et des services de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale du commerce et des services de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1211": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635866",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635866",
          titre:
            "Convention collective nationale des documentalistes des établissements d'enseignement secondaire et technique privés. En vigueur le 1er septembre 1982.",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "1225": {
    libelle: "Convention collective départementale du commerce de la Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale du commerce de la Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1232": {
    libelle: "Convention collective départementale des hôtels de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des hôtels de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1237": {
    libelle: "Centres de gestion agréés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635909",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635909",
          titre: "Convention collective nationale des centres de gestion agréés du 17 janvier 1983.",
          soustitre: "Centres de gestion agréés",
        },
      ],
    },
  },
  "1247": {
    libelle: "Convention collective départementale auto moto de la Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale auto moto de la Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1256": {
    libelle: "Thermique : équipements thermiques (OETAM, cadres, ingénieurs et assimilés)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635671",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635671",
          titre:
            "Convention collective nationale des cadres, ingénieurs et assimilés des entreprises de gestion d'équipements thermiques et de climatisation du 3 mai 1983. ",
          soustitre: "Thermique : équipements thermiques (OETAM, cadres, ingénieurs et assimilés)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des cadres, ingénieurs et assimilés des entreprises de gestion d'équipements thermiques et de climatisation",
        id_kali: "KALICONT000005635671",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1983-05-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635671",
      },
    },
  },
  "1257": {
    libelle:
      "Convention collective départementale des employés, agents de maîtrise et cadres de la pharmacie d'officine de la Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des employés, agents de maîtrise et cadres de la pharmacie d'officine de la Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1258": {
    libelle: "Organismes d'aide ou de maintien à domicile",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635478",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635478",
          titre:
            "Convention collective nationale des organismes d'aide ou de maintien à domicile du 11 mai 1983.  Agréée par arrêté du 18 mai 1983 JONC 10 juin 1983.",
          soustitre: "Organismes d'aide ou de maintien à domicile",
        },
      ],
    },
  },
  "1261": {
    libelle:
      "Acteurs du lien social et familial (centres sociaux et socioculturels, associations d'accueil de jeunes enfants, associations de développement social local)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635384",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635384",
          titre:
            "Convention collective nationale des acteurs du lien social et familial : centres sociaux et socioculturels, associations d'accueil de jeunes enfants, associations de développement social local  du 4 juin 1983.  Etendue par arrêté du 22 janvier 1987 JORF 12 février 1987. (1)",
          soustitre:
            "Acteurs du lien social et familial (centres sociaux et socioculturels, associations d'accueil de jeunes enfants, associations de développement social local)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des acteurs du lien social et familial : centres sociaux et socioculturels, associations d'accueil de jeunes enfants, associations de développement social local (SNAECSO)",
        id_kali: "KALICONT000005635384",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1983-06-04 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635384",
      },
    },
  },
  "1266": {
    libelle: "Restauration de collectivités",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635418",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635418",
          titre:
            "Convention collective nationale du personnel des entreprises de restauration de collectivités du 20 juin 1983. Etendue par arrêté du 2 février 1984 JONC 17 février 1984",
          soustitre: "Restauration de collectivités",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des entreprises de restauration de collectivités",
        id_kali: "KALICONT000005635418",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-02-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635418",
      },
    },
  },
  "1267": {
    libelle: "Pâtisserie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635611",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635611",
          titre:
            "Convention collective nationale de la pâtisserie du 30 juin 1983.  Etendue par arrêté du 29 décembre 1983 JONC 13 janvier 1984.",
          soustitre: "Pâtisserie",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la pâtisserie",
        id_kali: "KALICONT000005635611",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1983-06-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635611",
      },
    },
  },
  "1278": {
    libelle:
      "Habitat : personnels PACT et ARIM (centres pour la protection, l'amélioration et la conservation de l'habitat et associations pour la restauration immobilière)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635652",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635652",
          titre:
            "Convention collective nationale des personnels PACT et ARIM du 21 octobre 1983. Etendue par arrêté du 13 décembre 1988 JORF 29 décembre 1988.\n",
          soustitre:
            "Habitat : personnels PACT et ARIM (centres pour la protection, l'amélioration et la conservation de l'habitat et associations pour la restauration immobilière)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des personnels PACT et ARIM -centres pour la protection l'amélioration et la conservation de l'habitat et associations pour la restauration immobilière- (annexée à la convention collective nationale de l'habitat et du logement accompagnés 2336)",
        id_kali: "KALICONT000005635652",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1983-10-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635652",
      },
    },
  },
  "1281": {
    libelle: "Presse périodique régionale",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635615",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635615",
          titre:
            "Convention collective nationale de travail des employés de presse hebdomadaire régionale (SNPNRI) du 8 décembre 1983. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse périodique régionale",
        },
      ],
    },
  },
  "1282": {
    libelle: "Commissaires-priseurs : études et organismes professionnels",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635257",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635257",
          titre:
            "Convention collective nationale du personnel des études et des organismes professionnels des commissaires-priseurs du 8 décembre 1983.",
          soustitre: "Commissaires-priseurs : études et organismes professionnels",
        },
      ],
    },
  },
  "1285": {
    libelle: "Entreprises artistiques et culturelles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635964",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635964",
          titre:
            "Convention collective nationale pour les entreprises artistiques et culturelles du 1er janvier 1984.  Etendue par arrêté du 4 janvier 1994 JORF 26 janvier 1994.",
          soustitre: "Entreprises artistiques et culturelles",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale pour les entreprises artistiques et culturelles (SYNDEAC)",
        id_kali: "KALICONT000005635964",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635964",
      },
    },
  },
  "1286": {
    libelle: "Confiserie, chocolaterie, biscuiterie (détaillants et détaillants-fabricants)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635899",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635899",
          titre:
            "Convention collective nationale des détaillants et détaillants-fabricants de la confiserie,  chocolaterie, biscuiterie du 1er janvier 1984.  Etendue par arrêté du 2 octobre 1984 JONC 12 octobre 1984.\n",
          soustitre: "Confiserie, chocolaterie, biscuiterie (détaillants et détaillants-fabricants)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des détaillants, détaillants-fabricants et artisans de la confiserie, chocolaterie, biscuiterie",
        id_kali: "KALICONT000005635899",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635899",
      },
    },
  },
  "1307": {
    libelle: "Exploitation cinématographique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635203",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635203",
          titre: "Convention collective  nationale de l'exploitation cinématographique du 19 juillet 1984.\n",
          soustitre: "Exploitation cinématographique",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'exploitation cinématographique",
        id_kali: "KALICONT000005635203",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-07-19 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635203",
      },
    },
  },
  "1311": {
    libelle: "Restauration ferroviaire",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635694",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635694",
          titre:
            "Convention collective nationale de la restauration ferroviaire du 4 septembre 1984. Etendue par arrêté du 22 février 1985 JONC 7 mars 1985.",
          soustitre: "Restauration ferroviaire",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la restauration ferroviaire",
        id_kali: "KALICONT000005635694",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-10-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635694",
      },
    },
  },
  "1314": {
    libelle:
      "Organisations syndicales des salariés : Fédération des travailleurs des commerces et industries de l'alimentation CGT-FO, 198, avenue du Maine, 75630 PARIS CEDEX 14.",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005640320",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005640320",
          titre:
            'Accord collectif national du 18 juillet 1963 concernant les gérants non salariés des maisons d\'alimentation à succursales, supermarchés, hypermarchés "gérants mandataires" du 18 juillet 1963.  Mis à jour par accord du 24 septembre 1984. Etendu par arrêté du 25 avril 1985 JORF 14 mai 1985.',
          soustitre:
            "Organisations syndicales des salariés : Fédération des travailleurs des commerces et industries de l'alimentation CGT-FO, 198, avenue du Maine, 75630 PARIS CEDEX 14.",
        },
      ],
    },
  },
  "1316": {
    libelle: "Tourisme social et familial",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635867",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635867",
          titre:
            "Convention collective nationale de tourisme social et familial du 28 juin 1979, mise à jour du 10 octobre 1984  ",
          soustitre: "Tourisme social et familial",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de tourisme social et familial",
        id_kali: "KALICONT000005635867",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-10-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635867",
      },
    },
  },
  "1325": {
    libelle: "",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005675904",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005675904",
          titre:
            "Accord collectif national du 12 novembre 1951 relatif aux contrats individuels passés entre les gérants non salariés et les sociétés coopératives de consommation. Mis à jour par avenant du 21 novembre 1984 et par accord du 2 mars 2006.",
          soustitre: "",
        },
      ],
    },
  },
  "1326": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635956",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635956",
          titre:
            "Convention collective nationale des maîtres de l'enseignement primaire privé enseignant dans les classes hors contrat et sous contrat simple et ne relevant pas de la convention collective de travail de l'enseignement primaire catholique du 27 novembre 1984.",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "1334": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635957",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635957",
          titre: "Convention collective nationale des psychologues de l'enseignement privé du 11 janvier 1985.",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "1336": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635706",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635706",
          titre:
            "Convention collective nationale des personnels des services administratifs et économiques des établissements d'enseignement privé en vigueur le 1er février 1985.",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "1341": {
    libelle: "Convention collective départementale des industries agroalimentaires de la Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des industries agroalimentaires de la Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1351": {
    libelle: "Entreprises de prévention et de sécurité",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635405",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635405",
          titre:
            "Convention collective nationale des entreprises de prévention et de sécurité du 15 février 1985.  Etendue par arrêté du 25 juillet 1985 (JO du 30 juillet 1985)",
          soustitre: "Entreprises de prévention et de sécurité",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de prévention et de sécurité",
        id_kali: "KALICONT000005635405",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1985-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635405",
      },
    },
  },
  "1370": {
    libelle: "Hôtels de tourisme trois, quatre et quatre étoiles de luxe (région parisienne)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635658",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635658",
          titre:
            "Convention collective régionale des hôtels de tourisme trois, quatre et quatre étoiles luxe de Paris et de la région parisienne du 1er mai 1985",
          soustitre: "Hôtels de tourisme trois, quatre et quatre étoiles de luxe (région parisienne)",
        },
      ],
    },
  },
  "1383": {
    libelle:
      "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635591",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635591",
          titre:
            "Convention collective interrégionale des commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison des employés et personnel de maîtrise.  Etendue par arrêté du 29 avril 1986 JORF 1er juin 1986.",
          soustitre:
            "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
        },
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635591",
          titre:
            "Convention collective nationale des employés et agents de maîtrise des commerces de quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison. Etendue par arrêté du 29 avril 1986 JORF 1er juin 1986.",
          soustitre:
            "Quincaillerie : commerces de quincaillerie, fournitures industrielles, fers-métaux et équipements de la maison",
        },
      ],
    },
  },
  "1388": {
    libelle: "Industrie du pétrole",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635267",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635267",
          titre:
            "Convention collective nationale de l'industrie du pétrole du 3 septembre 1985.  Etendue par arrêté du 31 juillet 1986 JORF 9 août 1986.",
          soustitre: "Industrie du pétrole",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie du pétrole",
        id_kali: "KALICONT000005635267",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1985-09-03 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635267",
      },
    },
  },
  "1391": {
    libelle: "Manutention et nettoyage sur les aéroports (région parisienne)",
    nature: "CONVENTION COLLECTIVE RÉGIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635473",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635473",
          titre:
            "Convention collective régionale concernant le personnel de l'industrie de la manutention et du nettoyage sur les aéroports de la région parisienne ouverts à la circulation publique du 27 juillet 2016 (Avenant du 27 juillet 2016) - Étendue par arrêté du 17 septembre 2021 JORF 29 octobre 2021.\n",
          soustitre: "Manutention et nettoyage sur les aéroports (région parisienne)",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635473",
          titre:
            "Convention collective régionale concernant le personnel de l'industrie, de la manutention et du nettoyage sur les aéroports ouverts à la circulation publique du 1er octobre 1985. Etendue par arrêté du 16 juin 1986 JORF 24 juin 1986.",
          soustitre: "Manutention et nettoyage sur les aéroports (région parisienne)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective régionale concernant le personnel de l'industrie, de la manutention et du nettoyage sur les aéroports ouverts à la circulation publique de la région parisienne (annexée à la convention collective nationale du personnel au sol des entreprises de transport aérien 0275)",
        id_kali: "KALICONT000005635473",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE RÉGIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-10-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635473",
      },
    },
  },
  "1396": {
    libelle: "Industries de produits alimentaires élaborés",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635840",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635840",
          titre:
            "Convention collective nationale pour les industries de produits alimentaires élaborés du 17 janvier 1952. Mise à jour par accord du 22 octobre 1985. Etendue par arrêté du 16 avril 1986 JORF 25 avril 1986.",
          soustitre: "Industries de produits alimentaires élaborés",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635840",
          titre:
            "Convention collective nationale des industries de la conserve. Mise à jour par accord du 22 octobre 1985. Etendue par arrêté du 16 avril 1986 JORF 25 avril 1986.",
          soustitre: "Industries de produits alimentaires élaborés",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale pour les industries de produits alimentaires élaborés",
        id_kali: "KALICONT000005635840",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2004-12-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635840",
      },
    },
  },
  "1404": {
    libelle:
      "Entreprises de la maintenance, distribution et location de matériels agricoles, de travaux publics, de bâtiment, de manutention, de motoculture de plaisance et activités connexes, dite SDLM",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635653",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635653",
          titre:
            "Convention collective nationale métropolitaine des entreprises de la maintenance, distribution et location de matériels agricoles, de travaux publics, de bâtiment, de manutention, de motoculture de plaisance et activités connexes, dite SDLM du 23 avril 2012",
          soustitre:
            "Entreprises de la maintenance, distribution et location de matériels agricoles, de travaux publics, de bâtiment, de manutention, de motoculture de plaisance et activités connexes, dite SDLM",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635653",
          titre:
            "Convention collective nationale des entreprises de commerce, de location et de réparation de tracteurs, machines et matériels agricoles, de matériels de travaux publics, de bâtiment et de manutention, de matériels de motoculture de plaisance, de jardins et d'espaces verts du 30 octobre 1969.  Etendue par arrêté du 11 octobre 1971 (JO du 7 novembre 1971).",
          soustitre:
            "Entreprises de la maintenance, distribution et location de matériels agricoles, de travaux publics, de bâtiment, de manutention, de motoculture de plaisance et activités connexes, dite SDLM",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises de commerce, de location et de réparation de tracteurs, machines et matériels agricoles, de matériels de travaux publics, de bâtiment et de manutention, de matériels de motoculture de plaisance, de jardins et d'espaces verts (SEDIMA)",
        id_kali: "KALICONT000005635653",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-11-03 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635653",
      },
    },
  },
  "1405": {
    libelle: "Expédition et exportation de fruits et légumes",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635142",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635142",
          titre:
            "Convention collective nationale des entreprises d'expédition et d'exportation de fruits et légumes du 17 décembre 1985.  Etendue par arrêté du 24 avril 1986 JORF 8 mai 1986.",
          soustitre: "Expédition et exportation de fruits et légumes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises d'expédition et d'exportation de fruits et légumes",
        id_kali: "KALICONT000005635142",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1986-05-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635142",
      },
    },
  },
  "1408": {
    libelle: "Négoce et distribution de combustibles solides, liquides, gazeux et produits pétroliers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635427",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635427",
          titre:
            "Convention collective nationale du négoce et de distribution de combustibles solides, liquides, gazeux, produits pétroliers du 20 décembre 1985",
          soustitre: "Négoce et distribution de combustibles solides, liquides, gazeux et produits pétroliers",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises du négoce et de distribution de combustibles solides, liquides, gazeux et produits pétroliers",
        id_kali: "KALICONT000005635427",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1985-12-20 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635427",
      },
    },
  },
  "1411": {
    libelle: "Ameublement (fabrication)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635616",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635616",
          titre:
            "Convention collective nationale de la fabrication de l'ameublement du 14 janvier 1986.  Etendue par arrêté du 28 mai 1986 (JORF du 22 juin 1986).\n",
          soustitre: "Ameublement (fabrication)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la fabrication de l'ameublement",
        id_kali: "KALICONT000005635616",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1986-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635616",
      },
    },
  },
  "1412": {
    libelle: "Installation, entretien, réparation et dépannage de matériel aéraulique, thermique et frigorifique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635396",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635396",
          titre:
            "Convention collective nationale des entreprises d'installation sans fabrication, y compris entretien, réparation, dépannage de matériel aéraulique, thermique, frigorifique et connexes du 21 janvier 1986. ",
          soustitre:
            "Installation, entretien, réparation et dépannage de matériel aéraulique, thermique et frigorifique",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises d'installation sans fabrication, y compris entretien, réparation, dépannage de matériel aéraulique, thermique, frigorifique et connexes",
        id_kali: "KALICONT000005635396",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1986-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635396",
      },
    },
  },
  "1413": {
    libelle: "Accord national professionnel relatif aux salariés permanents des entreprises de travail temporaire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accord national professionnel relatif aux salariés permanents des entreprises de travail temporaire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1423": {
    libelle: "Navigation de plaisance",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635429",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635429",
          titre:
            "Convention collective nationale des entreprises relevant de la navigation de plaisance du 31 mars 1979.  Etendue par arrêté du 1er juin 1988 JORF 8 juin 1988.",
          soustitre: "Navigation de plaisance",
        },
      ],
    },
  },
  "1424": {
    libelle: "Réseaux de transports publics urbains de voyageurs",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635740",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635740",
          titre:
            "Convention collective nationale des réseaux de transports publics urbains de voyageurs du 11 avril 1986.  Etendue par arrêté du 25 janvier 1993 JORF 30 janvier 1993.",
          soustitre: "Réseaux de transports publics urbains de voyageurs",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des réseaux de transports publics urbains de voyageurs",
        id_kali: "KALICONT000005635740",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1986-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635740",
      },
    },
  },
  "1431": {
    libelle: "Optique-lunetterie de détail",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912",
          titre:
            "Convention collective nationale de l'optique-lunetterie de détail du 13 juin 2019 (actualisée par l'avenant du 13 juin 2019) ",
          soustitre: "Optique-lunetterie de détail",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912",
          titre:
            "Convention collective nationale de l'optique-lunetterie de détail du 2 juin 1986.  Etendue par arrêté du 15 octobre 1986 JORF 14 décembre 1986.",
          soustitre: "Optique-lunetterie de détail",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'optique-lunetterie de détail",
        id_kali: "KALICONT000005635912",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-06-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635912",
      },
    },
  },
  "1436": {
    libelle: "Sucreries, sucreries-distilleries et raffineries de sucre",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635888",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635888",
          titre:
            "Convention collective nationale de travail en sucrerie, en sucrerie-distillerie et en raffinerie du 1er  octobre 1986. CETTE CONVENTION A ETE REMPLACEE PAR UN NOUVEAU TEXTE EN DATE DU 31 JANVIER 2008 (IDCC 2728) ",
          soustitre: "Sucreries, sucreries-distilleries et raffineries de sucre",
        },
      ],
    },
  },
  "1446": {
    libelle: "Enseignement technique privé hors contrat : personnels enseignants, chefs de travaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635878",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635878",
          titre:
            "Convention collective nationale des personnels enseignant hors contrat et des chefs de travaux exerçant des responsabilités hors contrat dans les établissements d'enseignement technique privés du 18 décembre 1986.",
          soustitre: "Enseignement technique privé hors contrat : personnels enseignants, chefs de travaux",
        },
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635878",
          titre:
            "Convention collective nationale des personnels enseignant hors contrat et des chefs de travaux exerçant des responsabilités hors contrat dans les établissements d'enseignement technique privés révisée le 7 janvier 2013",
          soustitre: "Enseignement technique privé hors contrat : personnels enseignants, chefs de travaux",
        },
      ],
    },
  },
  "1465": {
    libelle: "Peintres en lettres graphistes-décorateurs en signalisation, enseignes, publicité peinte",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635890",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635890",
          titre:
            "Convention collective nationale des peintres en lettres, décorateurs et graphistes en signalisation, enseignes, publicité peinte du 12 juin 1987. Etendue par arrêté du 10 janvier 1989 JORF 18 janvier 1989.",
          soustitre: "Peintres en lettres graphistes-décorateurs en signalisation, enseignes, publicité peinte",
        },
      ],
    },
  },
  "1468": {
    libelle: "Convention collective nationale de branche du Crédit mutuel",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale de branche du Crédit mutuel",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1480": {
    libelle: "Journalistes",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635444",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635444",
          titre:
            "Convention collective nationale des journalistes du 1er novembre 1976, refondue le 27 octobre 1987.  Etendue par arrêté du 2 février 1988 (JO du 13 février 1988)",
          soustitre: "Journalistes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de travail des journalistes",
        id_kali: "KALICONT000005635444",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1987-10-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635444",
      },
    },
  },
  "1483": {
    libelle: "Commerce de détail de l'habillement et des articles textiles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635594",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635594",
          titre:
            "Convention collective nationale du commerce de détail de l'habillement et des articles textiles du 25 novembre 1987, révisée par avenant du 17 juin 2004",
          soustitre: "Commerce de détail de l'habillement et des articles textiles",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635594",
          titre:
            "Convention collective nationale du commerce de détail de l'habillement et des articles textiles. En vigueur le 1er novembre 1987.  Etendue par arrêté du 9 juin 1988 JORF 18 juin 1988.",
          soustitre: "Commerce de détail de l'habillement et des articles textiles",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du commerce de détail de l'habillement et des articles textiles",
        id_kali: "KALICONT000005635594",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2005-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635594",
      },
    },
  },
  "1486": {
    libelle: "Bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseils",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635173",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635173",
          titre:
            "Convention collective nationale des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils du 16 juillet 2021 (Avenant n° 46 du 16 juillet 2021)",
          soustitre: "Bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseils",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635173",
          titre:
            "Convention collective nationale des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils du 15 décembre 1987. \n",
          soustitre: "Bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseils",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale applicable au personnel des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils(BET, SYNTEC)",
        id_kali: "KALICONT000005635173",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635173",
      },
    },
  },
  "1487": {
    libelle: "Horlogerie-bijouterie (commerce de détail)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635827",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635827",
          titre:
            "Convention collective nationale du commerce de détail de l'horlogerie bijouterie du 17 décembre 1987. Etendue par arrêté du 20 octobre 1988 JORF 28 octobre 1988.",
          soustitre: "Horlogerie-bijouterie (commerce de détail)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du commerce de détail de l'horlogerie-bijouterie",
        id_kali: "KALICONT000005635827",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635827",
      },
    },
  },
  "1492": {
    libelle: "Production des papiers-cartons et celluloses (OEDTAM)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635192",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635192",
          titre:
            "Convention collective nationale des ouvriers, employés, dessinateurs, techniciens et agents de maîtrise de la production des papiers, cartons et celluloses du 20 janvier 1988.",
          soustitre: "Production des papiers-cartons et celluloses (OEDTAM)",
        },
      ],
    },
  },
  "1495": {
    libelle: "Transformation des papiers-cartons et industries connexes (OEDTAM)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635194",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635194",
          titre:
            "Convention collective nationale des ouvriers, employés, dessinateurs, techniciens et agents de maîtrise de la transformation des papiers et cartons et des industries connexes du 16 février 1988. Etendue par arrêté du 6 mars 1989 JORF 17 mars 1989.",
          soustitre: "Transformation des papiers-cartons et industries connexes (OEDTAM)",
        },
      ],
    },
  },
  "1499": {
    libelle: "Miroiterie (transformation et négoce du verre)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635180",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635180",
          titre:
            "Convention collective nationale de la miroiterie, de la transformation et du négoce du verre du 9 mars 1988",
          soustitre: "Miroiterie (transformation et négoce du verre)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la miroiterie, de la transformation et du négoce du verre",
        id_kali: "KALICONT000005635180",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635180",
      },
    },
  },
  "1501": {
    libelle: "Restauration rapide",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635596",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635596",
          titre: "Convention collective nationale de la restauration rapide du 18 mars 1988",
          soustitre: "Restauration rapide",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la restauration rapide (restauration livrée)",
        id_kali: "KALICONT000005635596",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-05-18 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635596",
      },
    },
  },
  "1504": {
    libelle: "Poissonnerie (commerce de détail, demi-gros et gros)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635410",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635410",
          titre:
            "Convention collective nationale de la poissonnerie du 12 avril 1988.  Etendue par arrêté du 30 juillet 1988 JORF 6 août 1988 et élargie par arrêté du 18 octobre 1989 JORF 28 octobre 1989",
          soustitre: "Poissonnerie (commerce de détail, demi-gros et gros)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la poissonnerie (commerce de détail, de demi-gros et de gros de la poissonnerie)",
        id_kali: "KALICONT000005635410",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-06-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635410",
      },
    },
  },
  "1505": {
    libelle: "Commerce de détail alimentaire non spécialisé",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635421",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635421",
          titre:
            "Convention collective nationale du commerce de détail alimentaire non spécialisé du 12 janvier 2021  (Avenant n° 138 du 12 janvier 2021) - Étendue par arrêté du 17 décembre 2021 JORF 23 décembre 2021",
          soustitre: "Commerce de détail alimentaire non spécialisé",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635421",
          titre:
            "Convention collective nationale du commerce de détail des fruits et légumes, épicerie et produits laitiers du 15 avril 1988.  Etendue par arrêté du 20 juin 1988, JORF 25 juin 1988.",
          soustitre: "Commerce de détail alimentaire non spécialisé",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du commerce de détail alimentaire non spécialisé",
        id_kali: "KALICONT000005635421",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635421",
      },
    },
  },
  "1511": {
    libelle: "Crédit immobilier",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635406",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "DENONCE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635406",
          titre:
            "Convention collective nationale du personnel des sociétés de crédit immobilier de France du 18 mai 1988. ",
          soustitre: "Crédit immobilier",
        },
      ],
    },
  },
  "1512": {
    libelle: "Promotion immobilière",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635181",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635181",
          titre:
            "Convention collective nationale de la promotion immobilière du 18 mai 1988.  Etendue par arrêté du 4 novembre 1988 JORF 15 novembre 1988.",
          soustitre: "Promotion immobilière",
        },
        {
          etat_juridique: "MODIFIE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635181",
          titre:
            "Convention collective nationale de la promotion-construction du 18 mai 1988.  Etendue par arrêté du 4 novembre 1988 JORF 15 novembre 1988.",
          soustitre: "Promotion immobilière",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la promotion immobilière",
        id_kali: "KALICONT000005635181",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-02-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635181",
      },
    },
  },
  "1513": {
    libelle: "Activités de production des eaux embouteillées, de boissons rafraîchissantes sans alcool et de bière",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635411",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635411",
          titre:
            "Convention collective nationale des activités de production des eaux embouteillées et boissons rafraîchissantes sans alcool et de bière du 1er septembre 2010. Etendue par arrêté du 30 mai 2012 JORF 06 juin 2012.",
          soustitre:
            "Activités de production des eaux embouteillées, de boissons rafraîchissantes sans alcool et de bière",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635411",
          titre:
            "Convention collective nationale des activités de production des eaux embouteillées et boissons rafraîchissantes sans alcool et de bière du 24 mai 1988.  Etendue par arrêté du 24 novembre 1988 JORF 13 décembre 1988.(1)",
          soustitre:
            "Activités de production des eaux embouteillées, de boissons rafraîchissantes sans alcool et de bière",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des activités de production des eaux embouteillées, des boissons rafraîchissantes sans alcool et de bière",
        id_kali: "KALICONT000005635411",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2010-09-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635411",
      },
    },
  },
  "1516": {
    libelle: "Organismes de formation",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635435",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635435",
          titre: "Convention collective nationale des organismes de formation du 10 juin 1988 ",
          soustitre: "Organismes de formation",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de formation",
        id_kali: "KALICONT000005635435",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635435",
      },
    },
  },
  "1517": {
    libelle:
      "Commerces de détail non alimentaires (antiquités, brocante, galeries d'art [œuvres d'art], arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, périnatalité et maroquinerie)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635870",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635870",
          titre:
            "Convention collective nationale des commerces de détail non alimentaires : antiquités, brocante, galeries d'art (œuvres d'art), arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, puérinatalité, maroquinerie, instruments de musique, partitions et accessoires, presse et jeux de hasard ou pronostics, produits de la vape du 9 mai 2012 (avenant du 9 mai 2012)",
          soustitre:
            "Commerces de détail non alimentaires (antiquités, brocante, galeries d'art [œuvres d'art], arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, périnatalité et maroquinerie)",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635870",
          titre:
            "Convention collective nationale des commerces de détail non alimentaires : antiquités, brocante, galeries d'art (œuvres d'art), arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, puérinatalité et maroquinerie du 14 juin 1988",
          soustitre:
            "Commerces de détail non alimentaires (antiquités, brocante, galeries d'art [œuvres d'art], arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, périnatalité et maroquinerie)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des commerces de détail non alimentaires : antiquités, brocante, galeries d'art, arts de la table, coutellerie, droguerie, équipement du foyer, bazars, commerces ménagers, modélisme, jeux, jouets, périnatalité et maroquinerie(œuvres d'art)",
        id_kali: "KALICONT000005635870",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-05-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635870",
      },
    },
  },
  "1518": {
    libelle: "Animation",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635177",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635177",
          titre:
            "Convention collective nationale des métiers de l'éducation, de la culture, des loisirs et de l'animation agissant pour l'utilité sociale et environnementale, au service des territoires (ÉCLAT) du 28 juin 1988. Étendue par arrêté du 10 janvier 1989 JORF 13 janvier 1989",
          soustitre: "Animation",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des métiers de l’Éducation, de la Culture, des Loisirs, et de l’Animation agissant pour l’utilité sociale et environnementale, au service des Territoires dite ECLAT (ex Animation)",
        id_kali: "KALICONT000005635177",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-01-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635177",
      },
    },
  },
  "1527": {
    libelle: "Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635413",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635413",
          titre:
            "Convention collective nationale de l'immobilier, administrateurs de biens, sociétés immobilières, agents immobiliers, etc. (anciennement cabinets d'administrateurs de biens et des sociétés immobilières), du 9 septembre 1988. Etendue par arrêté du 24 février 1989 JORF 3 mars 1989. Mise à jour par avenant  n° 47 du 23 novembre 2010, JORF 18 juillet 2012 puis mise à jour par avenant n° 83 du 2 décembre 2019 étendu par arrêté du 2 juillet 2021 JORF 14 juillet 2021",
          soustitre: "Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635413",
          titre:
            "Convention collective nationale de l'immobilier. Mise à jour au 9 septembre 1988. Etendue par arrêté du 24 février 1989 JORF 3 mars 1989.",
          soustitre: "Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers",
        },
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635413",
          titre:
            "Convention collective nationale de l'immobilier du 9 septembre 1988. Etendue par arrêté du 24 février 1989 JORF 3 mars 1989. Mise à jour par avenant n° 26 du 22 mars 2004, étendue par arrêté du 13 avril 2005, JORF 27 avril 2005 ",
          soustitre: "Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'immobilier",
        id_kali: "KALICONT000005635413",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2010-11-23 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635413",
      },
    },
  },
  "1534": {
    libelle: "Entreprises de l'industrie et des commerces en gros des viandes",
    nature: "AVENANT",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635451",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635451",
          titre:
            "Convention collective nationale des entreprises de l'industrie et des commerces en gros des viandes du 27 juin 2018 (Avenant du 27 juin 2018)  ",
          soustitre: "Entreprises de l'industrie et des commerces en gros des viandes",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635451",
          titre:
            "Convention collective nationale des entreprises de l'industrie et des commerces en gros des viandes du 20 février 1969 remise à jour par accord du 9 novembre 1988.  Etendue par arrêté du 31 décembre 1971 JONC 14 janvier 1972",
          soustitre: "Entreprises de l'industrie et des commerces en gros des viandes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de l'industrie et des commerces en gros des viandes",
        id_kali: "KALICONT000005635451",
        cc_ti: "IDCC",
        nature: "AVENANT",
        etat: "VIGUEUR_ETEN",
        debut: "2020-12-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635451",
      },
    },
  },
  "1536": {
    libelle:
      "Distributeurs conseils hors domicile (bières, eaux minérales et de table, boissons gazeuses ou non gazeuses, boissons aux jus de fruits, sirops, jus de fruits, boissons lactées et gaz carbonique)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635657",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635657",
          titre:
            "Convention collective nationale des distributeurs conseils hors domicile (distributeurs CHD).  Etendue par arrêté du 4 janvier 1974 JORF 20 janvier 1974.",
          soustitre:
            "Distributeurs conseils hors domicile (bières, eaux minérales et de table, boissons gazeuses ou non gazeuses, boissons aux jus de fruits, sirops, jus de fruits, boissons lactées et gaz carbonique)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des distributeurs conseils hors domicile (entrepositaires-grossistes, bières, eaux minérales et de table, boissons gazeuses, non gazeuses, sirops, jus de fruits, CHD)",
        id_kali: "KALICONT000005635657",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635657",
      },
    },
  },
  "1539": {
    libelle: "Commerces de détail de papeterie, fournitures de bureau, bureautique et informatique [librairie]",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635434",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635434",
          titre:
            "Convention collective nationale des entreprises du bureau et du numérique – Commerces et services du 15 décembre 1988.  Etendue par arrêté du 14 décembre 1989 JORF 30 décembre 1989.\n",
          soustitre: "Commerces de détail de papeterie, fournitures de bureau, bureautique et informatique [librairie]",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises du bureau et du numérique Commerces et Services",
        id_kali: "KALICONT000005635434",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-12-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635434",
      },
    },
  },
  "1543": {
    libelle: "Boyauderie",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635442",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635442",
          titre:
            "Convention collective nationale de la boyauderie du 19 février 1989.  Etendue par arrêté du 2 juin 1989 JORF 7 juin 1989.\n",
          soustitre: "Boyauderie",
        },
      ],
    },
  },
  "1555": {
    libelle: "Fabrication et commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635900",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635900",
          titre:
            "Convention collective nationale de la fabrication et du commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire du 17 janvier 2018 (Avenant du 17 janvier 2018)",
          soustitre: "Fabrication et commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635900",
          titre:
            "Convention collective nationale de la fabrication et du commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire du 1er juin 1989.  Etendue par arrêté du 20 avril 1990 JORF 29 avril 1990",
          soustitre: "Fabrication et commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la fabrication et du commerce des produits à usage pharmaceutique, parapharmaceutique et vétérinaire",
        id_kali: "KALICONT000005635900",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-06-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635900",
      },
    },
  },
  "1557": {
    libelle: "Commerce des articles de sport et équipements de loisirs",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635645",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635645",
          titre:
            "Convention collective nationale du commerce des articles de sports et d'équipements de loisirs du 26 juin 1989.\n",
          soustitre: "Commerce des articles de sport et équipements de loisirs",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du commerce des articles de sports et d'équipements de loisirs (fusion entre la 1557 et la 1618)",
        id_kali: "KALICONT000005635645",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-06-26 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635645",
      },
    },
  },
  "1558": {
    libelle: "Industries céramiques de France",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635944",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635944",
          titre:
            "Convention collective nationale relative aux conditions de travail du personnel des industries céramiques de France du 6 juillet 1989.\n",
          soustitre: "Industries céramiques de France",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale relative aux conditions de travail du personnel des industries céramiques de France",
        id_kali: "KALICONT000005635944",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-07-06 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635944",
      },
    },
  },
  "1561": {
    libelle: "Cordonnerie multiservice",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635662",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635662",
          titre:
            "Convention collective nationale de la cordonnerie multiservice du 7 août 1989. Elargie au secteur des cordonniers industriels.\n",
          soustitre: "Cordonnerie multiservice",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la cordonnerie multiservice (annexée à la convention collective nationale de travail des industries de la maroquinerie, articles de voyage, chasse sellerie, gainerie, bracelets en cuir 2528)",
        id_kali: "KALICONT000005635662",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1989-09-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635662",
      },
    },
  },
  "1563": {
    libelle: "Presse périodique régionale",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635486",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635486",
          titre:
            "Convention collective nationale des cadres de la presse hebdomadaire régionale d'information du 15 octobre 1989. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse périodique régionale",
        },
      ],
    },
  },
  "1565": {
    libelle:
      "Convention collective départementale des services de soins infirmiers à domicile pour personnes âgées de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des services de soins infirmiers à domicile pour personnes âgées de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1578": {
    libelle: "Convention collective départementale de la métallurgie de la Loire et de l'arrondissement d'Yssingeaux",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de la métallurgie de la Loire et de l'arrondissement d'Yssingeaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1580": {
    libelle: "Industrie de la chaussure et des articles chaussants",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635436",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635436",
          titre:
            "Convention collective nationale de l'industrie de la chaussure et des articles chaussants du 31 mai 1968, révisée par protocole d'accord du 7 mars 1990. Etendue par arrêté du 29 octobre 1990 JORF 1er novembre 1990.",
          soustitre: "Industrie de la chaussure et des articles chaussants",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie de la chaussure et des articles chaussants",
        id_kali: "KALICONT000005635436",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1990-03-07 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635436",
      },
    },
  },
  "1586": {
    libelle: "Industries charcutières (salaisons, charcuteries, conserves de viandes)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635631",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635631",
          titre:
            "Convention collective nationale de l'industrie de la salaison, charcuterie en gros et conserves de viandes du 29 mars 1972.  Etendue par arrêté du 14 mai 1975 JORF 4 juin 1975.\n",
          soustitre: "Industries charcutières (salaisons, charcuteries, conserves de viandes)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de l'industrie de la salaison, charcuterie en gros et conserves de viandes",
        id_kali: "KALICONT000005635631",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1972-03-29 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635631",
      },
    },
  },
  "1588": {
    libelle: "Personnel des sociétés coopératives d'HLM",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635907",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635907",
          titre: "Convention collective nationale du personnel des sociétés coopératives d'HLM du 15 mai 1990. \n",
          soustitre: "Personnel des sociétés coopératives d'HLM",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel des sociétés coopératives d'HLM (annexée à la convention collective nationale du personnel des Offices Publics de l'Habitat 3220)",
        id_kali: "KALICONT000005635907",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "1990-05-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635907",
      },
    },
  },
  "1589": {
    libelle: "Mareyeurs-expéditeurs",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635209",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635209",
          titre:
            "Convention collective nationale des mareyeurs-expéditeurs du 15 mai 1990.  Etendue par arrêté du 14 septembre 1990 JORF 22 septembre 1990.",
          soustitre: "Mareyeurs-expéditeurs",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des mareyeurs-expéditeurs",
        id_kali: "KALICONT000005635209",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1990-07-02 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635209",
      },
    },
  },
  "1591": {
    libelle: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635693",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635693",
          titre:
            "Convention collective nationale des cadres de l'importation charbonnière, des usines d'agglomération de houille et du commerce de combustibles en gros du 1er juin 1990",
          soustitre: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
        },
      ],
    },
  },
  "1596": {
    libelle: "Bâtiment Ouvriers (Entreprises occupant jusqu'à 10 salariés)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635221",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635221",
          titre:
            "Convention collective nationale des ouvriers employés par les entreprises du bâtiment visées par le décret du 1er mars 1962 (c'est-à-dire occupant jusqu'à 10 salariés) du 8 octobre 1990.",
          soustitre: "Bâtiment Ouvriers (Entreprises occupant jusqu'à 10 salariés)",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635221",
          titre:
            "Nouvelle convention collective nationale des ouvriers employés par les entreprises du bâtiment visées par le décret du 1er mars 1962 (c'est-à-dire occupant jusqu'à 10 salariés) du 7 mars 2018 (Avenant du 7 mars 2018) ",
          soustitre: "Bâtiment Ouvriers (Entreprises occupant jusqu'à 10 salariés)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale concernant les ouvriers employés par les entreprises du bâtiment visées par le décret du 1er mars 1962 -c'est-à-dire occupant jusqu'à 10 salariés-",
        id_kali: "KALICONT000005635221",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2018-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635221",
      },
    },
  },
  "1597": {
    libelle: "Bâtiment Ouvriers (Entreprises occupant plus de 10 salariés)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635220",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635220",
          titre:
            "Convention collective nationale des ouvriers employés par les entreprises du bâtiment non visées par le décret du 1er mars 1962 (c'est-à-dire occupant plus de 10 salariés) du 8 octobre 1990. Etendue par arrêté du 8 février 1991 JORF 12 février 1991.",
          soustitre: "Bâtiment Ouvriers (Entreprises occupant plus de 10 salariés)",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635220",
          titre:
            "Nouvelle convention collective nationale des ouvriers employés par les entreprises du bâtiment non visées par le décret du 1er mars 1962 (c'est-à-dire occupant plus de 10 salariés) du 7 mars 2018 (Avenant du 7 mars 2018)",
          soustitre: "Bâtiment Ouvriers (Entreprises occupant plus de 10 salariés)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale concernant les ouvriers employés par les entreprises du bâtiment non visées par le décret 1er mars 1962 -c'est-à-dire occupant plus de 10 salariés-",
        id_kali: "KALICONT000005635220",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2018-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635220",
      },
    },
  },
  "1601": {
    libelle: "Bourse",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635208",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635208",
          titre:
            "Convention collective nationale de la bourse du 26 octobre 1990.  Etendue par arrêté du 21 février 1991 JORF 24 février 1991.",
          soustitre: "Bourse",
        },
      ],
    },
  },
  "1605": {
    libelle: "Entreprises de désinfection, désinsectisation et dératisation (3D)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635437",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635437",
          titre:
            "Convention collective nationale des entreprises de désinfection, désinsectisation, dératisation (3D) du 1er septembre 1991.  Etendue par arrêté du 16 janvier 1992 JORF 31 janvier 1992.",
          soustitre: "Entreprises de désinfection, désinsectisation et dératisation (3D)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de désinfection, désinsectisation, dératisation",
        id_kali: "KALICONT000005635437",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635437",
      },
    },
  },
  "1606": {
    libelle: "Bricolage (vente au détail en libre-service)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635871",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635871",
          titre:
            "Convention collective nationale du bricolage (vente au détail en libre-service) du 30 septembre 1991  ",
          soustitre: "Bricolage (vente au détail en libre-service)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du bricolage",
        id_kali: "KALICONT000005635871",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1988-06-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635871",
      },
    },
  },
  "1607": {
    libelle:
      "Industries des jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture et voitures d'enfants, modélisme et industries connexes",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635904",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635904",
          titre:
            "Convention collective nationale des industries des jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture et voitures d'enfants, modélisme et industries connexes du 25 janvier 1991.  Etendue par arrêté du 8 juillet 1991 JORF 19 juillet 1991.",
          soustitre:
            "Industries des jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture et voitures d'enfants, modélisme et industries connexes",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des industries des jeux, jouets, articles de fêtes et ornements de Noël, articles de puériculture et voitures d'enfants modélisme et industries connexes",
        id_kali: "KALICONT000005635904",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1991-02-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635904",
      },
    },
  },
  "1611": {
    libelle: "Entreprises de logistique de communication écrite directe",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635474",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635474",
          titre:
            "Convention collective nationale des entreprises de logistique de communication écrite directe du 19 novembre 1991.  Etendue par arrêté du 28 avril 1992 JORF 14 mai 1992.(1)",
          soustitre: "Entreprises de logistique de communication écrite directe",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de logistique de communication écrite directe",
        id_kali: "KALICONT000005635474",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1991-11-19 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635474",
      },
    },
  },
  "1612": {
    libelle: "Travail aérien (personnel navigant des essais et réceptions)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635916",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635916",
          titre:
            "Convention collective nationale du travail aérien du 21 janvier 1991 (Personnel navigant des essais et réceptions).",
          soustitre: "Travail aérien (personnel navigant des essais et réceptions)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel navigant des essais et réceptions",
        id_kali: "KALICONT000005635916",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "1991-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635916",
      },
    },
  },
  "1618": {
    libelle: "Camping (industries)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635255",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635255",
          titre:
            "Convention collective nationale du camping du 13 janvier 1970 mise à jour par accord du 20 janvier 2015\n",
          soustitre: "Camping (industries)",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635255",
          titre:
            "Convention collective nationale du camping du 13 janvier 1970 (actualisée le 10 décembre 1991).   Etendue par arrêté du 28 décembre 1992 JORF 28 janvier 1993.",
          soustitre: "Camping (industries)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du camping (fusion entre la 1557 et la 1618)",
        id_kali: "KALICONT000005635255",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635255",
      },
    },
  },
  "1619": {
    libelle: "Cabinets dentaires",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635655",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635655",
          titre:
            "Convention collective nationale des cabinets dentaires du 17 janvier 1992 - Étendue par arrêté du 2 avril 1992 JORF 9 avril 1992",
          soustitre: "Cabinets dentaires",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cabinets dentaires",
        id_kali: "KALICONT000005635655",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-01-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635655",
      },
    },
  },
  "1621": {
    libelle: "Répartition pharmaceutique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635232",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635232",
          titre:
            "Convention collective nationale de la répartition pharmaceutique du 7 janvier 1992.  Etendue par arrêté du 28 juillet 1992 JORF 29 juillet 1992.",
          soustitre: "Répartition pharmaceutique",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la répartition pharmaceutique",
        id_kali: "KALICONT000005635232",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-07-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635232",
      },
    },
  },
  "1622": {
    libelle: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635450",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635450",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise de l'importation charbonnière, des usines d'agglomération de houille et du commerce des combustibles en gros du 10 décembre 1991.",
          soustitre: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
        },
      ],
    },
  },
  "1624": {
    libelle:
      "Commerce de gros de la confiserie, chocolaterie, biscuiterie et alimentation fine et des négociants-distributeurs de levure",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635225",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635225",
          titre:
            "Convention collective nationale du commerce de gros de la confiserie, chocolaterie , biscuiterie et alimentation fine et des négociants-distributeurs de levure du 1er  janvier 1985.  Etendue par arrêté du 7 août 1985 JORF 17 août 1985.\n",
          soustitre:
            "Commerce de gros de la confiserie, chocolaterie, biscuiterie et alimentation fine et des négociants-distributeurs de levure",
        },
      ],
    },
  },
  "1626": {
    libelle:
      "Convention collective départementale des industries métallurgiques, mécaniques, électriques, électro-céramiques et connexes des Hautes-Pyrénées",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des industries métallurgiques, mécaniques, électriques, électro-céramiques et connexes des Hautes-Pyrénées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1631": {
    libelle: "Hôtellerie de plein air",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635252",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635252",
          titre: "Convention collective nationale de l'hôtellerie de plein air du 2 juin 1993",
          soustitre: "Hôtellerie de plein air",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'hôtellerie de plein air",
        id_kali: "KALICONT000005635252",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-06-02 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635252",
      },
    },
  },
  "1635": {
    libelle: "Métallurgie : Gironde et Landes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025393730",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025393730",
          titre:
            "Convention collective des industries métallurgiques, mécaniques et connexes (Gironde et Landes). Mise à jour par avenant du 18 février 2011",
          soustitre: "Métallurgie : Gironde et Landes",
        },
      ],
    },
  },
  "1659": {
    libelle: "Lin : rouissage et teillage du lin",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635927",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635927",
          titre:
            "Convention collective nationale du rouissage-teillage de lin du 28 janvier 1992, issue de l'annexe à l'avenant n° 12 du 6 mars 2002",
          soustitre: "Lin : rouissage et teillage du lin",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635927",
          titre:
            "Convention collective nationale du rouissage-teillage de lin.  Etendue par arrêté du 26 mai 1993 JORF 8 juin 1993.",
          soustitre: "Lin : rouissage et teillage du lin",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du rouissage teillage du lin",
        id_kali: "KALICONT000005635927",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-03-06 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635927",
      },
    },
  },
  "1671": {
    libelle: "Maisons d'étudiants",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635917",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635917",
          titre:
            "Convention collective nationale des maisons d'étudiants du 27 mai 1992.  Etendue par arrêté du 20 août 1993 JORF 29 septembre 1993.",
          soustitre: "Maisons d'étudiants",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des maisons d'étudiants",
        id_kali: "KALICONT000005635917",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-10-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635917",
      },
    },
  },
  "1672": {
    libelle: "Sociétés d'assurances",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635918",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635918",
          titre: "Convention collective nationale des sociétés d'assurances du 27 mai 1992",
          soustitre: "Sociétés d'assurances",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des sociétés d'assurances",
        id_kali: "KALICONT000005635918",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-05-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635918",
      },
    },
  },
  "1679": {
    libelle: "Inspection d'assurance",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635475",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635475",
          titre:
            "Convention collective nationale de l'inspection d'assurance du 27 juillet 1992. Etendue par arrêté du 12 juillet 1993 JORF 7 août 1993",
          soustitre: "Inspection d'assurance",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'inspection d'assurance",
        id_kali: "KALICONT000005635475",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-09-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635475",
      },
    },
  },
  "1686": {
    libelle: "Commerces et services de l'audiovisuel, de l'électronique et de l'équipement ménager",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635164",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635164",
          titre:
            "Convention collective nationale des commerces et services de l'audiovisuel, de l'électronique et de l'équipement ménager du 26 novembre 1992. Etendue par arrêté du 9 mars 1993 JORF 19 mars 1993.",
          soustitre: "Commerces et services de l'audiovisuel, de l'électronique et de l'équipement ménager",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des commerces et services de l'audiovisuel, de l'électronique et de l'équipement ménager",
        id_kali: "KALICONT000005635164",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635164",
      },
    },
  },
  "1689": {
    libelle: "Fabriques d'articles de papeterie et de bureau : ouvriers, employés, agents de maîtrise, cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635681",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "DENONCE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635681",
          titre:
            "Convention collective nationale de travail des ouvriers, employés, agents de maîtrise et cadres des fabriques d'articles de papeterie et de bureau du 24 novembre 1992.  Etendue par arrêté du 4 juillet 1994 JORF 16 juillet 1994.",
          soustitre: "Fabriques d'articles de papeterie et de bureau : ouvriers, employés, agents de maîtrise, cadres",
        },
      ],
    },
  },
  "1700": {
    libelle:
      "Convention collective départementale des sucreries, sucreries-distilleries et distilleries de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des sucreries, sucreries-distilleries et distilleries de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1702": {
    libelle: "Travaux publics (Tome II : Ouvriers)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635467",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635467",
          titre: "Convention collective nationale des ouvriers des travaux publics du 15 décembre 1992",
          soustitre: "Travaux publics (Tome II : Ouvriers)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des ouvriers de travaux publics",
        id_kali: "KALICONT000005635467",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-06-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635467",
      },
    },
  },
  "1710": {
    libelle: "Agences de voyages et de tourisme : personnels, guides accompagnateurs et accompagnateurs",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635399",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635399",
          titre:
            "Convention collective nationale de travail du personnel des agences de voyages et de tourisme du 12 mars 1993. Etendue par arrêté du 21 juillet 1993 JORF 1er août 1993",
          soustitre: "Agences de voyages et de tourisme : personnels, guides accompagnateurs et accompagnateurs",
        },
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635399",
          titre:
            "Convention collective nationale de travail du personnel des agences de voyages et de tourisme du 12 mars 1993 (réécrite par avenant du 10 décembre 2013) remplacée par la convention collective nationale des opérateurs de voyage et des guides (IDCC 3245)\n",
          soustitre: "Agences de voyages et de tourisme : personnels, guides accompagnateurs et accompagnateurs",
        },
      ],
    },
  },
  "1726": {
    libelle: "Métreurs vérificateurs, économistes de la construction (cabinets)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635230",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635230",
          titre:
            "Convention collective nationale des collaborateurs salariés des cabinets d'économistes de la construction et de métreurs vérificateurs du 16 avril 1993.  Etendue par arrêté du 6 octobre 1993 JORF 14 octobre 1993.",
          soustitre: "Métreurs vérificateurs, économistes de la construction (cabinets)",
        },
      ],
    },
  },
  "1734": {
    libelle: "Artistes-interprètes (engagés pour des émissions de télévision)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635286",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635286",
          titre:
            "Convention collective nationale des artistes-interprètes engagés pour des émissions de télévision du 30 décembre 1992.  Etendue par arrêté du 24 janvier 1994 JORF 4 février 1994.\n",
          soustitre: "Artistes-interprètes (engagés pour des émissions de télévision)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective des artistes-interprètes engagés pour des émissions de télévision (annexée à la convention collective de la production audiovisuelle 2642)",
        id_kali: "KALICONT000005635286",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1992-12-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635286",
      },
    },
  },
  "1740": {
    libelle:
      "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635685",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635685",
          titre:
            "Convention collective régionale des ouvriers du bâtiment de la région parisienne du 28 juin 1993.  Etendue par arrêté du 9 décembre 1993 JORF 24 décembre 1993.",
          soustitre:
            "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
        },
      ],
    },
  },
  "1747": {
    libelle: "Activités industrielles de boulangerie et pâtisserie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635691",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635691",
          titre:
            "Convention collective nationale des activités industrielles de boulangerie et pâtisserie du 13 juillet 1993. Mise à jour par avenant n°10 du 11 octobre 2011",
          soustitre: "Activités industrielles de boulangerie et pâtisserie",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des activités industrielles de boulangerie et de pâtisserie (fusion entre la 1747 et la 2075)",
        id_kali: "KALICONT000005635691",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-11-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635691",
      },
    },
  },
  "1760": {
    libelle: "Jardineries et graineteries",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635938",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635938",
          titre:
            "Convention collective nationale des jardineries et graineteries du 3 décembre 1993.  Etendue par arrêté du 6 juillet 1994 JORF 20 juillet 1994.",
          soustitre: "Jardineries et graineteries",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des jardineries et graineteries",
        id_kali: "KALICONT000005635938",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1994-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635938",
      },
    },
  },
  "1761": {
    libelle: "Commerce de gros des tissus, tapis et linge de maison",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635247",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635247",
          titre:
            "Convention collective nationale du commerce de gros des tissus, tapis et linge de maison du 15 décembre 1993.\n",
          soustitre: "Commerce de gros des tissus, tapis et linge de maison",
        },
      ],
    },
  },
  "1763": {
    libelle: "Manutention portuaire",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635468",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635468",
          titre:
            "Convention collective nationale de la manutention portuaire du 31 décembre 1993.   Etendue par arrêté du 29 septembre 1994 JORF 1er octobre 1994.",
          soustitre: "Manutention portuaire",
        },
      ],
    },
  },
  "1788": {
    libelle:
      "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635288",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635288",
          titre:
            "Convention collective de travail du personnel d'éducation des établissements d'enseignement privés. En vigueur le 1er septembre 1991.",
          soustitre:
            "Enseignement privé : maîtres de l'enseignement primaire, professeurs de l'enseignement secondaire, personnels des services administratifs et économiques, psychologues",
        },
      ],
    },
  },
  "1790": {
    libelle: "Espaces de loisirs, d'attractions et culturels (CCNELAC)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635453",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635453",
          titre: "Convention collective nationale des espaces de loisirs, d'attractions et culturels du 5 janvier 1994",
          soustitre: "Espaces de loisirs, d'attractions et culturels (CCNELAC)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des espaces de loisirs, d'attractions et culturels",
        id_kali: "KALICONT000005635453",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1994-02-11 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635453",
      },
    },
  },
  "1794": {
    libelle: "Institutions de retraite complémentaire (personnel)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635698",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635698",
          titre:
            "Convention collective nationale de travail du personnel des institutions de retraite complémentaire et de prévoyance du 9 décembre 1993.  Etendue par arrêté du 19 septembre 1994 JORF 29 septembre 1994 et élargie aux institutions de prévoyance par arrêté du 31 janvier 1995 JORF 10 février 1995.",
          soustitre: "Institutions de retraite complémentaire (personnel)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des institutions de retraites complémentaires",
        id_kali: "KALICONT000005635698",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1993-12-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635698",
      },
    },
  },
  "1800": {
    libelle: "Céramique d'art",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635708",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635708",
          titre: "Convention collective nationale de la céramique d'art du 29 avril 1994.\n",
          soustitre: "Céramique d'art",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel de la céramique d'art (annexée à la convention collective nationale relative aux conditions de travail du personnel des industries céramiques de France 1558)",
        id_kali: "KALICONT000005635708",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1994-04-29 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635708",
      },
    },
  },
  "1801": {
    libelle: "Sociétés d'assistance",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635497",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635497",
          titre:
            "Convention collective nationale des sociétés d'assistance du 13 avril 1994. Etendue par arrêté du 8 février 1995 JORF 18 février 1995",
          soustitre: "Sociétés d'assistance",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des sociétés d'assistance",
        id_kali: "KALICONT000005635497",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1994-04-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635497",
      },
    },
  },
  "1810": {
    libelle: "Entreprises de propreté (1er juillet 1994)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635711",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635711",
          titre:
            "Convention collective nationale des entreprises de propreté du 1er  juillet 1994.  Etendue par arrêté du 31 octobre 1994 JORF 5 novembre 1994",
          soustitre: "Entreprises de propreté (1er juillet 1994)",
        },
      ],
    },
  },
  "1813": {
    libelle:
      "Convention collective locale de travail des industries de la transformation des métaux de la région de Maubeuge",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective locale de travail des industries de la transformation des métaux de la région de Maubeuge",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1816": {
    libelle: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635283",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635283",
          titre:
            "Convention collective nationale des ouvriers de l'importation charbonnière maritime et usines d'agglomération de houille du littoral du 15 septembre 1994.  Etendue par arrêté du 20 février 1995 JORF 28 février 1995.",
          soustitre: "Charbon : importation charbonnière (cadres, ETAM, ouvriers)",
        },
      ],
    },
  },
  "1821": {
    libelle: "Fabrication du verre à la main semi-automatique et mixte",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018902144",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018902144",
          titre:
            "Convention collective nationale de la fabrication du verre à la main, semi-automatique et mixte du 3 novembre 1994.  Etendue par arrêté du 27 janvier 1998 JORF 6 février 1998.",
          soustitre: "Fabrication du verre à la main semi-automatique et mixte",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des professions regroupées du cristal, du verre et du vitrail ",
        id_kali: "KALICONT000018902144",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1994-11-03 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018902144",
      },
    },
  },
  "1841": {
    libelle:
      "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017960038",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017960038",
          titre:
            "Convention collective régionale des employés, techniciens et agents de maîtrise du bâtiment de la région parisienne du 12 avril 1960 (1)",
          soustitre:
            "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
        },
      ],
    },
  },
  "1843": {
    libelle:
      "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
    nature: "CONVENTION COLLECTIVE RÉGIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017960049",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017960049",
          titre:
            "Convention collective régionale des ingénieurs, assimilés et cadres du bâtiment de la région parisienne du 12 avril 1960",
          soustitre:
            "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective régionale des ingénieurs, assimilés et cadres du bâtiment de la région parisienne",
        id_kali: "KALICONT000017960049",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE RÉGIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1960-04-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017960049",
      },
    },
  },
  "1850": {
    libelle: "Avocats : cabinets d'avocats et avocats salariés",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636008",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636008",
          titre:
            "Convention collective nationale des cabinets d'avocats (avocats salariés) du 17 février 1995.  Etendue par arrêté du 10 juin 1996 JORF 28 juin 1996",
          soustitre: "Avocats : cabinets d'avocats et avocats salariés",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'avocat salarié",
        id_kali: "KALICONT000005636008",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1995-02-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636008",
      },
    },
  },
  "1871": {
    libelle: "Presse d'information spécialisée (employés)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635764",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635764",
          titre:
            "Convention collective nationale des employés de la presse d'information spécialisée du 1er juillet 1995 (signée le 28 mars 1995).\nRemplacée par la convention collective nationale des employés, techniciens, agents de maîtrise et cadres de la presse d'information spécialisée du 27 décembre 2018 (IDCC 3230)",
          soustitre: "Presse d'information spécialisée (employés)",
        },
      ],
    },
  },
  "1874": {
    libelle: "Presse d'information spécialisée (cadres, techniciens et agents de maîtrise)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635761",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635761",
          titre:
            "Convention collective nationale des cadres, techniciens, agents de maîtrise de la presse d'information spécialisée du 1er juillet 1995  (signée le 30 juin 1995).\nRemplacée par la convention collective nationale des employés, techniciens, agents de maîtrise et cadres de la presse d'information spécialisée du 27 décembre 2018 (IDCC 3230)",
          soustitre: "Presse d'information spécialisée (cadres, techniciens et agents de maîtrise)",
        },
      ],
    },
  },
  "1875": {
    libelle: "Vétérinaires : personnel salarié des cabinets et cliniques vétérinaires",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635994",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635994",
          titre:
            "Convention collective nationale des cabinets et cliniques vétérinaires du 5 juillet 1995.  Etendue par arrêté du 16 janvier 1996 JORF 24 janvier 1996 \n",
          soustitre: "Vétérinaires : personnel salarié des cabinets et cliniques vétérinaires",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cabinets et cliniques vétérinaires : personnel salarié",
        id_kali: "KALICONT000005635994",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-01-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635994",
      },
    },
  },
  "1880": {
    libelle: "Négoce de l'ameublement",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635115",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635115",
          titre: "Convention collective nationale du négoce de l'ameublement du 31 mai 1995",
          soustitre: "Négoce de l'ameublement",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du négoce de l'ameublement",
        id_kali: "KALICONT000005635115",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1995-05-31 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635115",
      },
    },
  },
  "1895": {
    libelle: "Presse quotidienne régionale et départementale : cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635259",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635259",
          titre:
            "Convention collective de travail de l'encadrement de la presse quotidienne régionale du 12 décembre 1995. \nRemplacée par la convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (IDCC 3242)",
          soustitre: "Presse quotidienne régionale et départementale : cadres",
        },
      ],
    },
  },
  "1903": {
    libelle: "Agences de presse",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635336",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635336",
          titre:
            "Convention collective nationale du personnel d'encadrement des agences de presse du 1er janvier 1996.\nRemplacée par la convention collective nationale des employés, techniciens et cadres des agences de presse du 7 avril 2017 (IDCC 3221)",
          soustitre: "Agences de presse",
        },
      ],
    },
  },
  "1909": {
    libelle: "Organismes de tourisme",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635728",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635728",
          titre:
            "Convention collective nationale des organismes de tourisme du 5 février 1996.  Etendue par arrêté du 6 décembre 1996 JORF 19 décembre 1996.",
          soustitre: "Organismes de tourisme",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de tourisme",
        id_kali: "KALICONT000005635728",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-02-05 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635728",
      },
    },
  },
  "1921": {
    libelle: "Personnel des huissiers de justice",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635521",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635521",
          titre:
            "Convention collective nationale du personnel des huissiers de justice du 11 avril 1996.  Etendue par arrêté du 18 octobre 1996 JORF 29 octobre 1996.",
          soustitre: "Personnel des huissiers de justice",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des huissiers de justice",
        id_kali: "KALICONT000005635521",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-04-11 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635521",
      },
    },
  },
  "1922": {
    libelle: "Radiodiffusion",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635741",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635741",
          titre:
            "Convention collective nationale de la radiodiffusion du 11 avril 1996 (accord d'étape).  Etendue par arrêté du 22 octobre 1996 JORF 1er novembre 1996.",
          soustitre: "Radiodiffusion",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la radiodiffusion",
        id_kali: "KALICONT000005635741",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-04-11 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635741",
      },
    },
  },
  "1923": {
    libelle: "Convention collective départementale de la manutention portuaire de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de la manutention portuaire de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1930": {
    libelle: "Métiers de la transformation des grains",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635524",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635524",
          titre:
            "Convention collective nationale des métiers de la transformation des grains du 9 novembre 2016 (Avenant n° 46 du 9 novembre 2016)",
          soustitre: "Métiers de la transformation des grains",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635524",
          titre:
            "Convention collective nationale de la meunerie du 16 juin 1996.  Etendue par arrêté du 11 décembre 1997 JORF 20 décembre 1997.",
          soustitre: "Métiers de la transformation des grains",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des métiers de la transformation des grains (ex meunerie)",
        id_kali: "KALICONT000005635524",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-01-05 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635524",
      },
    },
  },
  "1937": {
    libelle: "Audio-vidéo-informatique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635843",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635843",
          titre:
            "Convention collective nationale de l'audio-vidéo informatique (Fabrication de programmes vidéo informatiques. - Reproduction d'enregistrements vidéo et prestations de régie de diffusion et de télécommunications) du 29 mai 1996. Etendue par arrêté du 19 juillet 1999 JORF 30 juillet 1999.",
          soustitre: "Audio-vidéo-informatique",
        },
      ],
    },
  },
  "1938": {
    libelle: "Industries de la transformation des volailles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635284",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635284",
          titre: "Convention collective nationale des industries de la transformation des volailles du 10 juillet 1996",
          soustitre: "Industries de la transformation des volailles",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des industries de la transformation des volailles (abattoirs, ateliers de découpe et centres de conditionnement de volailles, commerce de gros de volailles)",
        id_kali: "KALICONT000005635284",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-07-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635284",
      },
    },
  },
  "1942": {
    libelle: "Textiles artificiels et synthétiques et produits assimilés",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636003",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636003",
          titre:
            "Convention collective nationale des textiles artificiels et synthétiques et produits assimilés du 6 juin 1996.  Etendue par arrêté du 29 avril 1998 JORF 14 mai 1998.\n",
          soustitre: "Textiles artificiels et synthétiques et produits assimilés",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des textiles artificiels et synthétiques et produits assimilés (annexée à la convention collective nationale de l’industrie textile 0018)",
        id_kali: "KALICONT000005636003",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-05-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636003",
      },
    },
  },
  "1944": {
    libelle: "Exploitation d'hélicoptères",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635523",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635523",
          titre:
            "Convention collective nationale du personnel navigant technique des exploitants d'hélicoptères du 13 novembre 1996.  Etendue par arrêté du 8 septembre 1997 JORF 25 septembre 1997.",
          soustitre: "Exploitation d'hélicoptères",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel navigant technique des exploitants d'hélicoptères",
        id_kali: "KALICONT000005635523",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1996-11-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635523",
      },
    },
  },
  "1945": {
    libelle: "Industrie du vitrail",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635736",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635736",
          titre: "Convention collective nationale de l'industrie du vitrail du 15 novembre 1996",
          soustitre: "Industrie du vitrail",
        },
      ],
    },
  },
  "1947": {
    libelle: "Négoce de bois d'œuvre et produits dérivés",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635751",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635751",
          titre:
            "Convention collective nationale du négoce de bois d'oeuvre et de produits dérivés du 17 décembre 1996.  (Etendue par arrêté du 7 mai 1997, JO du 17 mai 1997).\n",
          soustitre: "Négoce de bois d'œuvre et produits dérivés",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du négoce de bois d'œuvre et produits dérivés",
        id_kali: "KALICONT000005635751",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1997-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635751",
      },
    },
  },
  "1951": {
    libelle: "Cabinets ou entreprises d'expertises en automobile",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636009",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636009",
          titre:
            "Convention collective nationale des cabinets ou entreprises d'expertises en automobile du 20 novembre 1996.  Etendue par arrêté du 8 avril 1998 JORF 24 avril 1998.",
          soustitre: "Cabinets ou entreprises d'expertises en automobile",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cabinets ou entreprises d'expertises en automobile",
        id_kali: "KALICONT000005636009",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1998-04-25 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636009",
      },
    },
  },
  "1961": {
    libelle: "Convention collective départementale pour les stations-service en Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale pour les stations-service en Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1967": {
    libelle: "Convention collective départementale de l'industrie des métaux du Bas-Rhin",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de l'industrie des métaux du Bas-Rhin",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1972": {
    libelle: "Presse magazine et d'information : employés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023276712",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023276712",
          titre: "Convention collective des employés de la presse magazine et d'information ",
          soustitre: "Presse magazine et d'information : employés",
        },
      ],
    },
  },
  "1974": {
    libelle: "Navigation intérieure (transport de passagers)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635578",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635578",
          titre:
            "Convention collective nationale du personnel des entreprises de transport de passagers en navigation intérieure du 23 avril 1997.  Etendue par arrêté du 9 décembre 1997 JORF 20 décembre 1997.\nRemplacée par la convention collective nationale du personnel des entreprises de transport en navigation intérieure du 20 décembre 2018 (IDCC 3229)",
          soustitre: "Navigation intérieure (transport de passagers)",
        },
      ],
    },
  },
  "1978": {
    libelle: "Fleuristes, vente et services des animaux familiers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635507",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635507",
          titre:
            "Convention collective nationale des fleuristes, de la vente et des services des animaux familiers du 29 septembre 2020 (Accord du 29 septembre 2020) - Etendue par arrêté du 17 décembre 2021 JORF 23 décembre 2021",
          soustitre: "Fleuristes, vente et services des animaux familiers",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635507",
          titre:
            "Convention collective nationale des fleuristes, de la vente et des services des animaux familiers du 21 janvier 1997.  Etendue par arrêté du 7 octobre 1997 JORF 21 octobre 1997.",
          soustitre: "Fleuristes, vente et services des animaux familiers",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des fleuristes, de la vente et des services des animaux familiers",
        id_kali: "KALICONT000005635507",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-12-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635507",
      },
    },
  },
  "1979": {
    libelle: "Hôtels, cafés, restaurants",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635534",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635534",
          titre: "Convention collective nationale des hôtels, cafés restaurants (HCR) du 30 avril 1997",
          soustitre: "Hôtels, cafés, restaurants",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des hôtels, cafés, restaurants (HCR)",
        id_kali: "KALICONT000005635534",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1997-12-07 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635534",
      },
    },
  },
  "1980": {
    libelle:
      "Convention collective départementale des commissionnaires en douane et agents auxiliaires de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des commissionnaires en douane et agents auxiliaires de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1982": {
    libelle: "Négoce et prestations de services dans les domaines médico-techniques",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636023",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636023",
          titre:
            "Convention collective nationale du négoce et des prestations de services dans les domaines médico-techniques du 9 avril 1997",
          soustitre: "Négoce et prestations de services dans les domaines médico-techniques",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du négoce et prestations de services dans les domaines médico-techniques",
        id_kali: "KALICONT000005636023",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1998-03-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636023",
      },
    },
  },
  "1987": {
    libelle: "Pâtes alimentaires sèches et couscous non préparé",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635758",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635758",
          titre:
            "Convention collective nationale des pâtes alimentaires sèches et du couscous non préparé du 3 juillet 1997.  Etendue par arrêté du 3 mars 1998 JORF 12 mars 1998\n",
          soustitre: "Pâtes alimentaires sèches et couscous non préparé",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des pâtes alimentaires sèches et du couscous non préparé",
        id_kali: "KALICONT000005635758",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1997-07-03 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635758",
      },
    },
  },
  "1996": {
    libelle: "Pharmacie d'officine",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635528",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635528",
          titre:
            "Convention collective nationale de la pharmacie d'officine du 3 décembre 1997.  Etendue par arrêté du 13 août 1998 (JO du 8 septembre 1998).",
          soustitre: "Pharmacie d'officine",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la pharmacie d'officine",
        id_kali: "KALICONT000005635528",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1998-09-08 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635528",
      },
    },
  },
  "2002": {
    libelle: "Blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635491",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635491",
          titre:
            "Convention collective nationale de la  blanchisserie – teinturerie et nettoyage (blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie) du 17 novembre 1997.  Etendue par arrêté du 10 août 1998 JORF 20 août 1998",
          soustitre: "Blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective interrégionale de la blanchisserie, laverie, location de linge, nettoyage à sec, pressing et teinturerie",
        id_kali: "KALICONT000005635491",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2023-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635491",
      },
    },
  },
  "2014": {
    libelle: "Agences de presse",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635100",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635100",
          titre:
            "Convention collective nationale du travail des employés des agences de presse du 1er juin 1998.\nRemplacée par la convention collective nationale des employés, techniciens et cadres des agences de presse du 7 avril 2017 (IDCC 3221)",
          soustitre: "Agences de presse",
        },
      ],
    },
  },
  "2018": {
    libelle: "Presse magazine et d'information : cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023276150",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023276150",
          titre: "Convention collective des cadres de la presse magazine et d'information du 25 juin 1998 ",
          soustitre: "Presse magazine et d'information : cadres",
        },
      ],
    },
  },
  "2021": {
    libelle: "Golf",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635559",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635559",
          titre: "Convention collective nationale du golf du 13 juillet 1998",
          soustitre: "Golf",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du golf",
        id_kali: "KALICONT000005635559",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1999-04-14 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635559",
      },
    },
  },
  "2025": {
    libelle: "Convention collective régionale du travail des activités minières de Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale du travail des activités minières de Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2046": {
    libelle: "Centres de lutte contre le cancer",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021213367",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021213367",
          titre: "Convention collective nationale des centres de lutte contre le cancer du 1er janvier 1999",
          soustitre: "Centres de lutte contre le cancer",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel non médical des centres de lutte contre le cancer",
        id_kali: "KALICONT000021213367",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "1999-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021213367",
      },
    },
  },
  "2060": {
    libelle: "Cafétérias et assimilés (chaînes)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635326",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635326",
          titre:
            "Convention collective nationale des chaînes de cafétérias et assimilés du 28 août 1998. Etendue par arrêté du 20 décembre 1999 JORF 29 décembre 1999",
          soustitre: "Cafétérias et assimilés (chaînes)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des chaînes de cafétérias et assimilés",
        id_kali: "KALICONT000005635326",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1999-12-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635326",
      },
    },
  },
  "2064": {
    libelle: "Laboratoires cinématographiques et sous-titrage",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635553",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635553",
          titre:
            "Convention collective nationale des laboratoires cinématographiques et sous-titrage du 17 mars 1999.  Etendue par arrêté du 13 décembre 1999 JORF 22 décembre 1999.",
          soustitre: "Laboratoires cinématographiques et sous-titrage",
        },
      ],
    },
  },
  "2075": {
    libelle:
      "Œufs et industries en produits d’œufs (centres de conditionnement, de commercialisation et de transformation)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635097",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635097",
          titre:
            "Convention collective nationale des centres immatriculés de conditionnement, de commercialisation et de transformation des œufs et des industries en produits d'œufs du 10 mai 1999. Etendue par arrêté du 2 août 1999 JORF 10 août 1999",
          soustitre:
            "Œufs et industries en produits d’œufs (centres de conditionnement, de commercialisation et de transformation)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des centres immatriculés de conditionnement, de commercialisation et de transformation des œufs et des industries en produits d'œufs (fusion entre la 1747 et la 2075)",
        id_kali: "KALICONT000005635097",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1999-05-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635097",
      },
    },
  },
  "2089": {
    libelle: "Industrie des panneaux à base de bois",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635337",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635337",
          titre: "Convention collective nationale de l'industrie des panneaux à base de bois du 29 juin 1999.\n",
          soustitre: "Industrie des panneaux à base de bois",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'industrie des panneaux à base de bois",
        id_kali: "KALICONT000005635337",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1999-06-29 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635337",
      },
    },
  },
  "2098": {
    libelle: "Prestataires de services dans le domaine du secteur tertiaire",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635550",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635550",
          titre:
            "Convention collective nationale du personnel des prestataires de services dans le domaine du secteur tertiaire du 13 août 1999",
          soustitre: "Prestataires de services dans le domaine du secteur tertiaire",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel des prestataires de services dans le domaine du secteur tertiaire",
        id_kali: "KALICONT000005635550",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635550",
      },
    },
  },
  "2101": {
    libelle: "Enseignement privé à distance",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635332",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635332",
          titre:
            "Convention collective nationale de l'enseignement privé à distance du 21 juin 1999.  Étendue par arrêté du 5 juillet 2000 JORF 21 juillet 2000.\n",
          soustitre: "Enseignement privé à distance",
        },
      ],
    },
  },
  "2104": {
    libelle: "Thermalisme",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635545",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635545",
          titre:
            "Convention collective nationale du thermalisme du 10 septembre 1999.  Etendue par arrêté du 2 mars 2000 JORF 11 mars 2000",
          soustitre: "Thermalisme",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du thermalisme (fusion entre la 2264 et la 2104)",
        id_kali: "KALICONT000005635545",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635545",
      },
    },
  },
  "2111": {
    libelle: "Salariés du particulier employeur",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635792",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635792",
          titre:
            "Convention collective nationale des salariés du particulier employeur du 24 novembre 1999. \nRemplacée par la convention collective nationale des particuliers employeurs et de l'emploi à domicile du 15 mars 2021 résultant de la convergence des branches des assistants maternels et des salariés du particulier employeur (IDCC 3239) ",
          soustitre: "Salariés du particulier employeur",
        },
      ],
    },
  },
  "2120": {
    libelle: "Banque",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635780",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635780",
          titre:
            "Convention collective nationale de la banque du 10 janvier 2000.  Etendue par arrêté du 17 novembre 2004 JORF 11 décembre 2004.",
          soustitre: "Banque",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la banque",
        id_kali: "KALICONT000005635780",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-01-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635780",
      },
    },
  },
  "2121": {
    libelle: "Édition",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635096",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635096",
          titre: "Convention collective nationale de l'édition du 14 janvier 2000\n",
          soustitre: "Édition",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'édition",
        id_kali: "KALICONT000005635096",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-01-14 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635096",
      },
    },
  },
  "2128": {
    libelle: "Mutualité",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635784",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635784",
          titre: "Convention collective nationale de la mutualité du 31 janvier 2000",
          soustitre: "Mutualité",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la mutualité",
        id_kali: "KALICONT000005635784",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-01-31 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635784",
      },
    },
  },
  "2147": {
    libelle: "Entreprises des services d'eau et d'assainissement",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635338",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635338",
          titre:
            "Convention collective nationale des entreprises des services d'eau et d'assainissement du 12 avril 2000",
          soustitre: "Entreprises des services d'eau et d'assainissement",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises des services d'eau et d'assainissement (entreprises en gérance, en concession ou en affermage assurent l'exploitation, le service, le pompage, le traitement et la distribution d'eau à usage public, particulier, domestique, agricole)",
        id_kali: "KALICONT000005635338",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-04-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635338",
      },
    },
  },
  "2148": {
    libelle: "Télécommunications",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635557",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635557",
          titre: "Convention collective nationale des télécommunications du 26 avril 2000",
          soustitre: "Télécommunications",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des télécommunications",
        id_kali: "KALICONT000005635557",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-11-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635557",
      },
    },
  },
  "2149": {
    libelle: "Activités du déchet",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635782",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635782",
          titre:
            "Convention collective nationale des activités du déchet du 16 avril 2019 (Avenant n° 62 du 16 avril 2019) - Étendue par arrêté du 5 février 2021 JORF 11 février 2021",
          soustitre: "Activités du déchet",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635782",
          titre:
            "Convention collective nationale des activités du déchet du 11 mai 2000.  Etendue par arrêté du 5 juillet 2001 JORF 17 juillet 2001",
          soustitre: "Activités du déchet",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des activités du déchet",
        id_kali: "KALICONT000005635782",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-02-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635782",
      },
    },
  },
  "2150": {
    libelle: "Personnels des sociétés anonymes et fondations d'HLM",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635331",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635331",
          titre:
            "Convention collective nationale des personnels des sociétés anonymes et fondations d'HLM du 27 avril 2000.  Etendue par arrêté du 22 janvier 2001 JORF 6 février 2001.",
          soustitre: "Personnels des sociétés anonymes et fondations d'HLM",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des personnels des sociétés anonymes et fondations d'HLM",
        id_kali: "KALICONT000005635331",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-04-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635331",
      },
    },
  },
  "2156": {
    libelle: "Grands magasins et magasins populaires",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635093",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635093",
          titre:
            "Convention collective nationale des grands magasins et des magasins populaires du 30 juin 2000.  Etendue par arrêté du 20 décembre 2001 JORF 19 janvier 2002.",
          soustitre: "Grands magasins et magasins populaires",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des grands magasins et des magasins populaires",
        id_kali: "KALICONT000005635093",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-06-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635093",
      },
    },
  },
  "2162": {
    libelle: "Professions de la photographie",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635791",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635791",
          titre:
            "Convention collective nationale des professions de la photographie du 31 mars 2000.  Etendue par arrêté du 17 janvier 2001 JORF 26 janvier 2001.",
          soustitre: "Professions de la photographie",
        },
      ],
    },
  },
  "2174": {
    libelle: "Navigation intérieure (transport de marchandises : personnel sédentaire)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635584",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635584",
          titre:
            "Convention collective nationale du personnel sédentaire des entreprises de transport de marchandises de la navigation intérieure (3 annexes) du 5 septembre 2000.  Etendue par arrêté du 10 avril 2002 JORF 3 mai 2002.\nRemplacée par la convention collective nationale du personnel des entreprises de transport en navigation intérieure du 20 décembre 2018 (IDCC 3229)",
          soustitre: "Navigation intérieure (transport de marchandises : personnel sédentaire)",
        },
      ],
    },
  },
  "2190": {
    libelle: "Missions locales et PAIO",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635091",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635091",
          titre:
            "Convention collective nationale des missions locales et PAIO du 21 février 2001. (Etendue par arrêté du 27 décembre 2001 JO du 1er janvier 2002) (1)",
          soustitre: "Missions locales et PAIO",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des missions locales et PAIO des maisons de l'emploi et PLIE",
        id_kali: "KALICONT000005635091",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2001-02-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635091",
      },
    },
  },
  "2198": {
    libelle: "Entreprises de vente à distance",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635798",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635798",
          titre: "Convention collective nationale des entreprises du commerce à distance du 6 février 2001  ",
          soustitre: "Entreprises de vente à distance",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de vente à distance",
        id_kali: "KALICONT000005635798",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2001-02-06 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635798",
      },
    },
  },
  "2205": {
    libelle: "Notariat",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635092",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635092",
          titre: "Convention collective nationale du notariat du 8 juin 2001",
          soustitre: "Notariat",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635092",
          titre:
            "Convention collective nationale du notariat du 8 juin 2001 actualisée par l'accord du 16 décembre 2021",
          soustitre: "Notariat",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635092",
          titre: "Convention collective nationale du notariat du 19 février 2015 (Accord du 19 février 2015)",
          soustitre: "Notariat",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du notariat ",
        id_kali: "KALICONT000005635092",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635092",
      },
    },
  },
  "2216": {
    libelle: "Commerce de détail et de gros à prédominance alimentaire",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635085",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635085",
          titre:
            "Convention collective nationale du commerce de détail et de gros à prédominance alimentaire du 12 juillet 2001",
          soustitre: "Commerce de détail et de gros à prédominance alimentaire",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du commerce de détail et de gros à prédominance alimentaire (entrepôts d'alimentation, supérettes, supermarchés, hypermarchés, grande distribution)",
        id_kali: "KALICONT000005635085",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-09-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635085",
      },
    },
  },
  "2219": {
    libelle: "Taxis",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021125058",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021125058",
          titre: "Convention collective nationale des taxis du 11 septembre 2001",
          soustitre: "Taxis",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des taxis",
        id_kali: "KALICONT000021125058",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2001-09-11 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021125058",
      },
    },
  },
  "2221": {
    libelle: "Convention collective régionale des mensuels des industries des métaux de l'Isère et des Hautes-Alpes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des mensuels des industries des métaux de l'Isère et des Hautes-Alpes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2230": {
    libelle: "Qualité de l'air : associations agrées de surveillance",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635351",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635351",
          titre:
            "Convention collective nationale des associations agréées de surveillance de la qualité de l'air du 3 octobre 2001.\n",
          soustitre: "Qualité de l'air : associations agrées de surveillance",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des associations agréées de surveillance de la qualité de l'air (annexée à la convention collective nationale des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils 1486)",
        id_kali: "KALICONT000005635351",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2003-12-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635351",
      },
    },
  },
  "2247": {
    libelle: "Entreprises de courtage d'assurances et/ou de réassurances",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635720",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635720",
          titre:
            "Convention collective nationale des entreprises de courtage d'assurances et/ou de réassurances du 18 janvier 2002, étendue par arrêté du 14 octobre 2002 (JO du 25 octobre 2002)",
          soustitre: "Entreprises de courtage d'assurances et/ou de réassurances",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de courtage d'assurances et/ou de réassurances",
        id_kali: "KALICONT000005635720",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-01-18 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635720",
      },
    },
  },
  "2250": {
    libelle: "Convention collective régionale de la boulangerie-pâtisserie de la Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de la boulangerie-pâtisserie de la Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2257": {
    libelle: "Casinos",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635618",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635618",
          titre:
            "Convention collective nationale des casinos du 29 mars 2002. Etendue par arrêté du 2 avril 2003 JORF 29 avril 2003.",
          soustitre: "Casinos",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des casinos",
        id_kali: "KALICONT000005635618",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-03-29 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635618",
      },
    },
  },
  "2264": {
    libelle: "Hospitalisation privée",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635813",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635813",
          titre: "Convention collective nationale de l'hospitalisation privée du 18 avril 2002\n",
          soustitre: "Hospitalisation privée",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationalede l'hospitalisation privée (CCU, FHP, établissements pour personnes âgées, maison de retraite, établissements de suite et réadaptation, médicaux pour enfants et adolescents, UHP, sanitaires sociaux et médico-sociaux CRRR, hospitalisation privé à but lucratif FIEHP ) (fusion entre la 2264 et la 2104)",
        id_kali: "KALICONT000005635813",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-04-18 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635813",
      },
    },
  },
  "2270": {
    libelle: "Universités et instituts catholiques",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021124943",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021124943",
          titre: "Convention collective nationale des universités et instituts catholiques de France du 4 juin 2002  ",
          soustitre: "Universités et instituts catholiques",
        },
        {
          etat_juridique: "MODIFIE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021124943",
          titre: "Convention collective nationale des universités et instituts catholiques de France du 4 juin 2002  ",
          soustitre: "Universités et instituts catholiques",
        },
      ],
    },
  },
  "2272": {
    libelle: "Assainissement et maintenance industrielle",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635133",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635133",
          titre:
            "Convention collective nationale de l'assainissement et de la maintenance industrielle du 21 mai 2002.  Etendue par arrêté du 26 octobre 2004 JORF 9 novembre 2004.",
          soustitre: "Assainissement et maintenance industrielle",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'assainissement et de la maintenance industrielle",
        id_kali: "KALICONT000005635133",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-05-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635133",
      },
    },
  },
  "2306": {
    libelle: "Métiers du verre",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635822",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635822",
          titre:
            "Convention collective nationale de l'Union des chambres syndicales des métiers du verre du 18 décembre 2002.  Etendue par arrêté du 9 février 2004 JORF 18 février 2004.",
          soustitre: "Métiers du verre",
        },
      ],
    },
  },
  "2310": {
    libelle:
      "Spectacles : rapports entre entrepreneurs de spectacles et artistes dramatiques, lyriques, chorégraphiques, marionnettistes, de variétés et musiciens en tournées",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635589",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635589",
          titre:
            "Convention collective nationale régissant les rapports entre les entrepreneurs de spectacles et les artistes dramatiques, lyriques, chorégraphiques, marionnettistes, de variétés et musiciens en tournées du 7 février 2003.  Etendue par arrêté du 20 octobre 2004 JORF 5 novembre 2004.",
          soustitre:
            "Spectacles : rapports entre entrepreneurs de spectacles et artistes dramatiques, lyriques, chorégraphiques, marionnettistes, de variétés et musiciens en tournées",
        },
      ],
    },
  },
  "2322": {
    libelle: "Chanson, variétés, jazz, musiques actuelles",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021213399",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021213399",
          titre:
            "Convention collective nationale de la branche chanson, variétés, jazz, musiques actuelles du  30 avril 2003",
          soustitre: "Chanson, variétés, jazz, musiques actuelles",
        },
      ],
    },
  },
  "2328": {
    libelle:
      "Convention collective départementale des ouvriers du bâtiment et des travaux publics de la Guadeloupe et dépendances",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des ouvriers du bâtiment et des travaux publics de la Guadeloupe et dépendances",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2332": {
    libelle: "Entreprises d'architecture",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635365",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635365",
          titre:
            "Convention collective nationale des entreprises d'architecture du 27 février 2003.  Etendue par arrêté du 6 janvier 2004 JORF 16 janvier 2004.",
          soustitre: "Entreprises d'architecture",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises d'architecture",
        id_kali: "KALICONT000005635365",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2003-02-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635365",
      },
    },
  },
  "2335": {
    libelle: "Personnels des agences générales d'assurances",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635361",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635361",
          titre:
            "Convention collective nationale du personnel des agences générales d'assurances du 17 septembre 2019 (Avenant n° 22 du 17 septembre 2019) - Étendue par arrêté du 21 mai 2021 JORF 4 juin 2021",
          soustitre: "Personnels des agences générales d'assurances",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635361",
          titre:
            "Convention collective nationale du personnel des agences générales d'assurances du 2 juin 2003. Etendue par arrêté du 9 décembre 2003 JORF 18 décembre 2003  ",
          soustitre: "Personnels des agences générales d'assurances",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des agences générales d'assurances",
        id_kali: "KALICONT000005635361",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2020-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635361",
      },
    },
  },
  "2336": {
    libelle: "Organismes gestionnaires de foyers et services pour jeunes travailleurs",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635560",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635560",
          titre:
            "Convention collective nationale de l'habitat et du logement accompagnés du 16 juillet 2003. Etendue par arrêté du 9 février 2004 JORF 18 février 2004.\n",
          soustitre: "Organismes gestionnaires de foyers et services pour jeunes travailleurs",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'habitat et du logement accompagnés",
        id_kali: "KALICONT000005635560",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2003-07-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635560",
      },
    },
  },
  "2344": {
    libelle: "Sidérurgie",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021284958",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021284958",
          titre: "Convention collective nationale de la sidérurgie du 20 novembre 2001",
          soustitre: "Sidérurgie",
        },
      ],
    },
  },
  "2345": {
    libelle: "Convention collective régionale du transport sanitaire en Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale du transport sanitaire en Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2357": {
    libelle: "Accord professionnel national du 3 mars 1993 relatif aux cadres de direction des sociétés d'assurances",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accord professionnel national du 3 mars 1993 relatif aux cadres de direction des sociétés d'assurances",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2360": {
    libelle: "Convention collective régionale des services de l'automobile de la Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des services de l'automobile de la Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2372": {
    libelle: "Distribution directe",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635128",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635128",
          titre:
            "Convention collective nationale de la distribution directe du 9 février 2004.  Etendue par arrêté du 16 juillet 2004 JORF 28 juillet 2004.",
          soustitre: "Distribution directe",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de la distribution directe",
        id_kali: "KALICONT000005635128",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2004-02-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635128",
      },
    },
  },
  "2378": {
    libelle:
      "Accords professionnels nationaux concernant le personnel intérimaire des entreprises de travail temporaire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Accords professionnels nationaux concernant le personnel intérimaire des entreprises de travail temporaire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2389": {
    libelle: "Convention collective régionale des ouvriers du bâtiment et des travaux publics région de La Réunion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ouvriers du bâtiment et des travaux publics région de La Réunion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2395": {
    libelle: "Assistants maternels du particulier employeur",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635807",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635807",
          titre:
            "Convention collective nationale des assistants maternels du particulier employeur du 1er juillet 2004.  Etendue par arrêté du 17 décembre 2004 JORF 28 décembre 2004. \nRemplacée par la convention collective nationale des particuliers employeurs et de l'emploi à domicile du 15 mars 2021 résultant de la convergence des branches des assistants maternels et des salariés du particulier employeur (IDCC 3239)",
          soustitre: "Assistants maternels du particulier employeur",
        },
      ],
    },
  },
  "2397": {
    libelle: "Mannequins adultes et mannequins enfants de moins de 16 ans employés par les agences de mannequins",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635138",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635138",
          titre:
            "Convention collective nationale des mannequins adultes et mannequins enfants de moins de 16 ans employés par les agences de mannequins du 22 juin 2004.  Etendue par arrêté du 13 avril 2005 JORF 27 avril 2005",
          soustitre:
            "Mannequins adultes et mannequins enfants de moins de 16 ans employés par les agences de mannequins",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des mannequins adultes et des mannequins enfants de moins de seize ans employés par les agences de mannequins (fusion entre la 2717 et la 2397)",
        id_kali: "KALICONT000005635138",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2004-06-22 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635138",
      },
    },
  },
  "2405": {
    libelle:
      "Convention collective départementale des établissements d'hospitalisation privée de la Guadeloupe du 01/04/2003",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des établissements d'hospitalisation privée de la Guadeloupe du 01/04/2003",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2408": {
    libelle: "Enseignement privé : personnels administratifs, personnels d'éducation et documentalistes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635816",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635816",
          titre:
            "Convention collective nationale des personnels des services administratifs et économiques, personnels d'éducation et documentalistes des établissements d'enseignement privés du 14 juin 2004.",
          soustitre: "Enseignement privé : personnels administratifs, personnels d'éducation et documentalistes",
        },
      ],
    },
  },
  "2409": {
    libelle: "Travaux publics (Tome IV : Cadres)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018925934",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018925934",
          titre: "Convention collective nationale des cadres des travaux publics du 1er juin 2004",
          soustitre: "Travaux publics (Tome IV : Cadres)",
        },
      ],
    },
  },
  "2410": {
    libelle:
      "Biscotteries, biscuiteries, chocolateries, confiseries, aliments de l'enfance et de la diététique, préparations pour desserts",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635817",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635817",
          titre:
            "Convention collective nationale des biscotteries, biscuiteries, céréales prêtes à consommer ou à préparer, chocolateries, confiseries, aliments de l'enfance et de la diététique, préparation pour entremets et desserts ménagers, des glaces, sorbets et crèmes glacées du 17 mai 2004 (1) (2)",
          soustitre:
            "Biscotteries, biscuiteries, chocolateries, confiseries, aliments de l'enfance et de la diététique, préparations pour desserts",
        },
      ],
    },
  },
  "2411": {
    libelle: "Chaînes thématiques",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635585",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635585",
          titre:
            "Convention collective nationale des chaînes thématiques du 19 juin 2017 (Avenant n° 4 du 19 juin 2017) ",
          soustitre: "Chaînes thématiques",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635585",
          titre:
            "Convention collective nationale des chaînes thématiques du 23 juillet 2004.  Etendue par arrêté 4 juillet 2005 JORF 19 juillet 2005.",
          soustitre: "Chaînes thématiques",
        },
      ],
    },
  },
  "2412": {
    libelle: "Production de films d'animation",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635129",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635129",
          titre:
            "Convention collective nationale de la production de films d'animation du 6 juillet 2004.  Etendue par arrêté du 18 juillet 2005 JORF 26 juillet 2005.",
          soustitre: "Production de films d'animation",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la production de films d'animation",
        id_kali: "KALICONT000005635129",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2004-07-06 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635129",
      },
    },
  },
  "2420": {
    libelle: "Bâtiment Cadres",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017941839",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017941839",
          titre: "Convention collective nationale des cadres du bâtiment du 1er juin 2004",
          soustitre: "Bâtiment Cadres",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cadres du bâtiment du 1er juin 2004",
        id_kali: "KALICONT000017941839",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2005-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017941839",
      },
    },
  },
  "2450": {
    libelle: "Crédit mutuel Centre Est Europe, Sud-Est",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022355776",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022355776",
          titre: "Convention collective du personnel du Crédit mutuel Centre Est Europe, Sud-Est du 22 octobre 2004 ",
          soustitre: "Crédit mutuel Centre Est Europe, Sud-Est",
        },
      ],
    },
  },
  "2480": {
    libelle: "Manutention portuaire du port de Fort-de-France",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022206280",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022206280",
          titre: "Convention collective de la manutention portuaire du port de Fort-de-France du 4 juillet 2003",
          soustitre: "Manutention portuaire du port de Fort-de-France",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective locale de la manutention portuaire du port de Fort-de-France du 4 juillet 2003",
        id_kali: "KALICONT000022206280",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2003-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022206280",
      },
    },
  },
  "2493": {
    libelle: "Coiffure et professions connexes",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635125",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635125",
          titre:
            "Convention collective nationale de la coiffure et professions connexes.  Etendue par arrêté du 12 octobre 2005 JORF 23 octobre 2005.",
          soustitre: "Coiffure et professions connexes",
        },
      ],
    },
  },
  "2494": {
    libelle: "Coopération maritime",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563634",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563634",
          titre:
            "Convention collective nationale de la coopération maritime du 7 décembre 2004 (réécrite par avenant n° 8 du 23 novembre 2011)",
          soustitre: "Coopération maritime",
        },
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563634",
          titre: "Convention collective nationale de la coopération maritime du 7 décembre 2004",
          soustitre: "Coopération maritime",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la coopération maritime",
        id_kali: "KALICONT000018563634",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2005-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563634",
      },
    },
  },
  "2511": {
    libelle: "Sport",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017577652",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017577652",
          titre: "Convention collective nationale du sport du 7 juillet 2005 étendue par arrêté du 21 novembre 2006",
          soustitre: "Sport",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du sport",
        id_kali: "KALICONT000017577652",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2005-07-07 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017577652",
      },
    },
  },
  "2526": {
    libelle: "Organisations professionnelles de l'habitat social",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635376",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635376",
          titre:
            "Convention collective nationale des organisations professionnelles de l'habitat social du 20 septembre 2005.  Etendue par arrêté du 18 octobre 2006 JORF 29 octobre 2006",
          soustitre: "Organisations professionnelles de l'habitat social",
        },
      ],
    },
  },
  "2528": {
    libelle: "Industries de la maroquinerie, articles de voyage, chasse-sellerie, gainerie, bracelets en cuir",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635109",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635109",
          titre:
            "Convention collective nationale des industries de la maroquinerie, articles de voyage, chasse-sellerie, gainerie, bracelets en cuir du 9 septembre 2005.  Etendue par arrêté du 12 juin 2006 JORF 23 juin 2006.\n",
          soustitre: "Industries de la maroquinerie, articles de voyage, chasse-sellerie, gainerie, bracelets en cuir",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des industries de la maroquinerie, articles de voyage, chasse sellerie, gainerie, bracelets en cuir",
        id_kali: "KALICONT000005635109",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2005-09-09 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635109",
      },
    },
  },
  "2534": {
    libelle: "Convention collective départementale de l'industrie sucrière et rhumière de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale de l'industrie sucrière et rhumière de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2535": {
    libelle: "Convention collective départementale dans la culture de la canne à sucre en Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale dans la culture de la canne à sucre en Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2542": {
    libelle: "Métallurgie : Aisne (industries métallurgiques, mécaniques et connexes)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019938657",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019938657",
          titre:
            "Convention collective départementale des industries métallurgiques, mécaniques et connexes de l'Aisne du 30 septembre 2005",
          soustitre: "Métallurgie : Aisne (industries métallurgiques, mécaniques et connexes)",
        },
      ],
    },
  },
  "2543": {
    libelle: "Cabinets ou entreprises de géomètres-experts, géomètres-topographes, photogrammètres et experts fonciers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635804",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635804",
          titre:
            "Convention collective nationale des cabinets ou entreprises de géomètres-experts, géomètres-topographes, photogrammètres et experts fonciers du 13 octobre 2005.  Etendue par arrêté du 24 juillet 2006 JORF 2 août 2006",
          soustitre:
            "Cabinets ou entreprises de géomètres-experts, géomètres-topographes, photogrammètres et experts fonciers",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des cabinets ou entreprises de géomètres experts, géomètres topographes photogrammètres, experts-fonciers",
        id_kali: "KALICONT000005635804",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2005-10-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635804",
      },
    },
  },
  "2564": {
    libelle: "Vétérinaires (praticiens salariés)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635824",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635824",
          titre:
            "Convention collective nationale des vétérinaires praticiens salariés du 31 janvier 2006 : annexe VII de la CCN des cabinets et cliniques vétérinaires (article 4 de l'accord du 29 mars 2019)",
          soustitre: "Vétérinaires (praticiens salariés)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des vétérinaires praticiens salariés",
        id_kali: "KALICONT000005635824",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2006-01-31 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635824",
      },
    },
  },
  "2567": {
    libelle: "Glaces : industries des sorbets, crèmes glacées",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018827610",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018827610",
          titre: "Convention collective nationale de l'industrie des glaces, sorbets et crèmes glacées du 3 mars 2006",
          soustitre: "Glaces : industries des sorbets, crèmes glacées",
        },
      ],
    },
  },
  "2579": {
    libelle: "Métallurgie (Loir-et-Cher)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023278100",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023278100",
          titre: "Convention collective  des industries métallurgiques et connexes de Loir-et-Cher du 5 juillet 1991",
          soustitre: "Métallurgie (Loir-et-Cher)",
        },
      ],
    },
  },
  "2583": {
    libelle: "Sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018977636",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018977636",
          titre:
            "Convention collective nationale des sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers du 27 juin 2006 ",
          soustitre: "Sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de branche des sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers",
        id_kali: "KALICONT000018977636",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2006-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018977636",
      },
    },
  },
  "2594": {
    libelle: "Remontées mécaniques : installateurs",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021259110",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021259110",
          titre: "Convention collective nationale des installateurs en remontées mécaniques du 15 mai 2006",
          soustitre: "Remontées mécaniques : installateurs",
        },
      ],
    },
  },
  "2596": {
    libelle: "Coiffure et professions connexes",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563755",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563755",
          titre:
            "Convention collective nationale de la coiffure et des professions connexes du 10 juillet 2006. Etendue par arrêté du 3 avril 2007 JORF 17 avril 2007.",
          soustitre: "Coiffure et professions connexes",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la coiffure et des professions connexes",
        id_kali: "KALICONT000018563755",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2007-04-18 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018563755",
      },
    },
  },
  "2603": {
    libelle: "Praticiens-conseils du régime général de sécurité sociale",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074546",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074546",
          titre:
            "Convention collective nationale des praticiens-conseils du régime général de sécurité sociale du 4 avril 2006",
          soustitre: "Praticiens-conseils du régime général de sécurité sociale",
        },
        {
          etat_juridique: "MODIFIE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074546",
          titre:
            "Convention collective nationale des praticiens-conseils du régime général de sécurité sociale du 4 avril 2006 (1)",
          soustitre: "Praticiens-conseils du régime général de sécurité sociale",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des praticiens conseils du régime général de sécurité sociale",
        id_kali: "KALICONT000019074546",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2012-04-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074546",
      },
    },
  },
  "2609": {
    libelle: "Bâtiment ETAM",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018773893",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018773893",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise du bâtiment du 12 juillet 2006",
          soustitre: "Bâtiment ETAM",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des employés, techniciens et agents de maîtrise du bâtiment",
        id_kali: "KALICONT000018773893",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2007-06-29 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018773893",
      },
    },
  },
  "2614": {
    libelle: "Travaux publics (Tome III : ETAM)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018926209",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018926209",
          titre:
            "Convention collective nationale des employés, techniciens et agents de maîtrise des travaux publics du 12 juillet 2006",
          soustitre: "Travaux publics (Tome III : ETAM)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des employés, techniciens et agents de maîtrise des travaux publics",
        id_kali: "KALICONT000018926209",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2006-07-12 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018926209",
      },
    },
  },
  "2622": {
    libelle: "Crédit maritime mutuel",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019906336",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019906336",
          titre: "Convention collective nationale du Crédit maritime mutuel du 18 janvier 2002",
          soustitre: "Crédit maritime mutuel",
        },
      ],
    },
  },
  "2631": {
    libelle:
      "Accord collectif national Branche de la télédiffusion. Salariés employés sous contrat à durée déterminée d'usage",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Accord collectif national Branche de la télédiffusion. Salariés employés sous contrat à durée déterminée d'usage",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2636": {
    libelle: "Enseignement, écoles supérieures ingénieurs et cadres (FESIC)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018879385",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018879385",
          titre:
            "Convention collective nationale de l'enseignement, écoles supérieures d'ingénieurs et de cadres ― FESIC du 5 décembre 2006",
          soustitre: "Enseignement, écoles supérieures ingénieurs et cadres (FESIC)",
        },
      ],
    },
  },
  "2642": {
    libelle: "Production audiovisuelle",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018828041",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018828041",
          titre: "Convention collective nationale de la production audiovisuelle du 13 décembre 2006.\n",
          soustitre: "Production audiovisuelle",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la production audiovisuelle",
        id_kali: "KALICONT000018828041",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2006-12-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000018828041",
      },
    },
  },
  "2658": {
    libelle: "Guides et accompagnateurs en milieu amazonien",
    nature: "CONVENTION COLLECTIVE RÉGIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074623",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074623",
          titre: "Convention collective régionale des guides et accompagnateurs en milieu amazonien du 12 mai 2007",
          soustitre: "Guides et accompagnateurs en milieu amazonien",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074623",
          titre:
            "Convention collective régionale du travail des guides d'expédition, guides accompagnateurs et guides animateurs en milieu amazonien du 12 mai 2007",
          soustitre: "Guides et accompagnateurs en milieu amazonien",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective régionale du travail des guides d'expédition, guides accompagnateurs et guides animateurs en milieu amazonien",
        id_kali: "KALICONT000019074623",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE RÉGIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2010-12-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019074623",
      },
    },
  },
  "2666": {
    libelle: "Conseils d'architecture, d'urbanisme et de l'environnement",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000020089210",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000020089210",
          titre:
            "Convention collective nationale des acteurs du développement et de l'ingénierie territoriale d'intérêt général (ADITIG) du 24 mai 2007",
          soustitre: "Conseils d'architecture, d'urbanisme et de l'environnement",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des conseils d'architecture, d'urbanisme et de l'environnement",
        id_kali: "KALICONT000020089210",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2007-05-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000020089210",
      },
    },
  },
  "2668": {
    libelle:
      "Convention collective nationale de travail des cadres supérieurs des sociétés de secours minières et de leurs établissements, des unions régionales et des assistants sociaux régionaux",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des cadres supérieurs des sociétés de secours minières et de leurs établissements, des unions régionales et des assistants sociaux régionaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2683": {
    libelle: "Portage de presse",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019901252",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019901252",
          titre: "Convention collective nationale du portage de presse du 26 juin 2007",
          soustitre: "Portage de presse",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du portage de presse",
        id_kali: "KALICONT000019901252",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2009-06-26 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019901252",
      },
    },
  },
  "2691": {
    libelle: "Enseignement privé indépendant",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019593660",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019593660",
          titre: "Convention collective nationale de l'enseignement privé indépendant du 27 novembre 2007\n",
          soustitre: "Enseignement privé indépendant",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'enseignement privé indépendant (hors contrat)",
        id_kali: "KALICONT000019593660",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2007-11-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019593660",
      },
    },
  },
  "2697": {
    libelle: "Personnels des structures associatives cynégétiques",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019647647",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019647647",
          titre:
            "Convention collective nationale des personnels des structures associatives cynégétiques du 13 décembre 2007 ",
          soustitre: "Personnels des structures associatives cynégétiques",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des personnels des structures associatives cynégétiques",
        id_kali: "KALICONT000019647647",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2007-12-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019647647",
      },
    },
  },
  "2701": {
    libelle: "Banque : personnel des banques (Guyane)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973390",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973390",
          titre: "Convention collective du travail du personnel des banques de la Guyane du 18 décembre 2007",
          soustitre: "Banque : personnel des banques (Guyane)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective départementale du travail du personnel des banques de la Guyane",
        id_kali: "KALICONT000023973390",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2008-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973390",
      },
    },
  },
  "2702": {
    libelle: "Banque : personnel des banques (Martinique)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973576",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973576",
          titre: "Convention collective du travail  du personnel des banques de la Martinique du 17 décembre 2007",
          soustitre: "Banque : personnel des banques (Martinique)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective départementale du travail du personnel des banques de la Martinique",
        id_kali: "KALICONT000023973576",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2008-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973576",
      },
    },
  },
  "2704": {
    libelle: "Banque : personnel des banques (Guadeloupe, Saint-Martin, Saint-Barthélemy)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973173",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973173",
          titre:
            "Convention collective du personnel des banques de la Guadeloupe, de Saint-Martin et de Saint-Barthélemy du 19 décembre 2007 ",
          soustitre: "Banque : personnel des banques (Guadeloupe, Saint-Martin, Saint-Barthélemy)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective départementale du travail du personnel des banques de la Guadeloupe, de Saint-Martin et de Saint-Barthélémy",
        id_kali: "KALICONT000023973173",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2007-12-19 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973173",
      },
    },
  },
  "2706": {
    libelle: "Administrateurs et mandataires judiciaires",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019647748",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019647748",
          titre:
            "Convention collective nationale du personnel des administrateurs et des mandataires judiciaires du 20 décembre 2007",
          soustitre: "Administrateurs et mandataires judiciaires",
        },
      ],
    },
  },
  "2707": {
    libelle: "Bâtiment ETAM (Île-de-France hors Seine-et-Marne)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000024794551",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000024794551",
          titre:
            "Convention collective régionale des employés, techniciens et agents de maîtrise du bâtiment de la région Ile-de-France (hors Seine-et-Marne) du 19 novembre 2007",
          soustitre: "Bâtiment ETAM (Île-de-France hors Seine-et-Marne)",
        },
      ],
    },
  },
  "2717": {
    libelle: "Entreprises techniques au service de la création et de l'événement",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019906603",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019906603",
          titre:
            "Convention collective nationale des entreprises techniques au service de la création et de l'événement du 21 février 2008",
          soustitre: "Entreprises techniques au service de la création et de l'événement",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des entreprises techniques au service de la création et de l'événement (fusion entre la 2717 et la 2397)",
        id_kali: "KALICONT000019906603",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2008-02-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019906603",
      },
    },
  },
  "2727": {
    libelle: "Omnipraticiens exerçant dans les centres de santé miniers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973762",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973762",
          titre:
            "Convention collective nationale des omnipraticiens exerçant dans les centres de santé miniers du 23 janvier 2008",
          soustitre: "Omnipraticiens exerçant dans les centres de santé miniers",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des omnipraticiens exerçant dans les centres de santé miniers",
        id_kali: "KALICONT000023973762",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2008-03-10 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023973762",
      },
    },
  },
  "2728": {
    libelle: "Sucreries, sucreries-distilleries et raffineries de sucre",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025196564",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025196564",
          titre:
            "Convention collective nationale des sucreries, sucreries-distilleries et raffineries de sucre du 31 janvier 2008",
          soustitre: "Sucreries, sucreries-distilleries et raffineries de sucre",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des sucreries, sucreries-distilleries et raffineries de sucre",
        id_kali: "KALICONT000025196564",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2008-01-31 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025196564",
      },
    },
  },
  "2754": {
    libelle: "Magasins prestataires de services de cuisine à usage domestique",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019765628",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019765628",
          titre:
            "Convention collective nationale des magasins prestataires de services de cuisine à usage domestique du  17 juillet 2008\n\n",
          soustitre: "Magasins prestataires de services de cuisine à usage domestique",
        },
      ],
    },
  },
  "2768": {
    libelle: "Convention collective nationale de travail des pharmaciens du régime minier",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale de travail des pharmaciens du régime minier",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2770": {
    libelle: "Edition phonographique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974024",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974024",
          titre:
            "Convention collective nationale de l'édition phonographique du 30 juin 2008. Étendue par arrêté du 20 mars 2009 JORF 28 mars 2009.\n",
          soustitre: "Edition phonographique",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de l'édition phonographique (annexée à la convention collective nationale de l'édition 2121)",
        id_kali: "KALICONT000023974024",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2008-06-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974024",
      },
    },
  },
  "2785": {
    libelle:
      "Sociétés de ventes volontaires de meubles aux enchères publiques et des offices de commissaires-priseurs judiciaires",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021636922",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021636922",
          titre:
            "Convention collective nationale des sociétés de ventes volontaires de meubles aux enchères publiques et des offices de commissaires-priseurs judiciaires du 17 décembre 2008",
          soustitre:
            "Sociétés de ventes volontaires de meubles aux enchères publiques et des offices de commissaires-priseurs judiciaires",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des sociétés de ventes volontaires de meubles aux enchères publiques et des offices de commissaires-priseurs judiciaires",
        id_kali: "KALICONT000021636922",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2008-12-17 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021636922",
      },
    },
  },
  "2796": {
    libelle: "Régime social des indépendants Personnel de direction",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974594",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974594",
          titre: "Convention collective  du personnel de direction du régime social des indépendants du 20 mars 2008",
          soustitre: "Régime social des indépendants Personnel de direction",
        },
      ],
    },
  },
  "2797": {
    libelle: "Régime social des indépendants Praticiens-conseils",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974782",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023974782",
          titre:
            "Convention collective nationale des praticiens-conseils du régime social des indépendants du 15 juin 2007",
          soustitre: "Régime social des indépendants Praticiens-conseils",
        },
      ],
    },
  },
  "2798": {
    libelle: "Régime social des indépendants Employés et cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023822189",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000023822189",
          titre:
            "Convention collective nationale des employés et cadres du régime social des indépendants du 20 mars 2008",
          soustitre: "Régime social des indépendants Employés et cadres",
        },
      ],
    },
  },
  "2847": {
    libelle: "Pôle emploi",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025278390",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025278390",
          titre:
            "Convention collective nationale de Pôle emploi du 21 novembre 2009. Étendue par arrêté du 19 février 2010 JORF 24 février 2010. Agréée par arrêté du 21 décembre 2009 JORF 27 décembre 2009",
          soustitre: "Pôle emploi",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de Pôle Emploi",
        id_kali: "KALICONT000025278390",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2010-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025278390",
      },
    },
  },
  "2870": {
    libelle:
      "Convention collective régionale des ouvriers du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des ouvriers du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2931": {
    libelle: "Activités de marchés financiers",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025496787",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025496787",
          titre: "Convention collective nationale des activités de marchés financiers du 11 juin 2010",
          soustitre: "Activités de marchés financiers",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des activités de marchés financiers",
        id_kali: "KALICONT000025496787",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2010-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025496787",
      },
    },
  },
  "2941": {
    libelle: "Aide, accompagnement, soins et services à domicile (BAD)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025805800",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025805800",
          titre:
            "Convention collective nationale de la branche de l'aide, de l'accompagnement, des soins et des services à domicile du 21 mai 2010",
          soustitre: "Aide, accompagnement, soins et services à domicile (BAD)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la branche de l'aide, de l'accompagnement, des soins et des services à domicile",
        id_kali: "KALICONT000025805800",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2010-05-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025805800",
      },
    },
  },
  "2964": {
    libelle:
      "Accord collectif départemental relatif au transport de proximité public et privé de produits pétroliers et de liquides inflammables sur le territoire de la Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Accord collectif départemental relatif au transport de proximité public et privé de produits pétroliers et de liquides inflammables sur le territoire de la Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "2972": {
    libelle: "Personnel sédentaire des entreprises de navigation",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025844703",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025844703",
          titre:
            "Convention collective nationale du personnel sédentaire des entreprises de navigation du 14 septembre 2010",
          soustitre: "Personnel sédentaire des entreprises de navigation",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel sédentaire des entreprises de navigation",
        id_kali: "KALICONT000025844703",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-12-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000025844703",
      },
    },
  },
  "2978": {
    libelle: "Convention collective nationale du personnel salarié des agences de recherches privées",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel salarié des agences de recherches privées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3013": {
    libelle: "Librairie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027180935",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027180935",
          titre: "Convention collective nationale de la librairie du 24 mars 2011",
          soustitre: "Librairie",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la librairie",
        id_kali: "KALICONT000027180935",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-09-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027180935",
      },
    },
  },
  "3016": {
    libelle: "Ateliers et chantiers d'insertion",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027181035",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027181035",
          titre: "Convention collective nationale des ateliers et chantiers d'insertion du 31 mars 2011 ",
          soustitre: "Ateliers et chantiers d'insertion",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des ateliers chantiers d'insertion",
        id_kali: "KALICONT000027181035",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-03-31 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027181035",
      },
    },
  },
  "3017": {
    libelle: "Ports et manutention",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029142476",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029142476",
          titre: "Convention collective nationale unifiée ports et manutention du 15 avril 2011",
          soustitre: "Ports et manutention",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale unifiée ports et manutention",
        id_kali: "KALICONT000029142476",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-05-03 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029142476",
      },
    },
  },
  "3028": {
    libelle:
      "Convention collective régionale des transports routiers et activités auxiliaires du transport de la Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des transports routiers et activités auxiliaires du transport de la Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3032": {
    libelle: "Parfumerie, esthétique",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027065067",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027065067",
          titre:
            "Convention collective nationale de l'esthétique-cosmétique et de l'enseignement technique et professionnel lié aux métiers de l'esthétique et de la parfumerie du 24 juin 2011 ",
          soustitre: "Parfumerie, esthétique",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de l'esthétique - cosmétique et de l'enseignement technique et professionnel liés aux métiers de l'esthétique et de la parfumerie",
        id_kali: "KALICONT000027065067",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-06-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027065067",
      },
    },
  },
  "3043": {
    libelle: "Entreprises de propreté et services associés (26 juillet 2011)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027172335",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027172335",
          titre: "Convention collective nationale des entreprises de propreté et services associés du 26 juillet 2011",
          soustitre: "Entreprises de propreté et services associés (26 juillet 2011)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises de propreté et services associés du 26 juillet 2011.",
        id_kali: "KALICONT000027172335",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027172335",
      },
    },
  },
  "3090": {
    libelle: "Spectacle vivant (entreprises du secteur privé)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028157262",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028157262",
          titre:
            "Convention collective nationale des entreprises du secteur privé du spectacle vivant du 3 février 2012 ",
          soustitre: "Spectacle vivant (entreprises du secteur privé)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises du secteur privé du spectacle vivant",
        id_kali: "KALICONT000028157262",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028157262",
      },
    },
  },
  "3097": {
    libelle: "Production cinématographique (19 janvier 2012)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028059838",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028059838",
          titre: "Convention collective nationale de la production cinématographique du 19 janvier 2012",
          soustitre: "Production cinématographique (19 janvier 2012)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la production cinématographique",
        id_kali: "KALICONT000028059838",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028059838",
      },
    },
  },
  "3105": {
    libelle: "Régies de quartier",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027199162",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027199162",
          titre: "Convention collective nationale des régies de quartier du 2 avril 2012",
          soustitre: "Régies de quartier",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des régies de quartier",
        id_kali: "KALICONT000027199162",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2012-05-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027199162",
      },
    },
  },
  "3107": {
    libelle: "Bâtiment et travaux publics et activités annexes ETAM (Martinique)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343053",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343053",
          titre:
            "Convention collective des employés, techniciens et agents de maîtrise du bâtiment, travaux publics et activités annexes (Martinique) du 31 mai 2012",
          soustitre: "Bâtiment et travaux publics et activités annexes ETAM (Martinique)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective régionale des employés, techniciens et agents de maîtrise du bâtiment et des travaux publics et annexes de la Martinique",
        id_kali: "KALICONT000027343053",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343053",
      },
    },
  },
  "3109": {
    libelle: "Industries alimentaires diverses",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027040696",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027040696",
          titre: "Convention collective nationale des 5 branches industries alimentaires diverses du 21 mars 2012 ",
          soustitre: "Industries alimentaires diverses",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des 5 branches industries alimentaires diverses",
        id_kali: "KALICONT000027040696",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-03-21 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027040696",
      },
    },
  },
  "3123": {
    libelle: "Entreprises d'ambulances Ouvriers, employés et techniciens (Guyane)",
    nature: "CONVENTION COLLECTIVE RÉGIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343232",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343232",
          titre:
            "Convention collective régionale des ouvriers, employés et techniciens des entreprises d'ambulances (Guyane) du 24 avril 2012 ",
          soustitre: "Entreprises d'ambulances Ouvriers, employés et techniciens (Guyane)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective régionale des ambulances Guyane",
        id_kali: "KALICONT000027343232",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE RÉGIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2015-06-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027343232",
      },
    },
  },
  "3127": {
    libelle: "Entreprises de services à la personne",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027084096",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027084096",
          titre: "Convention collective nationale des entreprises de services à la personne du 20 septembre 2012",
          soustitre: "Entreprises de services à la personne",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des services à la personne du 20 septembre 2012",
        id_kali: "KALICONT000027084096",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2014-11-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027084096",
      },
    },
  },
  "3128": {
    libelle:
      "Convention collective régionale des employés, techniciens et agents de maîtrise du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des employés, techniciens et agents de maîtrise du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3144": {
    libelle: "Bâtiment et travaux publics ETAM (Guadeloupe)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027334050",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027334050",
          titre:
            "Convention collective des employés, techniciens et agents de maîtrise du bâtiment et travaux publics (Guadeloupe) du 24 juillet 2008",
          soustitre: "Bâtiment et travaux publics ETAM (Guadeloupe)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAM du bâtiment et des travaux publics de la Guadeloupe",
        id_kali: "KALICONT000027334050",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2014-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027334050",
      },
    },
  },
  "3151": {
    libelle: "Industries de la fabrication de la chaux",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027556857",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027556857",
          titre: "Convention collective nationale des industries de la fabrication de la chaux du 4 décembre 2012",
          soustitre: "Industries de la fabrication de la chaux",
        },
      ],
    },
  },
  "3160": {
    libelle: "Associations de gestion et de comptabilité",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027939865",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027939865",
          titre: "Convention collective nationale des associations de gestion et de comptabilité du 8 janvier 2013.\n",
          soustitre: "Associations de gestion et de comptabilité",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des associations de gestion et de comptabilité (annexée à la convention collective nationale du personnel des cabinets d'experts-comptables et de commissaires aux comptes 0787)",
        id_kali: "KALICONT000027939865",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2013-03-26 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027939865",
      },
    },
  },
  "3168": {
    libelle: "Professions de la photographie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027961162",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027961162",
          titre: "Convention collective nationale des professions de la photographie du 13 février 2013",
          soustitre: "Professions de la photographie",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des professions de la photographie",
        id_kali: "KALICONT000027961162",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-02-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027961162",
      },
    },
  },
  "3201": {
    libelle: "Éditeurs de la presse magazine Cadres (28 novembre 2013)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028837824",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028837824",
          titre:
            "Convention collective nationale des éditeurs de la presse magazine (cadres) du 28 novembre 2013.\nRemplacée par la convention collective nationale des éditeurs de la presse magazine (employés et cadres) du 30 octobre 2017 (IDCC 3225)",
          soustitre: "Éditeurs de la presse magazine Cadres (28 novembre 2013)",
        },
      ],
    },
  },
  "3202": {
    libelle: "Éditeurs de la presse magazine Employés (28 novembre 2013)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028837830",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000028837830",
          titre:
            "Convention collective nationale des éditeurs de la presse magazine (employés) du 28 novembre 2013.\nRemplacée par la convention collective nationale des éditeurs de la presse magazine (employés et cadres) du 30 octobre 2017 (IDCC 3225)\n",
          soustitre: "Éditeurs de la presse magazine Employés (28 novembre 2013)",
        },
      ],
    },
  },
  "3203": {
    libelle: "Pêche de loisir et protection du milieu aquatique : structures associatives",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029100418",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029100418",
          titre:
            "Convention collective nationale des structures associatives de pêche de loisir et de protection du milieu aquatique du 22 juin 2013",
          soustitre: "Pêche de loisir et protection du milieu aquatique : structures associatives",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des structures associatives de pêche de loisir et de protection du milieu aquatique",
        id_kali: "KALICONT000029100418",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2013-06-22 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000029100418",
      },
    },
  },
  "3204": {
    libelle:
      "Convention collective régionale des ingénieurs et cadres du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des ingénieurs et cadres du bâtiment, des travaux publics et des industries et activités connexes de la Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3205": {
    libelle: "Coopératives de consommateurs",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030185307",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030185307",
          titre:
            "Convention collective nationale des coopératives de consommateurs salariés du 23 novembre 2018 (21e édition) - Etendue par arrêté du 21 mai 2021 JORF 12 juin 2021",
          soustitre: "Coopératives de consommateurs",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030185307",
          titre:
            "Convention collective des coopératives de consommateurs du 16 octobre 2014 (20e édition) et additifs ",
          soustitre: "Coopératives de consommateurs",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des coopératives de consommation",
        id_kali: "KALICONT000030185307",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2019-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000030185307",
      },
    },
  },
  "3206": {
    libelle: "Convention collective départementale du personnel des cabinets médicaux de Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale du personnel des cabinets médicaux de Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3207": {
    libelle: "Convention collective régionale des transports sanitaires de Guadeloupe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des transports sanitaires de Guadeloupe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3209": {
    libelle:
      "Convention collective départementale des industries mécaniques, microtechniques et connexes du département du Doubs ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des industries mécaniques, microtechniques et connexes du département du Doubs ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3210": {
    libelle: "Banque populaire",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000031197865",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000031197865",
          titre:
            "Convention collective Banque populaire du 15 juin 2015 - Etendue par arrêté du 17 sept. 2021 JORF 28 sept. 2021",
          soustitre: "Banque populaire",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la banque populaire",
        id_kali: "KALICONT000031197865",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2015-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000031197865",
      },
    },
  },
  "3211": {
    libelle: "Etablissements privés",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000031822323",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "REMPLACE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000031822323",
          titre: "Convention collective des salariés des établissements privés du 7 juillet 2015",
          soustitre: "Etablissements privés",
        },
      ],
    },
  },
  "3212": {
    libelle: "Travaux publics (Tome IV : Cadres)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032437525",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032437525",
          titre:
            "Convention collective nationale des cadres des travaux publics du 20 novembre 2015 - Étendue par arrêté du 5 juin 2020 (JORF du 26 juin 2020)",
          soustitre: "Travaux publics (Tome IV : Cadres)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des cadres des travaux publics",
        id_kali: "KALICONT000032437525",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2016-01-23 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032437525",
      },
    },
  },
  "3213": {
    libelle: "Collaborateurs salariés des entreprises d'économistes de la construction et des métreurs-vérificateurs",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032494008",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032494008",
          titre:
            "Convention collective nationale des collaborateurs salariés des entreprises d'économistes de la construction et des métreurs-vérificateurs du 16 décembre 2015",
          soustitre:
            "Collaborateurs salariés des entreprises d'économistes de la construction et des métreurs-vérificateurs",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des collaborateurs salariés des entreprises d'économistes de la construction et des métreurs-vérificateurs",
        id_kali: "KALICONT000032494008",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2016-04-04 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032494008",
      },
    },
  },
  "3216": {
    libelle: "Matériaux de construction (négoce)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000034335661",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000034335661",
          titre:
            "Convention collective nationale des salariés du négoce des matériaux de construction du 8 décembre 2015.\n",
          soustitre: "Matériaux de construction (négoce)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des salariés du négoce des matériaux de construction",
        id_kali: "KALICONT000034335661",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-04-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000034335661",
      },
    },
  },
  "3217": {
    libelle: "Branche ferroviaire",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000033373201",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000033373201",
          titre:
            "Convention collective nationale de la branche ferroviaire du 31 mai 2016 (CONTRAT DE TRAVAIL ET ORGANISATION DU TRAVAIL) (Accord du 31 mai 2016) ",
          soustitre: "Branche ferroviaire",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale ferroviaire ",
        id_kali: "KALICONT000033373201",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-01-05 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000033373201",
      },
    },
  },
  "3218": {
    libelle: "Enseignement privé non lucratif (EPNL)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043874879",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043874879",
          titre:
            "Convention collective nationale de l'enseignement privé non lucratif du 13 octobre 2020 (Avenant n° 2020-03 du 13 octobre 2020 révisé par avenant n° 2022-2 du 11 avril 2022)",
          soustitre: "Enseignement privé non lucratif (EPNL)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l'enseignement privé non lucratif (EPNL)",
        id_kali: "KALICONT000043874879",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2021-02-02 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043874879",
      },
    },
  },
  "3219": {
    libelle: "Branche des salariés en portage salarial",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035326397",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035326397",
          titre: "Convention collective de branche des salariés en portage salarial du 22 mars 2017",
          soustitre: "Branche des salariés en portage salarial",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de branche des salariés en portage salarial",
        id_kali: "KALICONT000035326397",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035326397",
      },
    },
  },
  "3220": {
    libelle: "Personnel des offices publics de l'habitat",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036872099",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036872099",
          titre:
            "Convention collective nationale du personnel des offices publics de l'habitat et des sociétés de coordination du 6 avril 2017.\n",
          soustitre: "Personnel des offices publics de l'habitat",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des offices publics de l'habitat",
        id_kali: "KALICONT000036872099",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-04-27 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036872099",
      },
    },
  },
  "3221": {
    libelle: "Agences de presse (employés, techniciens et cadres)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035385554",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035385554",
          titre:
            "Convention collective nationale des employés, techniciens et cadres des agences de presse du 7 avril 2017",
          soustitre: "Agences de presse (employés, techniciens et cadres)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des agences de presse ",
        id_kali: "KALICONT000035385554",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035385554",
      },
    },
  },
  "3222": {
    libelle: "Menuiseries, charpentes et constructions industrialisées et portes planes",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000024977855",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000024977855",
          titre:
            "Annexe - Accord du 15 juin 2011 relatif à la commission paritaire de validation des accords collectifs",
          soustitre: "Menuiseries, charpentes et constructions industrialisées et portes planes",
        },
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000038736933",
          titre:
            "Annexe - Accord national du 27 octobre 1995 portant création d'une commission paritaire nationale de l'emploi",
          soustitre: "Menuiseries, charpentes et constructions industrialisées et portes planes",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des menuiseries charpentes et constructions industrialisées et des portes planes",
        id_kali: "KALICONT000038723112",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2019-08-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038723112",
      },
    },
  },
  "3223": {
    libelle: "Entreprises de transport et services maritimes (personnels navigants officiers)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035564539",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035564539",
          titre:
            "Convention collective des personnels navigants officiers des entreprises de transport et services maritimes du 19 novembre 2012",
          soustitre: "Entreprises de transport et services maritimes (personnels navigants officiers)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des officiers des entreprises de transport et services maritimes",
        id_kali: "KALICONT000035564539",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2014-12-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000035564539",
      },
    },
  },
  "3224": {
    libelle: "Distribution et commerce de gros des papiers-cartons",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036605374",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036605374",
          titre:
            "Convention collective nationale de la distribution et du commerce de gros des papiers-cartons du 12 juillet 2017  - Étendue par arrêté du 17 février 2020 JORF 25 février 2020 ",
          soustitre: "Distribution et commerce de gros des papiers-cartons",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la distribution des papiers-cartons ; commerce de gros",
        id_kali: "KALICONT000036605374",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036605374",
      },
    },
  },
  "3225": {
    libelle: "Éditeurs de la presse magazine Employés et cadres (30 octobre 2017)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036572933",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036572933",
          titre:
            "Convention collective nationale des éditeurs de la presse magazine (employés et cadres) du 30 octobre 2017 - Etendue par arrêté du 30 octobre 2019 JORF 5 novembre 2019.\n",
          soustitre: "Éditeurs de la presse magazine Employés et cadres (30 octobre 2017)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des employés et des cadres des éditeurs de la presse magazine",
        id_kali: "KALICONT000036572933",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-10-30 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000036572933",
      },
    },
  },
  "3227": {
    libelle: "Industries de la fabrication de la chaux",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037263473",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037263473",
          titre: "Convention collective nationale des industries de la fabrication de la chaux du 16 janvier 2018",
          soustitre: "Industries de la fabrication de la chaux",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des industries de la fabrication de la chaux",
        id_kali: "KALICONT000037263473",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-03-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037263473",
      },
    },
  },
  "3228": {
    libelle: "Groupement des armateurs de services de passages d'eau (personnel navigant)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037974872",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037974872",
          titre:
            "Convention collective nationale du personnel navigant du groupement des armateurs de services de passages d'eau du 23 mai 2018. Etendue par arrêté du 2 mars 2021 JORF 9 mars 2021",
          soustitre: "Groupement des armateurs de services de passages d'eau (personnel navigant)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du groupement des armateurs de service de passages d'eau - personnel navigant",
        id_kali: "KALICONT000037974872",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2018-05-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000037974872",
      },
    },
  },
  "3229": {
    libelle: "Navigation intérieure",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043006530",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043006530",
          titre:
            "Convention collective nationale du personnel des entreprises de transport en navigation intérieure du 20 décembre 2018 - Etendue par arrêté du 18 décembre 2020 JORF 24 décembre 2020",
          soustitre: "Navigation intérieure",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale du personnel sédentaire des entreprises de transports de marchandises de la navigation intérieure",
        id_kali: "KALICONT000043006530",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2020-12-25 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043006530",
      },
    },
  },
  "3230": {
    libelle: "Presse d'information spécialisée (employés, techniciens, agents de maîtrise et cadres)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038661444",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038661444",
          titre:
            "Convention collective nationale des employés, techniciens, agents de maîtrise et cadres de la presse d'information spécialisée du 27 décembre 2018.\n",
          soustitre: "Presse d'information spécialisée (employés, techniciens, agents de maîtrise et cadres)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la presse d'information spécialisée ",
        id_kali: "KALICONT000038661444",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2019-02-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038661444",
      },
    },
  },
  "3231": {
    libelle:
      "Convention collective départementale des industries métallurgiques, mécaniques, similaires et connexes du Jura",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective départementale des industries métallurgiques, mécaniques, similaires et connexes du Jura",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3232": {
    libelle: "Organismes du régime général de sécurité sociale agents de direction (18 septembre 2018)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000039800704",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000039800704",
          titre:
            "Convention collective nationale des agents de direction des organismes du régime général de sécurité sociale du 18 septembre 2018",
          soustitre: "Organismes du régime général de sécurité sociale agents de direction (18 septembre 2018)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de travail des agents de direction des organismes du régime général de sécurité sociale",
        id_kali: "KALICONT000039800704",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2018-09-18 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000039800704",
      },
    },
  },
  "3233": {
    libelle: "Ciment : industrie de la fabrication des ciments",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043996969",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043996969",
          titre:
            "Convention collective nationale de l'industrie de la fabrication des ciments du 2 octobre 2019 - Etendue par arrêté du 30 juillet 2021 JORF 17 août 2021, modifié par arrêté du 17 sept. 2021 JORF 28 sept. 2021",
          soustitre: "Ciment : industrie de la fabrication des ciments",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la branche de l'industrie de la fabrication des ciments",
        id_kali: "KALICONT000043996969",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-09-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043996969",
      },
    },
  },
  "3235": {
    libelle: "Convention collective de la parfumerie sélective ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective de la parfumerie sélective ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3236": {
    libelle: "Industrie et services nautiques",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043157451",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043157451",
          titre: "Convention collective nationale de l'industrie et des services nautiques du 13 octobre 2020",
          soustitre: "Industrie et services nautiques",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de l’industrie et des services nautiques ",
        id_kali: "KALICONT000043157451",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2020-11-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043157451",
      },
    },
  },
  "3237": {
    libelle: "Commerce de détail alimentaire spécialisé",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044617302",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044617302",
          titre:
            "Convention collective nationale des métiers du commerce de détail alimentaire spécialisé du 12 janvier 2021 - Etendue par arrêté du 17 septembre 2021 JORF 23 décembre 2021",
          soustitre: "Commerce de détail alimentaire spécialisé",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des métiers du commerce de détail alimentaire spécialisé",
        id_kali: "KALICONT000044617302",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044617302",
      },
    },
  },
  "3238": {
    libelle: "Production et transformation des papiers et cartons",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000045699459",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000045699459",
          titre:
            "Convention collective nationale de la production et de la transformation des papiers et cartons du 29 janvier 2021",
          soustitre: "Production et transformation des papiers et cartons",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale de la production et de la transformation des papiers et cartons du 29 janvier 2021",
        id_kali: "KALICONT000045699459",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000045699459",
      },
    },
  },
  "3239": {
    libelle: "Particuliers employeurs et emploi à domicile",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044594539",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044594539",
          titre:
            "Convention collective nationale des particuliers employeurs et de l'emploi à domicile du 15 mars 2021 - Étendue par arrêté du 6 octobre 2021 JORF 16 octobre 2021",
          soustitre: "Particuliers employeurs et emploi à domicile",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective de la branche du secteur des particuliers employeurs et de l'emploi à domicile résultant de la convergence des branches des assistants maternels et des salariés du particulier employeur",
        id_kali: "KALICONT000044594539",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044594539",
      },
    },
  },
  "3241": {
    libelle: "Télédiffusion",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044261829",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044261829",
          titre: "Convention collective nationale de la télédiffusion du 2 juillet 2021 ",
          soustitre: "Télédiffusion",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la Télédiffusion",
        id_kali: "KALICONT000044261829",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044261829",
      },
    },
  },
  "3242": {
    libelle: "Presse quotidienne et hebdomadaire en régions",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044349436",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044349436",
          titre: "Convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021",
          soustitre: "Presse quotidienne et hebdomadaire en régions",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la presse quotidienne et hebdomadaire en régions",
        id_kali: "KALICONT000044349436",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2022-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000044349436",
      },
    },
  },
  "3243": {
    libelle: "Quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison (commerces)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000047839180",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000047839180",
          titre:
            "Convention collective nationale des commerces de quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison du 24 novembre 2021 - Etendue par arrêté du 5 juillet 2023 JORF 13 juillet 2023",
          soustitre: "Quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison (commerces)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des commerces de quincaillerie, fournitures industrielles, fers, métaux et équipement de la maison ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3244": {
    libelle: "Professions réglementées auprès des juridictions",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000048202801",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000048202801",
          titre:
            "Convention collective nationale des professions réglementées auprès des juridictions du 26 janvier 2022",
          soustitre: "Professions réglementées auprès des juridictions",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des professions réglementées auprès des juridictions",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3245": {
    libelle: "Opérateurs de voyages et guides",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046139444",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046139444",
          titre: "Convention collective nationale des opérateurs de voyages et des guides du 19 avril 2022",
          soustitre: "Opérateurs de voyages et guides",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des opérateurs de voyages et des guides",
        id_kali: "KALICONT000046139444",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_NON_ETEN",
        debut: "2022-05-13 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046139444",
      },
    },
  },
  "3248": {
    libelle: "Métallurgie",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046993250",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046993250",
          titre:
            "Convention collective nationale de la métallurgie du 7 février 2022 - Étendue par arrêté du 14 décembre 2022 JORF 22 décembre 2022",
          soustitre: "Métallurgie",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la métallurgie",
        id_kali: "KALICONT000046993250",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2024-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046993250",
      },
    },
  },
  "3250": {
    libelle: "Commissaires de justice et sociétés de ventes volontaires",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000047802239",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000047802239",
          titre:
            "Convention collective nationale des commissaires de justice et sociétés de ventes volontaires du 16 novembre 2022",
          soustitre: "Commissaires de justice et sociétés de ventes volontaires",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des commissaires de justice et sociétés de ventes volontaires",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "3251": {
    libelle: "Bijouterie, joaillerie, orfèvrerie, horlogerie (BJOH)",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000048984729",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_NON_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000048984729",
          titre:
            "Convention collective nationale de la bijouterie, joaillerie, orfèvrerie, horlogerie (BJOH) du 3 octobre 2023",
          soustitre: "Bijouterie, joaillerie, orfèvrerie, horlogerie (BJOH)",
        },
      ],
    },
  },
  "5001": {
    libelle: "Statut des industries électriques et gazières",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des industries électriques et gazières",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5002": {
    libelle: "Statut du Mineur",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut du Mineur",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5003": {
    libelle: "Statut de la Fonction publique d'État",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de la Fonction publique d'État",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5005": {
    libelle: "Statut des Caisses d'épargne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des Caisses d'épargne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5008": {
    libelle: "Statut de la Banque de France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de la Banque de France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5010": {
    libelle: "Statut des Chambres des métiers & de l'artisanat",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des Chambres des métiers & de l'artisanat",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5011": {
    libelle: "Statut de l'Aéroport de Paris",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de l'Aéroport de Paris",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5012": {
    libelle: "Statut des chemins de fer",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des chemins de fer",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5014": {
    libelle: "Statut de la RATP",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de la RATP",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5015": {
    libelle: "Statut du CNRS",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut du CNRS",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5017": {
    libelle: "Statut de l'Église ou convention diocésaine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de l'Église ou convention diocésaine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5018": {
    libelle: "Statut des Chambres de commerce et d'industrie ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des Chambres de commerce et d'industrie ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5019": {
    libelle: "Statut des Chambres d'agriculture",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des Chambres d'agriculture",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5021": {
    libelle: "Statut de la Fonction publique territoriale",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de la Fonction publique territoriale",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5022": {
    libelle: "Statut de la Fonction publique hospitalière",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut de la Fonction publique hospitalière",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5023": {
    libelle: "Statut Vivea",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut Vivea",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5024": {
    libelle: "Statut des chefs d'établissement de l'enseignement catholique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des chefs d'établissement de l'enseignement catholique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5025": {
    libelle: "Statut des personnels des organismes de développement économique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut des personnels des organismes de développement économique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5100": {
    libelle: "Statut divers ou non précisé",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut divers ou non précisé",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5200": {
    libelle: "Grille d'usage Mars PF (Non conventionnelle)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Grille d'usage Mars PF (Non conventionnelle)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5201": {
    libelle: "Recommandations ANIL ADIL (Non conventionnelles)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Recommandations ANIL ADIL (Non conventionnelles)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5203": {
    libelle:
      "Ancienne convention collective nationale des peintres en lettres et publicité peinte (dénoncée, mais pouvant servir de grille d'usage d'établissements réputés sans convention)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Ancienne convention collective nationale des peintres en lettres et publicité peinte (dénoncée, mais pouvant servir de grille d'usage d'établissements réputés sans convention)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5204": {
    libelle: "Grille d'usage MSF logistique (Non conventionnelle)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Grille d'usage MSF logistique (Non conventionnelle)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5205": {
    libelle: "Convention d'entreprise CSE Air France exploitation hub",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise CSE Air France exploitation hub",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5501": {
    libelle: "Convention d'entreprise indépendante ou texte assimilé non précisé",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise indépendante ou texte assimilé non précisé",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5502": {
    libelle: "Convention d'entreprise Croix Rouge",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Croix Rouge",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5503": {
    libelle: "Convention d'entreprise SEITA (LOGISTA France)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise SEITA (LOGISTA France)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5505": {
    libelle: "Convention d'entreprise CEA",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise CEA",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5506": {
    libelle: "Convention d'entreprise Crédit agricole SA",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Crédit agricole SA",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5507": {
    libelle:
      "Convention collective nationale des administratifs du football (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des administratifs du football (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5509": {
    libelle: "Convention d'entreprise PMU",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise PMU",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5513": {
    libelle: "Convention d'entreprise IFREMER",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise IFREMER",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5514": {
    libelle: "Convention d'entreprise Crédit Foncier",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Crédit Foncier",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5516": {
    libelle: "Convention d'entreprise La Poste - France Télécom",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise La Poste - France Télécom",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5519": {
    libelle:
      "Convention collective nationale des salariés administratifs des sociétés de secours minières  (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des salariés administratifs des sociétés de secours minières  (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5521": {
    libelle: "Convention collective nationale du personnel navigant d'exécution du transport maritime",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel navigant d'exécution du transport maritime",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5522": {
    libelle: "Convention d'entreprise Établissement français du sang",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Établissement français du sang",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5524": {
    libelle: "Convention d'entreprise France terre d'asile",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise France terre d'asile",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5526": {
    libelle:
      "Charte du football professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Charte du football professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5530": {
    libelle: "Convention d'entreprise Adoma (ex Sonacotra)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Adoma (ex Sonacotra)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5531": {
    libelle: "Convention d'entreprise Syngenta ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Syngenta ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5532": {
    libelle: "Convention d'entreprise INRS",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise INRS",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5533": {
    libelle: "Convention du comité d'entreprise SNCF",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention du comité d'entreprise SNCF",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5537": {
    libelle:
      "Convention collective nationale des dentistes des sociétés de secours minières (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des dentistes des sociétés de secours minières (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5538": {
    libelle:
      "Convention collective nationale des médecins spécialiste des sociétés de secours minières (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des médecins spécialiste des sociétés de secours minières (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5539": {
    libelle: "Convention d'entreprise AFPA",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise AFPA",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5541": {
    libelle:
      "Convention collective nationale du rugby professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale du rugby professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5542": {
    libelle:
      "Convention collective nationale du  basket ball professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale du  basket ball professionnel (n'est pas considérée à l'heure actuelle comme une convention de branche)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5545": {
    libelle: "Convention d'entreprise des restaurants PTT",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise des restaurants PTT",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5546": {
    libelle: "Convention d'entreprise CNES",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise CNES",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5547": {
    libelle: "Convention d'entreprise Club Méditerranée",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Club Méditerranée",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5548": {
    libelle: "Convention du comité d'entreprise RATP",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention du comité d'entreprise RATP",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5549": {
    libelle: "Convention d'entreprise IRSN",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise IRSN",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5551": {
    libelle: "Convention d'entreprise Institut Pasteur",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Institut Pasteur",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5552": {
    libelle: "Convention d'entreprise Société d'agences et de diffusion",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Société d'agences et de diffusion",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5553": {
    libelle: "Convention d'entreprise CCAS",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise CCAS",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5554": {
    libelle: "Convention collective nationale des officiers du Remorquage maritime ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des officiers du Remorquage maritime ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5555": {
    libelle: "Convention collective nationale des navigants d'exécution du Remorquage maritime ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des navigants d'exécution du Remorquage maritime ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5558": {
    libelle:
      "Accords-convention d'entreprise basés sur l'Accord national Multiservice immobilier et facilties management",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Accords-convention d'entreprise basés sur l'Accord national Multiservice immobilier et facilties management",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5559": {
    libelle: "Convention d'entreprise Alliance emploi",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Alliance emploi",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5562": {
    libelle: "Convention d'entreprise Talc de Luzenac",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Talc de Luzenac",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5563": {
    libelle: "Convention d'entreprise Réunion des musées nationaux",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Réunion des musées nationaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5564": {
    libelle: "Convention d'entreprise APEC",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise APEC",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5566": {
    libelle: "Convention d'entreprise Société Protectrice des Animaux",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Société Protectrice des Animaux",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5568": {
    libelle: "Convention d'entreprise CIRAD",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise CIRAD",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5569": {
    libelle: "Convention d'entreprise Comédie française",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Comédie française",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5570": {
    libelle: "Convention d'entreprise Opéra de Paris",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Opéra de Paris",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5571": {
    libelle: "Convention d'entreprise Fondation d'Auteuil",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Fondation d'Auteuil",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5572": {
    libelle: "Convention d'entreprise Kiloutou",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Kiloutou",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5573": {
    libelle: "Convention d'entreprise UGAP",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise UGAP",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5576": {
    libelle: "Convention du groupe AGEFOS PME",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention du groupe AGEFOS PME",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5577": {
    libelle: "Convention d'entreprise Agence Française de Développement",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Agence Française de Développement",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5578": {
    libelle: "Convention d'entreprise Agence Nationale pour les Chèques Vacances",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Agence Nationale pour les Chèques Vacances",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5580": {
    libelle: "Convention d'entreprise Radio France ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Radio France ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5583": {
    libelle: "Convention d'entreprise Voies navigables de France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Voies navigables de France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5584": {
    libelle: "Accords-convention d'entreprise Laboratoire national de métrologie et d’essais",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Laboratoire national de métrologie et d’essais",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5585": {
    libelle: "Accords-convention d'entreprise Pioneer",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Pioneer",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5586": {
    libelle: "Accords-convention d'entreprise SACEM",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise SACEM",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5587": {
    libelle: "Accords-convention d'entreprise Cité de la musique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Cité de la musique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5588": {
    libelle: "Accords-convention d'entreprise SACD",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise SACD",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5589": {
    libelle: "Convention d'entreprise ARPEJ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise ARPEJ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5590": {
    libelle: "Convention d'entreprise OPCALIM",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise OPCALIM",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5591": {
    libelle: "Convention d'entreprise Louis Vuitton services",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Louis Vuitton services",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5592": {
    libelle: "Convention d'entreprise UES CAMIF",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise UES CAMIF",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5593": {
    libelle: "Accord de référence FNAB",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accord de référence FNAB",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5594": {
    libelle: "Convention d'entreprise Ortec Services",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Ortec Services",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5595": {
    libelle: "Convention d'entreprise Sede environnement",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Sede environnement",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5596": {
    libelle: "Convention d'entreprise Compagnie des Alpes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Compagnie des Alpes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5598": {
    libelle: "Convention d'entreprise Eurotunnel",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Eurotunnel",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5599": {
    libelle: "Convention d'entreprise Havas",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Havas",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5600": {
    libelle: "Accords-convention d'entreprise CGG Services",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise CGG Services",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5601": {
    libelle: "Accords-convention d'entreprise COSEM",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise COSEM",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5602": {
    libelle: "Accords-convention d'entreprise Bureau de recherche géologiques et minières ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Bureau de recherche géologiques et minières ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5603": {
    libelle: "Accords-convention d'entreprise Synchrotron Soleil",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Synchrotron Soleil",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5604": {
    libelle: "Accords-convention d'entreprise Accor",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Accor",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5605": {
    libelle: "Convention d'entreprise Blondel aérologistique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Blondel aérologistique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5606": {
    libelle: "Convention d'entreprise ANFH",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise ANFH",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5607": {
    libelle: "Convention d'entreprise Danone",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Danone",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5608": {
    libelle: "Convention d'entreprise Arvalis institut du végétal",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Arvalis institut du végétal",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5610": {
    libelle: "Convention d'entreprise Cinémathèque française",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Cinémathèque française",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5611": {
    libelle: "Accords-convention d'entreprise ADIE",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise ADIE",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5614": {
    libelle: "Convention d'entreprise Institut de l'élevage",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Institut de l'élevage",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5615": {
    libelle: "Convention d'entreprise Forum des images",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Forum des images",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5616": {
    libelle: "Accords-convention d'entreprise CTC",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise CTC",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5617": {
    libelle: "Accords-convention d'entreprise Sodexo Justice Services",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Sodexo Justice Services",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5618": {
    libelle: "Accords-convention d'entreprise ADEF",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise ADEF",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5619": {
    libelle: "Convention collective nationale provisoire de la pêche professionnelle maritime",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale provisoire de la pêche professionnelle maritime",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5620": {
    libelle: "Convention d'entreprise Messageries lyonnaises de presse",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Messageries lyonnaises de presse",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5621": {
    libelle: "Convention d'entreprise Fondation Jean Moulin",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Fondation Jean Moulin",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5622": {
    libelle: "Accords-convention d'entreprise CCFD Terre Solidaire ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise CCFD Terre Solidaire ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5623": {
    libelle: "Convention d'entreprise du groupement national interprofessionnel des semences graines et plants",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise du groupement national interprofessionnel des semences graines et plants",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5624": {
    libelle: "Accords-convention d'entreprise Secours catholique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Secours catholique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5625": {
    libelle: "Convention d'entreprise Médecins du monde",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise Médecins du monde",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5627": {
    libelle: "Convention d'entreprise du Groupe Technique des Hippodromes Parisiens",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise du Groupe Technique des Hippodromes Parisiens",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5628": {
    libelle: "Statut-convention d'entreprise d'ACPPA",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Statut-convention d'entreprise d'ACPPA",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5629": {
    libelle: "Convention d'entreprise d'Unifomation",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise d'Unifomation",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5630": {
    libelle: "Accords-convention d'entreprise France active",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise France active",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5631": {
    libelle: "Convention d'entreprise UNAF",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention d'entreprise UNAF",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5632": {
    libelle: "Accords-convention d'entreprise Sodiparc",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords-convention d'entreprise Sodiparc",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5633": {
    libelle: "Accords CFA-BTP (numéro provisoire)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords CFA-BTP (numéro provisoire)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "5634": {
    libelle: "Accords collaborateurs parlementaires de députés (numéro provisoire)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Accords collaborateurs parlementaires de députés (numéro provisoire)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7001": {
    libelle: "Coopératives et sociétés d'intérêt collectif agricole bétail et viande",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635520",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635520",
          titre:
            "Convention collective nationale des coopératives et SICA bétail et viande (Avenant n° 133 du 6 avril 2016 étendu par arrêté du 7 février 2017 JORF 17 février 2017)",
          soustitre: "Coopératives et sociétés d'intérêt collectif agricole bétail et viande",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635520",
          titre:
            "Convention collective nationale concernant les coopératives et sociétés d'intérêt collectif agricole bétail et viande du 21 mai 1969.  Etendue par arrêté du 7 janvier 1972 JORF 8 février 1972.",
          soustitre: "Coopératives et sociétés d'intérêt collectif agricole bétail et viande",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives et SICA de production, transformation et vente du bétail et des viandes",
        id_kali: "KALICONT000005635520",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2016-08-05 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635520",
      },
    },
  },
  "7002": {
    libelle:
      "Coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636018",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636018",
          titre:
            "Convention collective des coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux (mise à jour par avenant n° 122 du 14 novembre 2013)",
          soustitre:
            "Coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636018",
          titre:
            "Convention collective nationale de travail concernant les coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux du 5 mai 1965.",
          soustitre:
            "Coopératives agricoles de céréales, de meunerie, d'approvisionnement, d'alimentation du bétail et d'oléagineux",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives et SICA de céréales, de meunerie, d'approvisionnement et d'alimentation du bétail et d'oléagineux",
        id_kali: "KALICONT000005636018",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2013-11-14 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636018",
      },
    },
  },
  "7003": {
    libelle: "Conserveries coopératives et SICA",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635504",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635504",
          titre:
            "Convention collective nationale des conserveries coopératives et SICA (Avenant n° 116 du 13 juillet 2011)",
          soustitre: "Conserveries coopératives et SICA",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635504",
          titre:
            "Convention collective nationale concernant les conserveries coopératives et les sociétés d'intérêt collectif agricole du 10 mars 1970.  Etendue par arrêté du 17 novembre 1971 JONC 7 janvier 1972 et rectificatif au JONC du 14 novembre 1972.",
          soustitre: "Conserveries coopératives et SICA",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives agricoles, union de coopératives agricoles et SICA fabriquant des conserves de fruits et de légumes, des plats cuisinés et des spécialités",
        id_kali: "KALICONT000005635504",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-06-25 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635504",
      },
    },
  },
  "7004": {
    libelle: "Coopératives agricoles laitières",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635700",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635700",
          titre:
            "Convention collective nationale des coopératives agricoles laitières du 7 juin 1984. Etendue par arrêté du 19 novembre 1984 JONC 30 novembre 1984.",
          soustitre: "Coopératives agricoles laitières",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives laitières, unions de coopératives laitières et SICA laitières",
        id_kali: "KALICONT000005635700",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1984-09-07 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635700",
      },
    },
  },
  "7005": {
    libelle: "Caves coopératives vinicoles et leurs unions",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635282",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635282",
          titre:
            "Convention collective nationale concernant les caves coopératives vinicoles et leurs unions du 22 avril 1986. Etendue par arrêté du 20 août 1986 JORF 30 août 1986.",
          soustitre: "Caves coopératives vinicoles et leurs unions",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des caves coopératives et de leurs unions élargie aux SICA vinicoles",
        id_kali: "KALICONT000005635282",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1986-06-19 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635282",
      },
    },
  },
  "7006": {
    libelle:
      "Coopératives agricoles, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre (Métropole)",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635752",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635752",
          titre:
            "Convention collective nationale de travail concernant les coopératives agricoles, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre du 16 novembre 2011.  Etendue par arrêté du 23 avril 2012 JORF 2 mai 2012 (Avenant n° 80 du 16 novembre 2011).",
          soustitre:
            "Coopératives agricoles, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre (Métropole)",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635752",
          titre:
            "Convention collective nationale de travail concernant les coopératives agricoles, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre du 18 septembre 1985.  Etendue par arrêté du 10 janvier 1986 JORF 23 janvier 1986.",
          soustitre:
            "Coopératives agricoles, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre (Métropole)",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives, unions de coopératives agricoles et SICA de fleurs, de fruits et légumes et de pommes de terre",
        id_kali: "KALICONT000005635752",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "2011-11-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635752",
      },
    },
  },
  "7007": {
    libelle: "Coopératives agricoles de teillage du lin",
    nature: "CONVENTION COLLECTIVE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022238768",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022238768",
          titre: "Convention collective nationale des coopératives agricoles de teillage du lin du 21 mars 1985",
          soustitre: "Coopératives agricoles de teillage du lin",
        },
      ],
      recherche_entreprise: {
        titre:
          "Convention collective nationale des coopératives, unions de coopératives agricoles et SICA de teillage de lin",
        id_kali: "KALICONT000022238768",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE",
        etat: "VIGUEUR_ETEN",
        debut: "1985-05-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000022238768",
      },
    },
  },
  "7008": {
    libelle: "Personnel des organismes de contrôle laitier",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635350",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635350",
          titre:
            "Convention collective nationale concernant le personnel des organismes de contrôle laitier du 16 septembre 2002. Etendue par arrêté du 4 décembre 2002 JORF 28 décembre 2002.",
          soustitre: "Personnel des organismes de contrôle laitier",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des organismes de contrôle laitier",
        id_kali: "KALICONT000005635350",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2002-09-16 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635350",
      },
    },
  },
  "7009": {
    libelle: "Entreprises d'accouvage et de sélection avicoles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635480",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635480",
          titre:
            "Convention collective nationale des entreprises d'accouvage et de sélection du 2 avril 1974.  Etendue par arrêté du 26 juin 1975 JONC 20 août 1975.",
          soustitre: "Entreprises d'accouvage et de sélection avicoles",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises d'accouvage et de sélection de produits avicoles",
        id_kali: "KALICONT000005635480",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "ABROGE",
        debut: "1974-04-02 00:00:00",
        fin: "2022-03-11 00:00:00",
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635480",
      },
    },
  },
  "7010": {
    libelle: "Personnel des élevages aquacoles",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635269",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635269",
          titre:
            "Convention collective nationale des personnels des élevages aquacoles du 22 août 2016. Étendue par arrêté du 13 mars 2017 JORF 21 mars 2017 (avenant n° 8 du 22 août 2016) ",
          soustitre: "Personnel des élevages aquacoles",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635269",
          titre:
            "Convention collective nationale du personnel de la pisciculture et de la salmoniculture.  Etendue par arrêté du 14 janvier 1986 JORF 25 janvier 1986.",
          soustitre: "Personnel des élevages aquacoles",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale du personnel des élévages aquacoles ",
        id_kali: "KALICONT000005635269",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-04-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635269",
      },
    },
  },
  "7011": {
    libelle: "Entreprises paysagistes : personnel d'encadrement",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635270",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "PERIME",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635270",
          titre:
            "Convention collective nationale de travail concernant le personnel d'encadrement des entreprises paysagistes du 6 juin 1988.  Etendue par arrêté du 17 novembre 1988 JORF 25 novembre 1988.",
          soustitre: "Entreprises paysagistes : personnel d'encadrement",
        },
      ],
    },
  },
  "7012": {
    libelle: "Centres équestres",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635936",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635936",
          titre:
            "Convention collective nationale concernant le personnel des centres équestres du 11 juillet 1975. Etendue par arrêté du 14 juin 1976 JONC 8 août 1976.",
          soustitre: "Centres équestres",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des centres équestres",
        id_kali: "KALICONT000005635936",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1975-07-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635936",
      },
    },
  },
  "7013": {
    libelle: "Établissements d'entraînement de chevaux de courses au trot",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635489",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635489",
          titre:
            "Convention collective nationale de travail concernant le personnel occupé dans les établissements d'entraînement de chevaux de courses au trot du 9 janvier 1979.  Etendue par arrêté du 7 mai 1979 JONC 11 mai 1979.",
          soustitre: "Établissements d'entraînement de chevaux de courses au trot",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des établissements d'entraînement des chevaux de courses au trot",
        id_kali: "KALICONT000005635489",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "1979-01-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635489",
      },
    },
  },
  "7014": {
    libelle: "Établissements d'entraînement de chevaux de courses au galop",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635535",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635535",
          titre:
            "Convention collective nationale des établissements d'entraînement de chevaux de courses au galop du 11 janvier 2019 - Étendue par arrêté du 14 novembre 2019 JORF 20 novembre 2019",
          soustitre: "Établissements d'entraînement de chevaux de courses au galop",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635535",
          titre:
            "Convention collective nationale de travail concernant les établissements d'entraînement de chevaux de courses au galop du 20 décembre 1990.  Etendue par arrêté du 25 juin 1991 JORF 18 juillet 1991",
          soustitre: "Établissements d'entraînement de chevaux de courses au galop",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des établissements d'entraînement des chevaux de courses au galop",
        id_kali: "KALICONT000005635535",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2019-01-11 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635535",
      },
    },
  },
  "7015": {
    libelle: "Gardes-chasse et gardes-pêche particuliers",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635699",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635699",
          titre:
            "Convention collective nationale du travail concernant les gardes-chasse et gardes-pêche particuliers du 2 mai 1973. Étendue par arrêté du 24 janvier 1974 JONC 9 février 1974",
          soustitre: "Gardes-chasse et gardes-pêche particuliers",
        },
      ],
    },
  },
  "7016": {
    libelle: "Jardiniers et jardiniers gardiens de propriétés privées",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635718",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "DENONCE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635718",
          titre:
            "Convention collective nationale de travail concernant les jardiniers et jardiniers-gardiens de propriétés privées du 30 janvier 1986.  Etendue par arrêté du 27 mai 1986 JORF 8 juin 1986.",
          soustitre: "Jardiniers et jardiniers gardiens de propriétés privées",
        },
      ],
    },
  },
  "7017": {
    libelle: "Parcs et jardins zoologiques privés ouverts au public",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636001",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636001",
          titre:
            "Convention collective nationale de travail concernant le personnel des parcs et jardins zoologiques privés ouverts au public du 24 janvier 2012 (Avenant du 24 janvier 2012 étendu par arrêté du 29 novembre 2012 JORF 11 décembre 2012)",
          soustitre: "Parcs et jardins zoologiques privés ouverts au public",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636001",
          titre:
            "Convention collective nationale concernant le personnel des parcs et jardins zoologiques privés ouverts au public du 26 mai 2011 (Mise à jour par avenant n° 14 du 26 mai 2011)",
          soustitre: "Parcs et jardins zoologiques privés ouverts au public",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des parcs et jardins zoologiques ouverts au public",
        id_kali: "KALICONT000005636001",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2012-01-24 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005636001",
      },
    },
  },
  "7018": {
    libelle: "Entreprises du paysage",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635325",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635325",
          titre: "Convention collective nationale des entreprises du paysage du 10 octobre 2008",
          soustitre: "Entreprises du paysage",
        },
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635325",
          titre:
            "Convention collective nationale applicable aux salariés non cadres des entreprises du paysage du 23 mars 1999.  Etendue par arrêté du 8 juin 1999 JORF 18 juin 1999.",
          soustitre: "Entreprises du paysage",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises du paysage",
        id_kali: "KALICONT000005635325",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2009-03-25 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635325",
      },
    },
  },
  "7019": {
    libelle: "Conchyliculture",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635374",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635374",
          titre:
            "Convention collective nationale des cultures marines et de la coopération maritime. Etendue par arrêté du 5 juillet 2001 JORF 8 juillet 2001",
          soustitre: "Conchyliculture",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale de la conchyliculture",
        id_kali: "KALICONT000005635374",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2000-10-19 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635374",
      },
    },
  },
  "7020": {
    libelle: "Convention collective nationale du réseau des centres d'économie rurale",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale du réseau des centres d'économie rurale",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7021": {
    libelle: "Sélection et reproduction animale",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019382978",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019382978",
          titre:
            "Convention collective nationale des entreprises relevant de la sélection et de la reproduction animale du 15 avril 2008 ",
          soustitre: "Sélection et reproduction animale",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises relevant de la sélection et de la reproduction animale",
        id_kali: "KALICONT000019382978",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2008-04-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000019382978",
      },
    },
  },
  "7023": {
    libelle: "Entreprises agricoles de déshydratation",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038263817",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038263817",
          titre:
            "Convention collective nationale des entreprises agricoles de déshydratation du 15 novembre 2017. Étendue par arrêté du 25 avril 2018 JORF 3 mai 2018 (Avenant n° 128 du 15 novembre 2017)",
          soustitre: "Entreprises agricoles de déshydratation",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale des entreprises agricoles de déshydratation",
        id_kali: "KALICONT000038263817",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2017-11-15 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000038263817",
      },
    },
  },
  "7024": {
    libelle: "Production agricole et CUMA",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043036630",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043036630",
          titre: "Convention collective nationale de la production agricole et CUMA du 15 septembre 2020 ",
          soustitre: "Production agricole et CUMA",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale PA/CUMA ",
        id_kali: "KALICONT000043036630",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-04-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043036630",
      },
    },
  },
  "7025": {
    libelle: "Entreprises de travaux et services agricoles, ruraux et forestiers (ETARF)",
    nature: "CONVENTION COLLECTIVE NATIONALE",
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043169441",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "VIGUEUR_ETEN",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043169441",
          titre:
            "Convention collective nationale des entreprises de travaux et services agricoles, ruraux et forestiers (ETARF) du 8 octobre 2020",
          soustitre: "Entreprises de travaux et services agricoles, ruraux et forestiers (ETARF)",
        },
      ],
      recherche_entreprise: {
        titre: "Convention collective nationale ETARF",
        id_kali: "KALICONT000043169441",
        cc_ti: "IDCC",
        nature: "CONVENTION COLLECTIVE NATIONALE",
        etat: "VIGUEUR_ETEN",
        debut: "2021-04-01 00:00:00",
        fin: null,
        url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000043169441",
      },
    },
  },
  "7501": {
    libelle: "Convention collective nationale des caisses régionales du crédit agricole",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des caisses régionales du crédit agricole",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7502": {
    libelle: "Convention collective nationale de la Mutualité sociale agricole",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale de la Mutualité sociale agricole",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7503": {
    libelle: "Convention collective nationale des distilleries coopératives viticoles et SICA de distillation",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des distilleries coopératives viticoles et SICA de distillation",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7508": {
    libelle: "Convention collective nationale des Maisons familiales rurales, instituts ruraux et centres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des Maisons familiales rurales, instituts ruraux et centres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7509": {
    libelle: "Convention collective nationale des organismes de formation et de promotion agricoles",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de formation et de promotion agricoles",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7513": {
    libelle:
      "Convention collective nationale des centres d'initiatives pour valoriser l'agriculture et le milieu rural",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective nationale des centres d'initiatives pour valoriser l'agriculture et le milieu rural",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7514": {
    libelle: "Convention collective nationale des organismes de la Confédération paysanne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des organismes de la Confédération paysanne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7515": {
    libelle: "Convention collective nationale des sociétés d'aménagement foncier et d'établissement rural (SAFER)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale des sociétés d'aménagement foncier et d'établissement rural (SAFER)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "7520": {
    libelle: "Convention collective nationale de l'enseignement agricole privé (CNEAP)",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective nationale de l'enseignement agricole privé (CNEAP)",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8112": {
    libelle: "Convention collective régionale de la polyculture Île-de-France non cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de la polyculture Île-de-France non cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8113": {
    libelle: "Convention collective régionale de l'arboriculture maraîchage Île-de-France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'arboriculture maraîchage Île-de-France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8114": {
    libelle: "Convention collective régionale des champignonnières Île-de-France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des champignonnières Île-de-France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8115": {
    libelle: "Convention collective régionale des hippodromes Île-de-France Cabourg Caen Chantilly Deauville",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des hippodromes Île-de-France Cabourg Caen Chantilly Deauville",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8116": {
    libelle: "Convention collective régionale de la polyculture Île-de-France cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de la polyculture Île-de-France cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8117": {
    libelle:
      "Convention collective régionale des exploitations polyculture élev CUMA Seine et Marne ETAR Ile de France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des exploitations polyculture élev CUMA Seine et Marne ETAR Ile de France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8211": {
    libelle: "Convention collective régionale des exploitations forestières Champagne Ardenne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières Champagne Ardenne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8212": {
    libelle: "Convention collective régionale des scieries Champagne Ardenne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des scieries Champagne Ardenne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8214": {
    libelle: "Convention collective régionale des ETAR Aube Marne polyculture Marne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Aube Marne polyculture Marne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8216": {
    libelle: "Convention collective régionale de la viticulture Champagne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de la viticulture Champagne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8221": {
    libelle: "Convention collective régionale des champignonnistes Oise Aisne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des champignonnistes Oise Aisne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8231": {
    libelle: "Convention collective régionale des exploitations forestières Haute Normandie",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières Haute Normandie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8233": {
    libelle: "Convention collective régionale des ETAR Haute Normandie",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Haute Normandie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8234": {
    libelle: "Convention collective régionale de l'horticulture et pépiniéristes Haute Normandie",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'horticulture et pépiniéristes Haute Normandie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8241": {
    libelle: "Convention collective régionale des exploitations forestières scieries Centre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Centre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8243": {
    libelle: "Convention collective régionale des champignonnières Centre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des champignonnières Centre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8244": {
    libelle: "Convention collective régionale maraîchère Indre Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale maraîchère Indre Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8251": {
    libelle: "Convention collective régionale des exploitations forestières scieries Calvados Manche Orne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Calvados Manche Orne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8252": {
    libelle: "Convention collective régionale des travaux agricoles Basse Normandie",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des travaux agricoles Basse Normandie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8262": {
    libelle: "Convention collective régionale des exploitations agricoles Côte d'or Nièvre Yonne ETAR CUMA Côte d'or",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations agricoles Côte d'or Nièvre Yonne ETAR CUMA Côte d'or",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8311": {
    libelle: "Convention collective régionale des exploitations forestières scieries Nord Pas de Calais",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Nord Pas de Calais",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8313": {
    libelle: "Convention collective régionale des ETAR Nord Pas de Calais",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Nord Pas de Calais",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8412": {
    libelle: "Convention collective régionale des scieries agricoles Alsace Lorraine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des scieries agricoles Alsace Lorraine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8414": {
    libelle: "Convention collective régionale maraîchère Meurthe et Moselle Meuse Moselle et Vosges ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale maraîchère Meurthe et Moselle Meuse Moselle et Vosges ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8415": {
    libelle: "Convention collective régionale des exploitations forestières Lorraine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières Lorraine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8416": {
    libelle: "Convention collective régionale de polyculture Lorraine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de polyculture Lorraine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8421": {
    libelle: "Convention collective régionale des exploitations forestières Alsace",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières Alsace",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8422": {
    libelle: "Convention collective régionale de polyculture Alsace",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de polyculture Alsace",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8431": {
    libelle:
      "Convention collective régionale des exploitations forestières Doubs Jura Haute-Saône Territoire de Belfort ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre:
          "Convention collective régionale des exploitations forestières Doubs Jura Haute-Saône Territoire de Belfort ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8432": {
    libelle: "Convention collective régionale des scieries agricoles Franche Comté",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des scieries agricoles Franche Comté",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8433": {
    libelle: "Convention collective régionale de l'horticulture Franche Comté",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'horticulture Franche Comté",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8434": {
    libelle: "Convention collective régionale des cultures CUMA ETAR Franche Comté",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des cultures CUMA ETAR Franche Comté",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8435": {
    libelle: "Convention collective régionale des coopératives fruitières Ain Doubs Jura",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des coopératives fruitières Ain Doubs Jura",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8522": {
    libelle: "Convention collective régionale des exploitations forestières scieries Pays de la Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Pays de la Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8523": {
    libelle: "Convention collective régionale des exploitations sylvicoles Pays de la Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations sylvicoles Pays de la Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8525": {
    libelle: "Convention collective régionale des ETAR Pays de la Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Pays de la Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8526": {
    libelle: "Convention collective régionale de l'arboriculture fruitière Ouest de la France",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'arboriculture fruitière Ouest de la France",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8531": {
    libelle: "Convention collective régionale des exploitations forestières scieries Bretagne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Bretagne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8532": {
    libelle: "Convention collective régionale des ETAR Bretagne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Bretagne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8534": {
    libelle: "Convention collective régionale maraîchère Ille et Vilaine Morbihan",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale maraîchère Ille et Vilaine Morbihan",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8535": {
    libelle: "Convention collective régionale des CUMA Bretagne Pays de la Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des CUMA Bretagne Pays de la Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8541": {
    libelle: "Convention collective régionale des exploitations forestières scieries Poitou Charentes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Poitou Charentes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8542": {
    libelle: "Convention collective régionale des ETAR Vienne Deux Sèvres production agricole Vienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Vienne Deux Sèvres production agricole Vienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8721": {
    libelle: "Convention collective régionale des exploitations forestières scieries Massif Gascogne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Massif Gascogne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8722": {
    libelle: "Convention collective régionale de gemmage forêt Gascogne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de gemmage forêt Gascogne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8723": {
    libelle: "Convention collective régionale de l'entretien forestier Gascogne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'entretien forestier Gascogne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8731": {
    libelle: "Convention collective régionale des exploitations forestières scieries Midi Pyrénées",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Midi Pyrénées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8733": {
    libelle: "Convention collective régionale des CUMA Tarn Haute Garonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des CUMA Tarn Haute Garonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8734": {
    libelle: "Convention collective régionale de l'horticulture Midi Pyrénées",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de l'horticulture Midi Pyrénées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8741": {
    libelle: "Convention collective régionale des exploitations forestières Limousin",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières Limousin",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8821": {
    libelle: "Convention collective régionale des ouvriers forestiers communes ONF Rhône Alpes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ouvriers forestiers communes ONF Rhône Alpes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8822": {
    libelle: "Convention collective régionale des exploitations forestières scieries Rhône Alpes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Rhône Alpes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8825": {
    libelle: "Convention collective régionale de polyculture CUMA Rhône Alpes cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de polyculture CUMA Rhône Alpes cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8826": {
    libelle: "Convention collective régionale des exploitations trav agricoles CUMA Savoie Hte Savoie",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations trav agricoles CUMA Savoie Hte Savoie",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8831": {
    libelle: "Convention collective régionale des exploitations forestières scieries Auvergne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des exploitations forestières scieries Auvergne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8832": {
    libelle: "Convention collective régionale de polyculture CUMA Haute Loire Lozère",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale de polyculture CUMA Haute Loire Lozère",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "8912": {
    libelle: "Convention collective régionale des ETAR Languedoc Roussillon",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective régionale des ETAR Languedoc Roussillon",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9011": {
    libelle: "Convention collective départementale des exploitations agricoles Ain",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Ain",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9021": {
    libelle: "Convention collective départementale des exploitations polyculture Aisne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Aisne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9022": {
    libelle: "Convention collective départementale des exploitations forestières Aisne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Aisne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9032": {
    libelle: "Convention collective départementale des exploitations agricoles Allier",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Allier",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9041": {
    libelle: "Convention collective départementale des exploitations agricoles Alpes de Haute Provence",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Alpes de Haute Provence",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9051": {
    libelle: "Convention collective départementale des exploitations polyculture Hautes Alpes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Hautes Alpes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9061": {
    libelle: "Convention collective départementale des exploitations polyculture Alpes Maritimes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Alpes Maritimes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9062": {
    libelle: "Convention collective départementale des exploitations forestières scieries Alpes Maritimes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières scieries Alpes Maritimes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9071": {
    libelle: "Convention collective départementale des exploitations agricoles Ardèche",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Ardèche",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9081": {
    libelle: "Convention collective départementale des exploitations polyculture Ardennes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Ardennes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9091": {
    libelle: "Convention collective départementale des exploitations agricoles Ariège",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Ariège",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9101": {
    libelle: "Convention collective départementale des exploitations polyculture Aube",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Aube",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9111": {
    libelle: "Convention collective départementale des exploitations agricoles zone céréalière Aude",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles zone céréalière Aude",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9112": {
    libelle: "Convention collective départementale des exploitations agricoles zone viticole Aude",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles zone viticole Aude",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9121": {
    libelle: "Convention collective départementale des exploitations agricoles Aveyron",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Aveyron",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9131": {
    libelle: "Convention collective départementale des exploitations agricoles Bouches du Rhône ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Bouches du Rhône ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9141": {
    libelle: "Convention collective départementale des exploitations polyculture et CUMA Calvados",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture et CUMA Calvados",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9142": {
    libelle: "Convention collective départementale des exploitations horticoles fruits Calvados",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations horticoles fruits Calvados",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9151": {
    libelle: "Convention collective départementale des exploitations polyculture Cantal",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Cantal",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9161": {
    libelle: "Convention collective départementale des exploitations agricoles Charente",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Charente",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9171": {
    libelle: "Convention collective départementale des exploitations polyculture Charente Maritime",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Charente Maritime",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9181": {
    libelle: "Convention collective départementale des exploitations polyculture Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9182": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9191": {
    libelle: "Convention collective départementale des exploitations agricoles Corrèze",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Corrèze",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9201": {
    libelle: "Convention collective départementale des exploitations agricoles Corse du Sud",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Corse du Sud",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9202": {
    libelle: "Convention collective départementale des exploitations agricoles Haute Corse",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Haute Corse",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9211": {
    libelle: "Convention collective départementale des exploitations forestières scieries Côte d'or",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières scieries Côte d'or",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9221": {
    libelle: "Convention collective départementale des exploitations polyculture Côtes d'Armor",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Côtes d'Armor",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9222": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Côtes d'Armor",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Côtes d'Armor",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9231": {
    libelle: "Convention collective départementale des exploitations agricoles Creuse",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Creuse",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9232": {
    libelle: "Convention collective départementale des exploitations pépinières sylvicoles Creuse",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières sylvicoles Creuse",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9241": {
    libelle: "Convention collective départementale des exploitations agricoles Dordogne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Dordogne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9261": {
    libelle: "Convention collective départementale des exploitations agricoles Drôme",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Drôme",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9272": {
    libelle: "Convention collective départementale des exploitations polyculture Eure non cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Eure non cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9273": {
    libelle: "Convention collective départementale des exploitations polyculture Eure cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture Eure cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9281": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage et CUMA Eure et Loir",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage et CUMA Eure et Loir",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9283": {
    libelle: "Convention collective départementale des exploitations horticoles fruitières jardinerie Eure et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations horticoles fruitières jardinerie Eure et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9291": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage et maraîchage Finistère",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage et maraîchage Finistère",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9292": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Finistère",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Finistère",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9301": {
    libelle: "Convention collective départementale des exploitations agricoles Gard",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Gard",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9302": {
    libelle: "Convention collective départementale des exploitations agricoles Gard cadres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Gard cadres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9311": {
    libelle: "Convention collective départementale des exploitations agricoles Haute Garonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Haute Garonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9321": {
    libelle: "Convention collective départementale des exploitations agricoles Gers",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Gers",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9331": {
    libelle: "Convention collective départementale des exploitations agricoles Gironde",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Gironde",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9341": {
    libelle: "Convention collective départementale des exploitations agricoles Hérault",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Hérault",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9351": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage et CUMA Ille et Vilaine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage et CUMA Ille et Vilaine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9352": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Ille et Vilaine",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Ille et Vilaine",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9361": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage et CUMA Indre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage et CUMA Indre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9362": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Indre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Indre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9371": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage viticulture Indre et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage viticulture Indre et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9372": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Indre et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Indre et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9374": {
    libelle: "Convention collective départementale des exploitations arboriculture fruitière Indre et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations arboriculture fruitière Indre et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9383": {
    libelle: "Convention collective départementale des exploitations agricoles CUMA Isère",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles CUMA Isère",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9401": {
    libelle: "Convention collective départementale des exploitations agricoles Landes",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Landes",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9411": {
    libelle: "Convention collective départementale des exploitations agricoles Loir et Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Loir et Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9412": {
    libelle: "Convention collective départementale des ETAR CUMA Loir et Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des ETAR CUMA Loir et Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9413": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Loir et Cher",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Loir et Cher",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9421": {
    libelle: "Convention collective départementale des exploitations agricoles Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9422": {
    libelle: "Convention collective départementale des CUMA Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des CUMA Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9441": {
    libelle: "Convention collective départementale des exploitations agricoles Loire Atlantique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Loire Atlantique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9442": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Loire Atlantique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Loire Atlantique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9444": {
    libelle: "Convention collective départementale des exploitations maraîchères Loire Atlantique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations maraîchères Loire Atlantique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9451": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Loiret",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Loiret",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9452": {
    libelle: "Convention collective départementale des CUMA Loiret",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des CUMA Loiret",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9456": {
    libelle: "Convention collective départementale des exploitations cultures spécialisées Loiret",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations cultures spécialisées Loiret",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9461": {
    libelle: "Convention collective départementale des exploitations agricoles Lot",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Lot",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9471": {
    libelle: "Convention collective départementale des exploitations agricoles Lot et Garonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Lot et Garonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9472": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Lot et Garonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Lot et Garonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9491": {
    libelle: "Convention collective départementale des exploitations polyculture, élevage Maine et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture, élevage Maine et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9492": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Maine et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Maine et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9493": {
    libelle: "Convention collective départementale des champignonnières Maine et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des champignonnières Maine et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9494": {
    libelle: "Convention collective départementale des exploitations maraîchères Maine et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations maraîchères Maine et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9497": {
    libelle: "Convention collective départementale des producteurs graines Maine et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des producteurs graines Maine et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9501": {
    libelle: "Convention collective départementale des exploitations agricoles Manche",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Manche",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9502": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Manche",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Manche",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9521": {
    libelle: "Convention collective départementale des polyculture pépinières horticulture CUMA Haute Marne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des polyculture pépinières horticulture CUMA Haute Marne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9531": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Mayenne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Mayenne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9532": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Mayenne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Mayenne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9561": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Morbihan",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Morbihan",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9562": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Morbihan",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Morbihan",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9581": {
    libelle: "Convention collective départementale des exploitations forestières Nièvre",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Nièvre",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9591": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Nord",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Nord",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9592": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Nord",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Nord",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9601": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Oise",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Oise",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9602": {
    libelle: "Convention collective départementale des exploitations forestières Oise",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Oise",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9603": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Oise",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Oise",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9612": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Orne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Orne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9613": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Orne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Orne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9621": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Pas de Calais",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Pas de Calais",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9622": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Pas de Calais ",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Pas de Calais ",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9631": {
    libelle: "Convention collective départementale des exploitations agricoles Puy de Dôme",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Puy de Dôme",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9641": {
    libelle: "Convention collective départementale des exploitations agricoles Pyrénées Atlantiques",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Pyrénées Atlantiques",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9651": {
    libelle: "Convention collective départementale des exploitations agricoles Hautes Pyrénées",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Hautes Pyrénées",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9661": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Pyrénées Orientales",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Pyrénées Orientales",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9691": {
    libelle: "Convention collective départementale des exploitations agricoles Rhône",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Rhône",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9711": {
    libelle: "Convention collective départementale des exploitations forestières Saône et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Saône et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9712": {
    libelle: "Convention collective départementale des exploitations agricoles Saône et Loire",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Saône et Loire",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9721": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Sarthe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Sarthe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9722": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Sarthe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Sarthe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9723": {
    libelle: "Convention collective départementale des exploitations maraîchères Sarthe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations maraîchères Sarthe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9725": {
    libelle: "Convention collective départementale des champignonnières Sarthe",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des champignonnières Sarthe",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9761": {
    libelle: "Convention collective départementale des exploitations agricoles Seine Maritime",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Seine Maritime",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9762": {
    libelle: "Convention collective départementale des exploitations maraîchères Seine Maritime",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations maraîchères Seine Maritime",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9791": {
    libelle: "Convention collective départementale des exploitations agricoles Deux Sèvres",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Deux Sèvres",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9801": {
    libelle: "Convention collective départementale des exploitations forestières Somme",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Somme",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9802": {
    libelle: "Convention collective départementale des exploitations polyculture élevage et CUMA, ETAR Somme",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage et CUMA, ETAR Somme",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9811": {
    libelle: "Convention collective départementale des exploitations agricoles Tarn",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Tarn",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9821": {
    libelle: "Convention collective départementale des exploitations agricoles Tarn et Garonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Tarn et Garonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9831": {
    libelle: "Convention collective départementale des exploitations agricoles Var",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Var",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9841": {
    libelle: "Convention collective départementale des exploitations agricoles Vaucluse",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Vaucluse",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9851": {
    libelle: "Convention collective départementale des exploitations polyculture élevage Vendée",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations polyculture élevage Vendée",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9852": {
    libelle: "Convention collective départementale des exploitations pépinières horticulture Vendée",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations pépinières horticulture Vendée",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9853": {
    libelle: "Convention collective départementale des exploitations maraîchères Vendée",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations maraîchères Vendée",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9862": {
    libelle: "Convention collective départementale des  champignonnières Vienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des  champignonnières Vienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9871": {
    libelle: "Convention collective départementale des exploitations agricoles Haute Vienne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Haute Vienne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9891": {
    libelle: "Convention collective départementale des exploitations forestières Yonne",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations forestières Yonne",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9971": {
    libelle: "Convention collective départementale des exploitations bananières Martinique",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations bananières Martinique",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9972": {
    libelle: "Convention collective départementale des exploitations agricoles Guyane",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "Convention collective départementale des exploitations agricoles Guyane",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9998": {
    libelle: "___Convention non encore en vigueur___",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "___Convention non encore en vigueur___",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "9999": {
    libelle: "___Sans convention collective___",
    nature: null,
    url: null,
    convention_nationale_associees: null,
    _meta: {
      recherche_entreprise: {
        titre: "___Sans convention collective___",
        id_kali: null,
        cc_ti: null,
        nature: null,
        etat: null,
        debut: null,
        fin: null,
        url: null,
      },
    },
  },
  "1740 1841 1843": {
    libelle:
      "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
    nature: null,
    url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635390",
    convention_nationale_associees: null,
    _meta: {
      legifrance: [
        {
          etat_juridique: "ABROGE",
          url: "https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635390",
          titre:
            "Convention collective régionale du bâtiment de la région parisienne. Etendue par arrêté du 14 février 1962 JORF 8 mars 1962 rectificatif 24 mars 1962.",
          soustitre:
            "Bâtiment de la région parisienne : ouvriers, employés, techniciens et agents de maîtrise, ingénieurs, assimilés et cadres",
        },
      ],
    },
  },
};

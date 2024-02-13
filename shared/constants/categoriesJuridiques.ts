export enum Siasp {
  FONCTION_PUBLIQUE_D_ETAT = "FPE",
  FONCTION_PUBLIQUE_HOSPITALIERE = "FPH",
  FONCTION_PUBLIQUE_TERRITORIALE = "FPT",
  HORS_FONCTION_PUBLIQUE = "HFP",
}

export interface CategoryJuridique {
  category_juridique_id: string;
  libelle: string;
  siasp: "FPE" | "FPH" | "FPT" | "HFP";
}

export const categoriesJuridiques: CategoryJuridique[] = [
  {
    category_juridique_id: "3110",
    libelle: "Représentation ou agence commerciale d'état ou organisme public étranger immatriculé au RCS",
    siasp: "HFP",
  },
  {
    category_juridique_id: "3205",
    libelle: "Organisation internationale",
    siasp: "HFP",
  },
  {
    category_juridique_id: "3210",
    libelle: "État, collectivité ou établissement public étranger",
    siasp: "HFP",
  },
  {
    category_juridique_id: "4130",
    libelle: "Exploitant public",
    siasp: "HFP",
  },
  {
    category_juridique_id: "4140",
    libelle: "EPIC",
    siasp: "HFP",
  },
  {
    category_juridique_id: "4160",
    libelle: "Institution Banque de France",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7111",
    libelle: "Autorité constitutionnelle",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7112",
    libelle: "Autorité administrative ou publique indépendante",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7113",
    libelle: "Ministère",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7120",
    libelle: "Service central d'un ministère",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7150",
    libelle: "Service du ministère de la Défense",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7160",
    libelle: "Service déconcentré à compétence nationale d'un ministère (hors Défense)",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7171",
    libelle: "Service déconcentré de l'État à compétence (inter) régionale",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7172",
    libelle: "Service déconcentré de l'État à compétence (inter) départementale",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7179",
    libelle: "(Autre) Service déconcentré de l'État à compétence territoriale",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7190",
    libelle: "Ecole nationale non dotée de la personnalité morale",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7210",
    libelle: "Commune et commune nouvelle",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7220",
    libelle: "Département",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7225",
    libelle: "Collectivité et territoire d'Outre Mer",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7229",
    libelle: "(Autre) Collectivité territoriale",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7230",
    libelle: "Région",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7312",
    libelle: "Commune associée et commune déléguée",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7313",
    libelle: "Section de commune",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7314",
    libelle: "Ensemble urbain",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7321",
    libelle: "Association syndicale autorisée",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7322",
    libelle: "Association foncière urbaine",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7323",
    libelle: "Association foncière de remembrement",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7331",
    libelle: "Établissement public local d'enseignement",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7340",
    libelle: "Pôle métropolitain",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7341",
    libelle: "Secteur de commune",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7342",
    libelle: "District urbain",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7343",
    libelle: "Communauté urbaine",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7344",
    libelle: "Métropole",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7345",
    libelle: "Syndicat intercommunal à vocation multiple (SIVOM)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7346",
    libelle: "Communauté de communes",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7347",
    libelle: "Communauté de villes",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7348",
    libelle: "Communauté d'agglomération",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7349",
    libelle: "Autre établissement public local de coopération non spécialisé ou entente",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7351",
    libelle: "Institution interdépartementale ou entente",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7352",
    libelle: "Institution interrégionale ou entente",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7353",
    libelle: "Syndicat intercommunal à vocation unique (SIVU)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7354",
    libelle: "Syndicat mixte fermé",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7355",
    libelle: "Syndicat mixte ouvert",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7356",
    libelle: "Commission syndicale pour la gestion des biens indivis des communes",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7357",
    libelle: "Pôle d'équilibre territorial et rural (PETR)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7361",
    libelle: "Centre communal d'action sociale",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7362",
    libelle: "Caisse des écoles",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7363",
    libelle: "Caisse de crédit municipal",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7364",
    libelle: "Établissement d'hospitalisation",
    siasp: "FPH",
  },
  {
    category_juridique_id: "7365",
    libelle: "Syndicat inter hospitalier",
    siasp: "FPH",
  },
  {
    category_juridique_id: "7366",
    libelle: "Établissement public local social et médico-social",
    siasp: "FPH",
  },
  {
    category_juridique_id: "7367",
    libelle: "Centre Intercommunal d'action sociale (CIAS)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7371",
    libelle: "Office public d'habitation à loyer modéré (OPHLM)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7372",
    libelle: "Service départemental d'incendie et de secours (SDIS)",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7373",
    libelle: "Établissement public local culturel",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7378",
    libelle: "Régie d'une collectivité locale à caractère administratif",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7379",
    libelle: "(Autre) Établissement public administratif local",
    siasp: "FPT",
  },
  {
    category_juridique_id: "7381",
    libelle: "Organisme consulaire",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7382",
    libelle: "Établissement public national ayant fonction d'administration centrale",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7383",
    libelle: "Établissement public national à caractère scientifique culturel et professionnel",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7384",
    libelle: "Autre établissement public national d'enseignement",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7385",
    libelle: "Autre établissement public national administratif à compétence territoriale limitée",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7389",
    libelle: "Établissement public national à caractère administratif",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7410",
    libelle: "Groupement d'intérêt public (GIP)",
    siasp: "FPE",
  },
  {
    category_juridique_id: "7430",
    libelle: "Établissement public des cultes d'Alsace-Lorraine",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7450",
    libelle: "Etablissement public administratif, cercle et foyer dans les armées",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7470",
    libelle: "Groupement de coopération sanitaire à gestion publique",
    siasp: "HFP",
  },
  {
    category_juridique_id: "7490",
    libelle: "Autre personne morale de droit administratif",
    siasp: "FPE",
  },
  {
    category_juridique_id: "9150",
    libelle: "Association syndicale libre",
    siasp: "HFP",
  },
];

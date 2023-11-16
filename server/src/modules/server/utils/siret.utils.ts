import { getOpcoData } from "../../../common/apis/cfaDock";
import { getConventionCollective, getEntreprise, getEtablissement } from "../../../common/apis/entreprise";
import { findDataByDepartementNum } from "../../../common/controllers/geo/geoController";
import { getCoordinatesFromAddressData } from "../../../common/utils/geoUtils";

export const getDataFromSiret = async (providedSiret: string, { withGeoloc = true } = {}) => {
  const siretData = await findDataFromSiret(providedSiret);

  let geoData = {
    result: {},
    messages: {},
  };
  if (withGeoloc && Object.keys(siretData.result).length > 0 && siretData.result.numero_voie !== "") {
    const { numero_voie, type_voie, nom_voie, code_postal, localite, code_insee_localite } = siretData.result;
    geoData = await getCoordinatesFromAddressData({
      numero_voie,
      type_voie,
      nom_voie,
      code_postal,
      localite,
      code_insee: code_insee_localite,
    });
  }

  return {
    result: {
      ...siretData.result,
      ...geoData.result,
    },
    messages: {
      ...siretData.messages,
      ...geoData.messages,
    },
  };
};

const findDataFromSiret = async (providedSiret: string) => {
  if (!providedSiret || !/^[0-9]{14}$/g.test(providedSiret.trim())) {
    return {
      result: {},
      messages: {
        error: `Le Siret ${providedSiret} n'est pas valide, un Siret doit être définit et au format 14 caractères`,
      },
    };
  }

  const siret = `${providedSiret}`.trim();

  let etablissementApiInfo;
  try {
    etablissementApiInfo = await getEtablissement(siret);
  } catch (e) {
    console.log({ e });
    if (e.reason === 451) {
      return {
        result: {
          siret: siret,
          siren: siret.substring(0, 9),
          enseigne: "",
          entreprise_raison_sociale: "",
          numero_voie: "",
          type_voie: "",
          nom_voie: "",
          code_postal: "",
          localite: "",
          commune_implantation_nom: "",
          naf_code: "",
          conventionCollective: { idcc: "", titre: "" },
          secretSiret: true,
        },
        messages: {
          api_entreprise: `Le Siret ${siret} existe`,
        },
      };
    } else if (/^5[0-9]{2}/.test(`${e.reason}`)) {
      return {
        result: {
          siret: siret,
          siren: siret.substring(0, 9),
          enseigne: "",
          entreprise_raison_sociale: "",
          numero_voie: "",
          type_voie: "",
          nom_voie: "",
          code_postal: "",
          localite: "",
          commune_implantation_nom: "",
          naf_code: "",
          conventionCollective: { idcc: "", titre: "" },
          api_entreprise: "KO",
        },
        messages: {
          api_entreprise: `Le service de récupération des informations Siret est momentanément indisponible`,
        },
      };
    }
    return {
      result: {},
      messages: {
        error: `Le Siret ${siret} n'existe pas ou n'a été retrouvé`,
      },
    };
  }

  let conventionCollective = null;
  try {
    conventionCollective = await getOpcoData(siret);
  } catch (e) {
    console.log(e);
    conventionCollective = {
      idcc: null,
      opco_nom: null,
      opco_siren: null,
      status: "ERROR",
    };
  }

  const siren = siret.substring(0, 9);
  let entrepriseApiInfo;
  try {
    entrepriseApiInfo = await getEntreprise(siren);
  } catch (e) {
    console.log(e);
    return {
      result: {},
      messages: {
        error: `Le Siren ${siren} n'existe pas ou n'a été retrouvé`,
      },
    };
  }

  if (conventionCollective?.status === "ERROR") {
    try {
      conventionCollective = await getOpcoData(siren);
    } catch (e) {
      console.log(e);
      conventionCollective = {
        idcc: null,
        opco_nom: null,
        opco_siren: null,
        status: "ERROR",
      };
    }
  }

  let complement_conventionCollective = {
    active: false,
    date_publication: null,
    etat: null,
    titre_court: null,
    titre: null,
    url: null,
  };
  if (conventionCollective?.status !== "ERROR") {
    try {
      const { active, date_publication, etat, titre_court, titre, url } = await getConventionCollective(siret);
      complement_conventionCollective = { active, date_publication, etat, titre_court, titre, url };
    } catch (e) {
      console.log(e);
    }
  }
  conventionCollective = { ...conventionCollective, ...complement_conventionCollective };
  console.log({
    etablissementApiInfo,
    acheminement_postal: etablissementApiInfo.adresse.acheminement_postal,
    entrepriseApiInfo,
    complement_conventionCollective,
  });
  let code_dept = etablissementApiInfo.adresse.code_commune.substring(0, 2);
  code_dept = code_dept === "97" ? etablissementApiInfo.adresse.code_commune.substring(0, 3) : code_dept;
  const { nom_dept, nom_region, code_region, nom_academie, num_academie } = findDataByDepartementNum(code_dept);

  const isPublicSector = await isPublic(entrepriseApiInfo?.forme_juridique.code);

  return {
    result: {
      public: isPublicSector,
      siege_social: etablissementApiInfo.siege_social,
      etablissement_siege_siret: entrepriseApiInfo?.siret_siege_social,
      siret: etablissementApiInfo.siret,
      siren,
      naf_code: etablissementApiInfo.activite_principale.code,
      naf_libelle: etablissementApiInfo.activite_principale.libelle,
      tranche_effectif_salarie: etablissementApiInfo.tranche_effectif_salarie,
      date_creation: etablissementApiInfo.date_creation,
      diffusable_commercialement: etablissementApiInfo.diffusable_commercialement,
      enseigne: etablissementApiInfo.enseigne ? etablissementApiInfo.enseigne : entrepriseApiInfo?.enseigne,
      adresse: buildAdresse(etablissementApiInfo.adresse.acheminement_postal),
      numero_voie: etablissementApiInfo.adresse.numero_voie,
      indice_repetition_voie: etablissementApiInfo.adresse.indice_repetition_voie,
      type_voie: etablissementApiInfo.adresse.type_voie,
      nom_voie: etablissementApiInfo.adresse.libelle_voie,
      complement_adresse: etablissementApiInfo.adresse.complement_adresse,
      code_postal: etablissementApiInfo.adresse.code_postal,
      num_departement: code_dept,
      nom_departement: nom_dept,
      nom_academie: nom_academie,
      num_academie: num_academie,

      localite: etablissementApiInfo.adresse.libelle_commune,
      code_insee_localite: etablissementApiInfo.adresse.code_commune,
      cedex: etablissementApiInfo.adresse.code_cedex,

      date_fermeture: new Date(etablissementApiInfo.etat_administratif.date_fermeture * 1000),
      ferme: etablissementApiInfo.etat_administratif !== "A",

      region: nom_region,
      num_region: code_region,

      pays_implantation_code: etablissementApiInfo.adresse.code_pays_etranger,
      pays_implantation_nom: etablissementApiInfo.adresse.libelle_pays_etranger,

      entreprise_siren: entrepriseApiInfo?.siren,
      entreprise_numero_tva_intracommunautaire: entrepriseApiInfo?.numero_tva?.tva_number,

      entreprise_code_effectif_entreprise: entrepriseApiInfo?.tranche_effectif_salarie?.code,
      entreprise_forme_juridique_code: entrepriseApiInfo?.forme_juridique?.code,
      entreprise_forme_juridique: entrepriseApiInfo?.forme_juridique?.libelle,
      entreprise_raison_sociale:
        entrepriseApiInfo?.raison_sociale ?? entrepriseApiInfo?.personne_morale_attributs?.raison_sociale,
      entreprise_nom_commercial: entrepriseApiInfo?.extrait_kbis?.nom_commercial,
      entreprise_capital_social: entrepriseApiInfo?.extrait_kbis?.capital?.montant,
      entreprise_date_creation: entrepriseApiInfo?.date_creation,
      entreprise_date_radiation:
        entrepriseApiInfo?.date_radiation ?? entrepriseApiInfo?.date_radiation?.extrait_kbis?.date_radiation,
      entreprise_naf_code: entrepriseApiInfo?.activite_principale?.code,
      entreprise_naf_libelle: entrepriseApiInfo?.activite_principale?.libelle,
      entreprise_date_fermeture: entrepriseApiInfo?.etat_administratif.date_cessation,
      entreprise_ferme: entrepriseApiInfo?.etat_administratif === "C",
      entreprise_siret_siege_social: entrepriseApiInfo?.siret_siege_social,

      entreprise_nom: entrepriseApiInfo?.personne_physique_attributs?.nom_naissance,
      entreprise_nom_usage: entrepriseApiInfo?.personne_physique_attributs?.nom_usage,
      entreprise_prenom: entrepriseApiInfo?.personne_physique_attributs?.prenom_usuel,
      entreprise_prenom_1: entrepriseApiInfo?.personne_physique_attributs?.prenom_1,
      entreprise_prenom_2: entrepriseApiInfo?.personne_physique_attributs?.prenom_2,
      entreprise_prenom_3: entrepriseApiInfo?.personne_physique_attributs?.prenom_3,
      entreprise_prenom_4: entrepriseApiInfo?.personne_physique_attributs?.prenom_4,
      entreprise_categorie: entrepriseApiInfo?.categorie_entreprise,
      entreprise_tranche_effectif_salarie: entrepriseApiInfo?.tranche_effectif_salarie,

      conventionCollective,
      api_entreprise_reference: true,
    },
    messages: {
      api_entreprise: "Ok",
    },
  };
};

interface Adresse {
  l1?: string;
  l2?: string;
  l3?: string;
  l4?: string;
  l5?: string;
  l6?: string;
  l7?: string;
}
const buildAdresse = (adresse: Adresse) => {
  const l1 = adresse.l1 && adresse.l1 !== "" ? `${adresse.l1}\r\n` : "";
  const l2 = adresse.l2 && adresse.l2 !== "" ? `${adresse.l2}\r\n` : "";
  const l3 = adresse.l3 && adresse.l3 !== "" ? `${adresse.l3}\r\n` : "";
  const l4 = adresse.l4 && adresse.l4 !== "" ? `${adresse.l4}\r\n` : "";
  const l5 = adresse.l5 && adresse.l5 !== "" ? `${adresse.l5}\r\n` : "";
  const l6 = adresse.l6 && adresse.l6 !== "" ? `${adresse.l6}\r\n` : "";
  const l7 = adresse.l7 && adresse.l7 !== "" ? `${adresse.l7}` : "";
  return `${l1}${l2}${l3}${l4}${l5}${l6}${l7}`;
};

const isPublic = async (code: string) => {
  console.log({ code });
  // TODO
  // const match = await CategoriesJuridique.findOne({ CATEGJURID: code, SIASP: { $ne: "HFP" } }).lean();
  // if (!match) {
  //   return false;
  // }
  // return true;
  return false;
};

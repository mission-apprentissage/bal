import { CerfaControl } from ".";
import { fetchSiret } from "./utils/api.utils";

const unlockAllCascade = {
  "employeur.denomination": { locked: false, reset: true },
  "employeur.naf": { locked: false, reset: true },
  "employeur.codeIdcc": { locked: false, reset: true },
  "employeur.codeIdcc_special": { locked: false, reset: true },
  "employeur.libelleIdcc": { locked: false, reset: true },
  "employeur.nombreDeSalaries": { locked: false, reset: true },
  "employeur.adresse.numero": { locked: false, reset: true },
  "employeur.adresse.repetitionVoie": { locked: false, reset: true },
  "employeur.adresse.voie": { locked: false, reset: true },
  "employeur.adresse.complement": { locked: false, reset: true },
  "employeur.adresse.codePostal": { locked: false, reset: true },
  "employeur.adresse.commune": { locked: false, reset: true },
  "employeur.adresse.departement": { locked: false, reset: true },
  "employeur.adresse.region": { locked: false, reset: true },
  "employeur.privePublic": { locked: false, reset: true, value: true },
};

export const employerSiretLogic: CerfaControl = {
  deps: ["employeur.siret"],
  process: async ({ values, signal }) => {
    const siret = values.employeur.siret;

    if (siret.length < 14) return { error: "le siret doit comporter 14 chiffres" };

    const { messages, result } = await fetchSiret({
      siret,
      signal,
    });

    const resultLength = Object.keys(result).length;
    if (resultLength === 0) {
      if (messages.error.includes("non diffusible")) {
        return { error: "Siret non diffusible : récupération automatique des données des autres champs impossible." };
      }
      return { error: messages.error };
    }

    if (result.api_entreprise === "KO") {
      return {
        warning: `Récupération automatique des données des autres champs impossible en raison d'une maintenance du service.`,
        cascade: unlockAllCascade,
      };
    }

    if (result.ferme) {
      return { error: `Siret inactif : le siret ${siret} correspond à un établissement fermé` };
    }

    if (result.secretSiret) {
      return {
        warning: `Votre siret est valide. En revanche, en raison de sa nature, nous ne pouvons pas récupérer les informations reliées.`,
        cascade: unlockAllCascade,
      };
    }

    return {
      cascade: {
        "employeur.siret": {
          success: true,
          stateRelatedMessage:
            "Le siret est valide et actif. Des champs ont été remplis automatiquement, vous avez la possibilité de les modifier si besoin. Si vous constatez une erreur manifeste sur les données remplies automatiquement, rendez-vous sur le site de l'INSEE pour savoir comment corriger les informations à la source : https://www.insee.fr/fr/information/2015441",
          cascade: false,
        },
        "employeur.denomination": {
          value: result.enseigne || result.entreprise_raison_sociale,
        },
        "employeur.naf": {
          value: result.naf_code,
          cascade: false,
        },
        "employeur.codeIdcc": {
          value: result.conventionCollective?.idcc ? `${result.conventionCollective?.idcc}` : undefined,
        },
        "employeur.codeIdcc_special": {
          value: result.conventionCollective?.idcc ? `${result.conventionCollective?.idcc}` : undefined,
        },
        "employeur.libelleIdcc": {
          value: result.conventionCollective?.titre || undefined,
        },
        "employeur.nombreDeSalaries": {
          value: result.entreprise_tranche_effectif_salarie?.de || undefined,
        },
        "employeur.adresse.numero": {
          value: result.numero_voie || undefined,
        },
        "employeur.adresse.repetitionVoie": {
          value: result.indice_repetition_voie,
          reset: true,
        },
        "employeur.adresse.voie": {
          value:
            result.type_voie || result.nom_voie
              ? `${result.type_voie ? `${result.type_voie} ` : undefined}${result.nom_voie}`
              : undefined,
          locked: false,
        },
        "employeur.adresse.complement": {
          value: result.complement_adresse || undefined,
          locked: false,
        },
        "employeur.adresse.codePostal": {
          value: result.code_postal || undefined,
          locked: false,
          cascade: false,
        },
        "employeur.adresse.commune": {
          value: result.localite || undefined,
          locked: false,
        },
        "employeur.adresse.departement": {
          value: result.num_departement || undefined,
          locked: false,
        },
        "employeur.adresse.region": {
          value: result.num_region || undefined,
          locked: true,
        },
        "employeur.privePublic": {
          value: result.public ?? true,
          locked: false,
        },
      },
    };
  },
};

export const employeurSiretControl: CerfaControl[] = [employerSiretLogic];

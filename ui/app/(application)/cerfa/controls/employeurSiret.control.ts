import { formesJuridiques } from "shared/constants/formesJuridiques";
import { idccOpcos, Opco, opcos } from "shared/constants/opcos";

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

const SUCCESS = {
  success: true,
  stateRelatedMessage: "Récupéré automatiquement à partir du siret",
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

    let opco: Opco | undefined;

    if (result.conventionCollective?.idcc?.length >= 1) {
      const opcoIdcc = idccOpcos.find((o) => o.idcc.padStart(4, "0") === result.conventionCollective?.idcc?.[0]);
      opco = opcoIdcc ? opcos[opcoIdcc.opco] : undefined;
    }

    const typeEmployeur = formesJuridiques[result?.entreprise_forme_juridique_code]?.typeEmployeur;

    return {
      cascade: {
        "employeur.siret": {
          success: true,
          stateRelatedMessage:
            "Le siret est valide et actif. Des champs ont été remplis automatiquement, vous avez la possibilité de les modifier si besoin. Si vous constatez une erreur manifeste sur les données remplies automatiquement, rendez-vous sur le site de l'INSEE pour savoir comment corriger les informations à la source : https://www.insee.fr/fr/information/2015441)",
          cascade: false,
          informationMessages:
            (result.public && [
              {
                type: "assistive",
                content:
                  "La catégorie juridique de l’entreprise semble relever du secteur public. Si c’est bien le cas, rendez-vous sur [CELIA](https://celia.emploi.gouv.fr/) pour compléter votre cerfa.",
              },
            ]) ??
            [],
        },
        "employeur.denomination": {
          value: result.enseigne || result.entreprise_raison_sociale,
          ...((result.enseigne || result.entreprise_raison_sociale) && SUCCESS),
        },
        "employeur.typeEmployeur": {
          value: typeEmployeur,
          cascade: false,
          ...(typeEmployeur && { isAutocompleted: true }),
          ...(typeEmployeur && SUCCESS),
        },
        "employeur.naf": {
          value: result.naf_code,
          cascade: false,
          ...(result.naf_code && SUCCESS),
        },
        "employeur.codeIdcc": {
          value: result.conventionCollective?.idcc?.[0] ? `${result.conventionCollective.idcc[0]}` : undefined,
          ...(result.conventionCollective?.idcc && SUCCESS),
        },
        // used to store array of idccs
        "employeur.codeIdccs": {
          value: result.conventionCollective?.idcc ?? undefined,
          ...(result.conventionCollective?.idcc && SUCCESS),
        },
        "employeur.codeIdcc_special": {
          value: result.conventionCollective?.idcc ? `${result.conventionCollective?.idcc}` : undefined,
          ...(result.conventionCollective?.idcc && SUCCESS),
        },
        "employeur.libelleIdcc": {
          value: result.conventionCollective?.titre || undefined,
          ...(result.conventionCollective?.titre && SUCCESS),
        },
        "employeur.nombreDeSalaries": {
          value: result.entreprise_tranche_effectif_salarie?.de || undefined,
          ...(result.entreprise_tranche_effectif_salarie?.de && SUCCESS),
        },
        "employeur.adresse.numero": {
          value: result.numero_voie || undefined,
          ...(result.numero_voie && SUCCESS),
        },
        "employeur.adresse.repetitionVoie": {
          value: result.indice_repetition_voie,
          ...SUCCESS,
          reset: true,
        },
        "employeur.adresse.voie": {
          value:
            result.type_voie || result.nom_voie
              ? `${result.type_voie ? `${result.type_voie} ` : ""}${result.nom_voie}`
              : undefined,
          locked: false,
          ...((result.type_voie || result.nom_voie) && SUCCESS),
        },
        "employeur.adresse.complement": {
          value: result.complement_adresse || undefined,
          ...(result.complement_adresse && SUCCESS),
          locked: false,
        },
        "employeur.adresse.codePostal": {
          value: result.code_postal || undefined,
          locked: false,
          cascade: false,
          ...(result.code_postal && SUCCESS),
        },
        "employeur.adresse.commune": {
          value: result.localite || undefined,
          locked: false,
          ...(result.localite && SUCCESS),
        },
        "employeur.adresse.departement": {
          value: result.num_departement || undefined,
          locked: false,
          ...(result.num_departement && SUCCESS),
        },
        "employeur.adresse.region": {
          value: result.num_region || undefined,
          locked: true,
          ...(result.num_region && SUCCESS),
        },
        ...(opco && {
          "contrat.opco": {
            informationMessages: [
              {
                type: "bonus",
                title: "Votre Opco",
                icon: `/images/cerfa/opco/${opco.logo}`,
                content: getOpcoMessage(opco),
                collapse: {
                  label: "En savoir plus",
                  content:
                    "Chaque entreprise est rattachée à un OPCO. C’est votre acteur de référence pour vous accompagner dans vos démarches liées à l’alternance (financement des contrats, formation, ...).",
                },
              },
            ],
          },
        }),
      },
    };
  },
};

const getOpcoMessage = (opco: Opco) => {
  let message = "";
  if (opco.simulatorUrl) {
    message = `Vous souhaitez des informations sur la rémunération ? Rendez-vous sur le [simulateur de votre OPCO](${opco.simulatorUrl})`;
  } else if (opco.url) {
    message = `Besoin d’accompagnement ? Votre OPCO peut vous aider : [${opco.url}](${opco.url})`;
  }

  return message;
};

export const employeurSiretControl: CerfaControl[] = [employerSiretLogic];

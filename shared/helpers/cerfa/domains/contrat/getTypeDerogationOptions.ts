import { CerfaForm, InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

import { caclAgeAtDate } from "../../utils/dates";

const TYPE_DEROGATIONS_OPTIONS = [
  {
    label: "11 - Age de l'apprenti inférieur à 16 ans",
    value: "11",
    locked: false,
  },
  {
    label: "12 - Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail",
    value: "12",
    locked: false,
  },
  {
    label: "21 - Réduction de la durée du contrat ou de la période d'apprentissage",
    value: "21",
    locked: false,
  },
  {
    label: "22 - Allongement de la durée du contrat ou de la période d'apprentissage",
    value: "22",
    locked: false,
  },
  {
    label: "50 - Cumul de dérogations",
    value: "50",
    locked: false,
  },
  {
    label: "60 - Autre dérogation",
    value: "60",
    locked: false,
  },
];

export const getTypeDerogationOptions = ({ values }: CerfaForm) => {
  const { dateNaissance } = values.apprenti;
  const { dateDebutContrat } = values.contrat;
  if (!dateNaissance || !dateDebutContrat) return TYPE_DEROGATIONS_OPTIONS;

  const { exactAge: age } = caclAgeAtDate(dateNaissance, dateDebutContrat);

  if (!age) return TYPE_DEROGATIONS_OPTIONS;
  // 11 not allowed if age >= 16 à la date d'execution
  // if age  à la date d'execution < 16   type 11 ||  50
  // 12 not allowed age < 30  à la date d'execution
  // if age  à la date d'execution >= 30  type 12 ||  50
  return TYPE_DEROGATIONS_OPTIONS.map((option) => {
    let locked = false;

    if (age >= 30) {
      locked = !["12", "50"].includes(option.value);
    } else if (age < 16) {
      locked = !["11", "50"].includes(option.value);
    } else {
      if (age >= 16) {
        locked = ["11"].includes(option.value);
      }
      if (age < 30) {
        locked = ["12"].includes(option.value);
      }
    }
    return { ...option, locked };
  });
};

export const getTypeDerogationInformationMessages = ({ values }: CerfaForm): InformationMessage[] => {
  const {
    contrat: { typeDerogation },
  } = values;

  if (["21", "22"].includes(typeDerogation))
    return [
      {
        type: "assistive",
        content: `A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège)).

En cas d'allongement ou de réduction de la durée du contrat, le CFA vous enverra une convention d'aménagement à remplir et à signer.`,
      },
    ];

  return [
    {
      type: "assistive",
      content: `A renseigner si une dérogation existe pour ce contrat (exemple : l'apprentissage commence à partir de 16 ans mais par dérogation, les jeunes âgés d'au moins 15 ans et un jour peuvent conclure un contrat d'apprentissage s'ils ont terminé la scolarité du 1er cycle de l'enseignement secondaire (collège).`,
    },
  ];
};

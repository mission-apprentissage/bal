import { idcc } from "shared/constants/idcc";

import { CerfaForm, InformationMessage } from "../../types/cerfa.types";

const getMessages = (url?: string | null): InformationMessage[] => {
  return [
    {
      type: "assistive",
      content: `Si vous ne connaissez pas le SMC applicable, consultez votre convention collective.

${url ? `[Votre convention collective](${url})` : ""}`,
      collapse: {
        label: "En savoir plus",
        content: `L'information figure en général dans la partie "Salaires". Vous devez vous référer à la position du poste occupé par l'apprenti dans la classification hiérarchique pour  déterminer la rémunération minimum applicable à l’apprenti à partir du salaire de base et du pourcentage appliqué.

Vérifiez la valeur du SMC applicable dans le dernier avenant à la convention collective puis renseignez le champ.`,
      },
    },
    {
      type: "regulatory",
      content: `Lorsque l'apprenti a 21 ans ou plus, si le SMC existe et que son montant est plus avantageux pour l'apprenti, son application est obligatoire.`,
    },
    {
      type: "bonus",
      content: `Le salaire minimum conventionnel (SMC) est le salaire minimum prévu par une convention collective de branche, issu d’une « grille de classification », applicable à un salarié.

Dans certains secteurs, il existe aussi des majorations prévues par la convention collective.`,
    },
  ];
};

export const getSmcMessages = ({ values }: CerfaForm): InformationMessage[] => {
  const {
    employeur: { codeIdcc },
  } = values;

  if (codeIdcc) {
    const foundIdcc = idcc?.[codeIdcc.padStart(4, "0")];

    return getMessages(foundIdcc?.url);
  }

  return getMessages();
};

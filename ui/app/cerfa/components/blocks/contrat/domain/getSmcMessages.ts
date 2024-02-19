import { idcc } from "shared/constants/idcc";

import { InformationMessage } from "../../../../utils/cerfaSchema";
import { CerfaForm } from "../../../CerfaForm";

const getMessages = (url?: string): InformationMessage[] => {
  return [
    {
      type: "assistive",
      content: `Lorsque l'apprenti a 21 ans ou plus, si le SMC existe et que son montant est plus avantageux pour l'apprenti, son application est obligatoire.
      
      
${url ? `[Votre convention collective](${url})` : ""}`,
      collapse: {
        label: "En savoir plus",
        content: `La base sur laquelle est calculée la rémunération de l'apprenti correspond au salaire le plus avantageux entre le salaire minimum de croissance (SMIC, qui correspond au salaire minimum légal que le salarié doit percevoir), et le salaire minimum conventionnel (SMC) indiqué dans la convention collective applicable à votre activité.
          
          Si salaire minimum conventionnel est supérieur au SMIC, c’est le salaire minimum conventionnel qui s’applique. En revanche, lorsque le montant du salaire minimum conventionnel est inférieur au SMIC, vous devez verser au minimum un salaire qui se base sur le montant du SMIC.`,
      },
    },
    {
      type: "bonus",
      content: `Le salaire minimum conventionnel (SMC) est le salaire minimum prévu par une convention collective de branche, issu d’une « grille de classification », applicable à un salarié.
      
      Dans certains secteurs, il existe aussi des majorations prévues par la convention collective.`,
      collapse: {
        label: "En savoir plus",
        content: `Si vous ne connaissez pas le SMC applicable, consultez votre convention collective.
      
      L'information figure en général dans la partie "Salaires". Vous devez vous référer à la position du poste occupé par l'apprenti dans la classification hiérarchique pour  déterminer la rémunération minimum applicable à l’apprenti à partir du salaire de base et du pourcentage appliqué.`,
      },
    },
  ];
};

export const getSmcMessages = ({ values }: CerfaForm): InformationMessage[] => {
  const {
    employeur: { codeIdcc },
  } = values;

  if (codeIdcc) {
    const foundIdcc = idcc?.[codeIdcc];

    if (foundIdcc.url) {
      return getMessages(foundIdcc.url);
    }
  }

  return getMessages();
};

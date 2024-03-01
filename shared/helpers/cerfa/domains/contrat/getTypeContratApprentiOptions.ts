import { CerfaForm, SelectNestedOption } from "../../types/cerfa.types";
import { caclAgeAtDate } from "../../utils/dates";

const TYPE_CONTRAT_APPRENTI_OPTIONS: SelectNestedOption[] = [
  {
    name: "Contrat initial",
    options: [
      {
        label: "11 - Premier contrat d'apprentissage de l'apprenti",
        value: "11",
      },
    ],
  },
  {
    name: "Succession de contrats",
    options: [
      {
        label: "21 - Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un même employeur",
        value: "21",
      },
      {
        label: "22 - Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un autre employeur",
        value: "22",
      },
      {
        label:
          "23 - Nouveau contrat avec un apprenti dont le précédent contrat auprès d'un autre employeur a été rompu",
        value: "23",
      },
    ],
  },
  {
    name: "Avenant : modification des conditions du contrat",
    options: [
      {
        label: "31 - Modification de la situation juridique de l'employeur",
        value: "31",
      },
      {
        label: "32 - Changement d'employeur dans le cadre d'un contrat saisonnier",
        value: "32",
      },
      {
        label: "33 - Prolongation du contrat suite à un échec à l'examen de l'apprenti",
        value: "33",
      },
      {
        label: "34 - Prolongation du contrat suite à la reconnaissance de l'apprenti comme travailleur handicapé",
        value: "34",
      },
      {
        label: "35 - Modification du diplôme préparé par l'apprenti",
        value: "35",
      },
      {
        label:
          "36 - Autres changements : changement de maître d'apprentissage, de durée de travail hebdomadaire, réduction de durée, etc.",
        value: "36",
      },
      {
        label: "37 - Modification du lieu d'exécution du contrat",
        value: "37",
      },
      {
        label: "38 - Modification du lieu principal de réalisation de la formation théorique",
        value: "38",
      },
    ],
  },
];

export const getTypeContratApprentiOptions = ({ values }: CerfaForm) => {
  const { dateNaissance, projetCreationRepriseEntreprise, inscriptionSportifDeHautNiveau, handicap } = values.apprenti;
  const { dateDebutContrat } = values.contrat;
  if (!dateNaissance || !dateDebutContrat) return TYPE_CONTRAT_APPRENTI_OPTIONS;

  const { exactAge: age } = caclAgeAtDate(dateNaissance, dateDebutContrat);
  const allNo = [projetCreationRepriseEntreprise, inscriptionSportifDeHautNiveau, handicap].every((v) => v === "non");

  if (!age) return TYPE_CONTRAT_APPRENTI_OPTIONS;
  // 11 not allowed if age > 30 à la date d'execution and allNo
  return TYPE_CONTRAT_APPRENTI_OPTIONS.map((group) => {
    return {
      ...group,
      options: group.options.map((option) => {
        let locked = false;

        if (age > 30 && allNo) {
          locked = ["11"].includes(option.value);
        }
        return { ...option, locked };
      }),
    };
  });
};

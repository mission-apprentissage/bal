import { buildRemuneration } from "../components/blocks/domain/buildRemuneration";
import { CerfaControl } from ".";

interface RemunerationAnnuelle {
  dateDebut: string;
  dateFin: string;
  taux: number;
  tauxMinimal: number;
  typeSalaire: string;
  salaireBrut: number;
  ordre: number;
}

const getTauxFromRemunerationsAnnuelles = (remunerationsAnnuelles: RemunerationAnnuelle[]) => {
  return Object.fromEntries(remunerationsAnnuelles.map((annee) => [annee.ordre, annee.taux]));
};

export const RemunerationsControl: CerfaControl[] = [
  {
    deps: [
      "employeur.adresse.departement",
      "apprenti.dateNaissance",
      "contrat.dateDebutContrat",
      "contrat.dateFinContrat",
      "contrat.smc",
      "apprenti.age",
    ],
    process: ({ values }) => {
      const employeurAdresseDepartement = values.employeur.adresse.departement;
      const apprentiDateNaissance = values.apprenti.dateNaissance;
      const apprentiAge = values.apprenti.age;
      const dateDebutContrat = values.contrat.dateDebutContrat;
      const dateFinContrat = values.contrat.dateFinContrat;

      if (
        !apprentiDateNaissance ||
        !apprentiAge ||
        !dateDebutContrat ||
        !dateFinContrat ||
        !employeurAdresseDepartement
      ) {
        return;
      }

      const oldRemus = values.contrat.remunerationsAnnuelles ?? [];
      const { remunerationsAnnuelles, smicObj } = buildRemuneration({
        apprentiDateNaissance,
        apprentiAge,
        dateDebutContrat,
        dateFinContrat,
        employeurAdresseDepartement,
        selectedTaux: getTauxFromRemunerationsAnnuelles(oldRemus),
      });

      const oldRemusCascade = Object.fromEntries(
        oldRemus?.flatMap((remu, i) => [
          [`contrat.remunerationsAnnuelles.${i}.dateDebut`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.dateFin`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.taux`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.tauxMinimal`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.typeSalaire`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.salaireBrut`, undefined],
          [`contrat.remunerationsAnnuelles.${i}.ordre`, undefined],
        ])
      );

      const newRemus = Object.fromEntries(
        remunerationsAnnuelles?.flatMap((remu: any, i) => {
          return [
            [`contrat.remunerationsAnnuelles.${i}.dateDebut`, { value: remu.dateDebut }],
            [`contrat.remunerationsAnnuelles.${i}.dateFin`, { value: remu.dateFin }],
            [`contrat.remunerationsAnnuelles.${i}.taux`, { value: remu.taux, min: remu.tauxMinimal }],
            [`contrat.remunerationsAnnuelles.${i}.tauxMinimal`, { value: remu.tauxMinimal }],
            [`contrat.remunerationsAnnuelles.${i}.typeSalaire`, { value: remu.typeSalaire }],
            [`contrat.remunerationsAnnuelles.${i}.salaireBrut`, { value: remu.salaireBrut }],
            [`contrat.remunerationsAnnuelles.${i}.ordre`, { value: remu.ordre }],
          ];
        })
      );

      return { cascade: { ...oldRemusCascade, ...newRemus, "contrat.smic": { value: smicObj } } };
    },
  },
  ...new Array(16).fill(0).map((_item, i): CerfaControl => {
    const remuAnneePath = `contrat.remunerationsAnnuelles.${i}`;
    return {
      deps: [`${remuAnneePath}.taux`],
      process: ({ values }) => {
        const remunerationsAnnee = values.contrat.remunerationsAnnuelles[i];
        const employeurAdresseDepartement = values.employeur.adresse.departement;
        const apprentiDateNaissance = values.apprenti.dateNaissance;
        const apprentiAge = values.apprenti.age;
        const dateDebutContrat = values.contrat.dateDebutContrat;
        const dateFinContrat = values.contrat.dateFinContrat;
        const smc = values.contrat.smc;

        const { remunerationsAnnuelles } = buildRemuneration({
          smc,
          apprentiDateNaissance,
          apprentiAge,
          dateDebutContrat,
          dateFinContrat,
          employeurAdresseDepartement,
          selectedTaux: { [remunerationsAnnee.ordre + ""]: remunerationsAnnee.taux },
        });

        return {
          cascade: {
            ...(i === 0 &&
              remunerationsAnnuelles[i]?.salaireBrut && {
                "contrat.salaireEmbauche": { value: remunerationsAnnuelles[i]?.salaireBrut },
              }),
            // @ts-expect-error: todo
            [`${remuAnneePath}.dateDebut`]: { value: remunerationsAnnuelles[i].dateDebut, cascade: false },
            // @ts-expect-error: todo
            [`${remuAnneePath}.dateFin`]: { value: remunerationsAnnuelles[i].dateFin, cascade: false },
            [`${remuAnneePath}.taux`]: {
              // @ts-expect-error: todo
              value: remunerationsAnnuelles[i].taux,
              cascade: false,
              // @ts-expect-error: todo
              min: remunerationsAnnuelles[i].tauxMinimal,
            },
            // @ts-expect-error: todo
            [`${remuAnneePath}.tauxMinimal`]: { value: remunerationsAnnuelles[i].tauxMinimal, cascade: false },
            // @ts-expect-error: todo
            [`${remuAnneePath}.typeSalaire`]: { value: remunerationsAnnuelles[i].typeSalaire, cascade: false },
            // @ts-expect-error: todo
            [`${remuAnneePath}.salaireBrut`]: { value: remunerationsAnnuelles[i].salaireBrut, cascade: false },
            // @ts-expect-error: todo
            [`${remuAnneePath}.ordre`]: { value: remunerationsAnnuelles[i].ordre, cascade: false },
            [`${remuAnneePath}.isChangingTaux`]: { value: remunerationsAnnuelles[i]?.isChangingTaux, cascade: false },
            [`${remuAnneePath}.newSeuil`]: { value: remunerationsAnnuelles[i]?.newSeuil, cascade: false },
          },
        };
      },
    };
  }),
];

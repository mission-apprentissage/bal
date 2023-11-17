import { NIVEAUX_DIPLOMES } from "shared/constants/diplomes";

import { CerfaField } from "../../../utils/cerfaSchema";
import { nomPattern } from "../domain/nomPattern";

export const maitreApprentissageSchema: Record<string, CerfaField> = {
  "maitre1.nom": {
    label: "Nom de naissance",
    placeholder: "Exemple : Dupont",
    required: true,
    requiredMessage: "Le nom du maître d'apprentissage est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
    messages: [
      {
        type: "assistive",
        content:
          "Le nom doit strictement correspondre à l'identité officielle du maître d'apprentissage (attention aux inversions). Le nom de naissance ou nom de famille est celui qui figure sur l’acte de naissance.",
      },
    ],
  },
  "maitre1.prenom": {
    label: "Prénom",
    placeholder: "Exemple : Claire",
    required: true,
    requiredMessage: "Le prénom du maître d'apprentissage est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "maitre1.dateNaissance": {
    label: "Date de naissance",
    fieldType: "date",
    required: true,
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
    messages: [
      { type: "regulatory", content: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat" },
    ],
  },
  "maitre1.nir": {
    label: "Numéro de sécurité sociale (NIR)",
    required: true,
    requiredMessage: "n'est pas un numéro de sécurité sociale valide",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
    messages: [
      {
        type: "assistive",
        content: `Il s'agit du numéro de sécurité sociale.
      Ce numéro est inscrit sur la carte vitale des personnes majeures, en dessous du nom et du prénom du porteur. 
      Il est officiellement appelé Numéro d'Inscription au Répertoire des personnes physiques.`,
      },
    ],
  },
  "maitre1.emploiOccupe": {
    label: "Emploi occupé",
    placeholder: "Exemple : Chaudronnier",
    required: true,
    requiredMessage: "L'emploi occupé est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
    messages: [
      {
        type: "regulatory",
        content: `Le maître d'apprentissage doit justifier d'une formation et d'une expérience professionnelle minimales :
      - 1 an d'exercice d'une activité professionnelle correspondant à la finalité du diplôme ou du titre préparé par l'apprenti, s'il est titulaire d'un diplôme ou d'un titre dans un domaine en rapport avec la qualification préparée par l'apprenti 
      - 2 ans d'exercice d'une activité professionnelle correspondant à la finalité du diplôme ou du titre préparé par l'apprenti, s'il n'est pas titulaire d'un diplôme ou d'un titre dans un domaine en rapport avec la qualification préparée par l'apprenti.
      Ceci à défaut de dispositions conventionnelles particulières applicables dans l'entreprise (code du travail, art. R6223-22).
      `,
      },
    ],
  },
  "maitre1.niveauDiplome": {
    label: "Niveau de diplôme ou titre le plus élevé obtenu",
    fieldType: "select",
    required: true,
    requiredMessage: "Le niveau de diplôme du maître d'apprentissage est obligatoire",
    options: NIVEAUX_DIPLOMES,
  },
  "maitre1.diplome": {
    label: "Diplôme ou titre le plus élevé obtenu",
    placeholder: "Exemple : BTS Assistance technique d'ingénieur",
    required: true,
    requiredMessage: "Le diplôme du maître d'apprentissage est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "maitre1.courriel": {
    label: "Courriel",
    placeholder: "Exemple : jf.martin@email.fr",
    required: true,
    fieldType: "email",
    requiredMessage: "Le courriel de l'employeur est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },

  "maitre2.nom": {
    label: "Nom de naissance",
    placeholder: "Exemple : Dupont",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
    messages: [
      {
        type: "assistive",
        content:
          "Le nom doit strictement correspondre à l'identité officielle du maître d'apprentissage (attention aux inversions). Le nom de naissance ou nom de famille est celui qui figure sur l’acte de naissance.",
      },
    ],
  },
  "maitre2.prenom": {
    label: "Prénom",
    placeholder: "Exemple : Claire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "maitre2.dateNaissance": {
    label: "Date de naissance",
    fieldType: "date",
    messages: [
      { type: "regulatory", content: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat" },
    ],
  },
  "maitre2.nir": {
    label: "Numéro de sécurité sociale (NIR)",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
    messages: [
      {
        type: "assistive",
        content: `Il s'agit du numéro de sécurité sociale.
      Ce numéro est inscrit sur la carte vitale des personnes majeures, en dessous du nom et du prénom du porteur. 
      Il est officiellement appelé Numéro d'Inscription au Répertoire des personnes physiques.`,
      },
    ],
  },
  "maitre2.emploiOccupe": {
    label: "Emploi occupé",
    placeholder: "Exemple : Chaudronnier",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
    messages: [
      {
        type: "regulatory",
        content: `Le maître d'apprentissage doit justifier d'une formation et d'une expérience professionnelle minimales :
      - 1 an d'exercice d'une activité professionnelle correspondant à la finalité du diplôme ou du titre préparé par l'apprenti, s'il est titulaire d'un diplôme ou d'un titre dans un domaine en rapport avec la qualification préparée par l'apprenti 
      - 2 ans d'exercice d'une activité professionnelle correspondant à la finalité du diplôme ou du titre préparé par l'apprenti, s'il n'est pas titulaire d'un diplôme ou d'un titre dans un domaine en rapport avec la qualification préparée par l'apprenti.
      Ceci à défaut de dispositions conventionnelles particulières applicables dans l'entreprise (code du travail, art. R6223-22).
      `,
      },
    ],
  },
  "maitre2.niveauDiplome": {
    label: "Niveau de diplôme ou titre le plus élevé obtenu",
    fieldType: "select",
    options: NIVEAUX_DIPLOMES,
  },
  "maitre2.diplome": {
    label: "Diplôme ou titre le plus élevé obtenu",
    placeholder: "Exemple : BTS Assistance technique d'ingénieur",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "maitre2.courriel": {
    label: "Courriel",
    placeholder: "Exemple : jf.martin@email.fr",
    fieldType: "email",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: "^.*$",
      },
    ],
  },
  "employeur.attestationEligibilite": {
    fieldType: "consent",
    label:
      "L’employeur atteste sur l’honneur que le maître d’apprentissage répond à l’ensemble des critères d’éligibilité à cette fonction.",
    required: true,
    showInfo: true,
    requiredMessage:
      "Il est obligatoire d'attester que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction ",
  },
};

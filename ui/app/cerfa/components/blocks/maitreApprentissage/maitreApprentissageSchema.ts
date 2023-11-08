import { nomPattern } from "../domain/nomPattern";

export const maitreApprentissageSchema = {
  "maitre1.nom": {
    required: true,
    label: "Nom de naissance:",
    requiredMessage: "le nom du maître d'apprentissage est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "maitre1.prenom": {
    required: true,
    label: "Prénom:",
    requiredMessage: "le prénom du maître d'apprentissage est obligatoire",
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
    required: true,
    fieldType: "date",
    showInfo: true,
    label: "Date de naissance :",
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
  },
  "maitre1.nir": {
    required: true,
    label: "NIR",
    requiredMessage: "le NIR du maître d'apprentissage est obligatoire",
  },
  "maitre1.emploiOccupe": {
    required: true,
    label: "Emploi occupé",
    requiredMessage: "l'emploi occupé du maître d'apprentissage est obligatoire",
  },
  "maitre1.diplome": {
    required: true,
    label: "Diplôme ou titre le plus élevé obtenu",
    requiredMessage: "Le diplôme du maître d'apprentissage est obligatoire",
  },
  "maitre1.niveauDiplome": {
    fieldType: "select",
    required: true,
    label: "Niveau de diplôme ou titre le plus élevé obtenu",
    requiredMessage: "Le niveau de diplôme du maître d'apprentissage est obligatoire",
    options: [
      { value: 0, label: "0 - Aucun diplôme ou titre" },
      { value: 3, label: "3 -  CAP, BEP " },
      { value: 4, label: "4 - Baccalauréat " },
      { value: 5, label: "5 - DEUG, BTS, DUT, DEUST " },
      { value: 6, label: "6 - Licence, licence professionnelle, BUT, Maîtrise " },
      {
        value: 7,
        label:
          "7 - Master, diplôme d'études approfondies, diplôme d'études supérieures spécialisées, diplôme d'ingénieur",
      },
      { value: 8, label: "8 - Doctorat, habilitation à diriger des recherches " },
    ],
  },
  "maitre1.courriel": {
    required: true,
    label: "Courriel",
    requiredMessage: "Le courriel du maître d'apprentissage est obligatoire",
  },
  "maitre2.nom": {
    label: "Nom de naissance:",
    requiredMessage: "le nom du maître d'apprentissage est obligatoire",
    mask: "C",
    maskBlocks: [
      {
        name: "C",
        mask: "Pattern",
        pattern: nomPattern,
      },
    ],
  },
  "maitre2.prenom": {
    label: "Prénom:",
    requiredMessage: "le prénom du maître d'apprentissage est obligatoire",
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
    fieldType: "date",
    showInfo: true,
    label: "Date de naissance :",
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
  },
  "maitre2.nir": {
    label: "NIR",
    requiredMessage: "le NIR du maître d'apprentissage est obligatoire",
  },
  "maitre2.emploiOccupe": {
    label: "Emploi occupé",
    requiredMessage: "l'emploi occupé du maître d'apprentissage est obligatoire",
  },
  "maitre2.diplome": {
    label: "Diplôme ou titre le plus élevé obtenu",
    requiredMessage: "Le diplôme du maître d'apprentissage est obligatoire",
  },
  "maitre2.niveauDiplome": {
    fieldType: "select",

    label: "Niveau de diplôme ou titre le plus élevé obtenu",
    requiredMessage: "Le niveau de diplôme du maître d'apprentissage est obligatoire",
    options: [
      { value: 0, label: "0 - Aucun diplôme ou titre" },
      { value: 3, label: "3 -  CAP, BEP " },
      { value: 4, label: "4 - Baccalauréat " },
      { value: 5, label: "5 - DEUG, BTS, DUT, DEUST " },
      { value: 6, label: "6 - Licence, licence professionnelle, BUT, Maîtrise " },
      {
        value: 7,
        label:
          "7 - Master, diplôme d'études approfondies, diplôme d'études supérieures spécialisées, diplôme d'ingénieur",
      },
      { value: 8, label: "8 - Doctorat, habilitation à diriger des recherches " },
    ],
  },
  "maitre2.courriel": {
    label: "Courriel",
    requiredMessage: "Le courriel du maître d'apprentissage est obligatoire",
  },
  "employeur.attestationEligibilite": {
    fieldType: "consent",
    label:
      "L'employeur atteste sur l'honneur que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction.",
    required: true,
    showInfo: true,
    requiredMessage:
      "Il est obligatoire d'attester que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction ",
  },
};

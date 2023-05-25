import { IPerson } from "../../../../shared/models/person.model";

export const getPersonDisplayName = (person: IPerson) => {
  if (person.nom || person.prenom) {
    return `${person.nom ?? ""} ${person.prenom ?? ""}`;
  }

  return person.email ?? person._id;
};

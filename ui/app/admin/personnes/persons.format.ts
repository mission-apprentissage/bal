import type { IPersonJson } from "shared/models/person.model";

export const getPersonDisplayName = (person: IPersonJson) => {
  if (person.nom || person.prenom) {
    return `${person.nom ?? ""} ${person.prenom ?? ""}`;
  }

  return person.email ?? person._id;
};

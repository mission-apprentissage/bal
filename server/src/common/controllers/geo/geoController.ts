import departements from "static/departements.json";

import {
  Adresse,
  Coordinates,
  getAddressFromGeoCoordinates,
  getGeoCoordinateFromAdresse,
  getMunicipality,
} from "./geoAdresseData";

export const findCode = async (code: string, codeInsee: string | null) => {
  try {
    const { records = [] } = await getMunicipality(code, codeInsee);
    if (records.length === 0) {
      return {
        info: "Erreur: Non trouvé",
        value: null,
      };
    }
    const {
      fields: { insee_com, code_dept, postal_code, nom_comm },
    } = records[0];
    const value = { insee_com, code_dept, postal_code, nom_comm };

    if (insee_com === code) {
      return {
        info: "Ok",
        update: `Le code ${code} est un code commune insee`,
        value,
      };
    }
    return {
      info: "Ok",
      value,
    };
  } catch (error) {
    return error;
  }
};

export const findDataByDepartementNum = (code_dept: string) => {
  const codeDepartement = code_dept as keyof typeof departements;
  const data = departements[codeDepartement];
  if (!data) {
    return { nom_dept: null, nom_region: null, code_region: null, nom_academie: null, num_academie: null };
  }

  const { nom_dept, nom_region, code_region, nom_academie, num_academie } = data;
  return { nom_dept, nom_region, code_region, nom_academie, num_academie };
};

export const findGeoCoordinateFromAdresse = async ({
  numero_voie,
  type_voie,
  nom_voie,
  code_postal,
  localite,
  code_insee,
}: Adresse) => {
  const { geo_coordonnees, results_count } = await getGeoCoordinateFromAdresse({
    numero_voie,
    type_voie,
    nom_voie,
    code_postal,
    localite,
    code_insee,
  });

  return {
    info: `Ok`,
    value: geo_coordonnees,
    count: results_count,
  };
};

export const findAddressFromGeoCoordinates = async ({ latitude, longitude }: Coordinates) => {
  const { address, results_count } = await getAddressFromGeoCoordinates({ latitude, longitude });
  return {
    info: `Ok`,
    value: address,
    count: results_count,
  };
};

export const isValidCodePostal = (codePostal: string) => {
  return /^[0-9]{5}$/g.test(codePostal);
};

/**
 * Le code commune Insee contient cinq chiffres ou lettres (Corse 2A - 2B)
 */
export const isValidCodeInsee = (codeInsee: string) => {
  return /^[a-zA-Z0-9]{5}$/g.test(codeInsee);
};

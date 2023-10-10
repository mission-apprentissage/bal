import { reverse, search, searchMunicipalityByCode } from "../../apis/adresse";

const getAddress = (
  numero_voie?: string,
  type_voie?: string,
  nom_voie?: string,
  code_postal?: string,
  localite?: string,
  code_insee?: string
) => {
  return `${
    code_insee
      ? `https://api-adresse.data.gouv.fr/search/?q=${numero_voie ? numero_voie + "+" : ""}${
          type_voie ? type_voie + "+" : ""
        }+${nom_voie ? nom_voie : ""}&citycode=${code_insee} or `
      : ""
  }https://api-adresse.data.gouv.fr/search/?q=${numero_voie ? numero_voie + "+" : ""}${
    type_voie ? type_voie + "+" : ""
  }+${nom_voie ? nom_voie : ""}&postcode=${code_postal} - ${localite} `;
};

// le code postal 75116 ne remonte rien, il doit être remplacé par 75016
const refinePostcode = (postcode: string) => {
  switch (postcode) {
    case "75116":
      return "75016";
    case "97142":
      return "97139";
    default:
      return postcode;
  }
};

export interface Adresse {
  numero_voie?: string;
  type_voie?: string;
  nom_voie?: string;
  code_postal?: string;
  localite?: string;
  code_insee?: string;
}

export const getGeoCoordinateFromAdresse = async ({
  numero_voie,
  type_voie,
  nom_voie,
  code_postal,
  localite,
  code_insee,
}: Adresse) => {
  // première tentative de recherche sur rue et code postal

  if (code_postal === "97133") {
    //TODO: hardcoded à supprimer quand la BAN remontera correctement les adresse du cp 97133 pour "Saint Barthélémy"
    // cas particulier concernant un unique college à saint barth'
    return {
      geo_coordonnees: "17.896279,-62.849772", // format "lat,long"
      results_count: 1,
    };
  }

  if (!code_postal) {
    console.info(
      `No postcode for establishment.\t${getAddress(
        numero_voie,
        type_voie,
        nom_voie,
        code_postal,
        localite,
        code_insee
      )}`
    );
    return {
      geo_coordonnees: null,
      results_count: 0,
    };
  }

  let responseApiAdresse;
  const query = `${numero_voie ? numero_voie + "+" : ""}${type_voie ? type_voie + "+" : ""}${nom_voie ? nom_voie : ""}`;
  // première recherche sur code insee
  if (code_insee) {
    try {
      responseApiAdresse = await search(query, { citycode: code_insee });
    } catch (error) {
      console.error(`geo search error : ${query} ${code_insee} ${error}`);
      responseApiAdresse = null;
    }
  }

  if (!responseApiAdresse || responseApiAdresse.features.length === 0) {
    if (code_insee) {
      console.info(`Second geoloc call with postcode\t${code_postal}`);
    }
    const postcode = refinePostcode(code_postal);
    try {
      responseApiAdresse = await search(query, { postcode });
    } catch (error) {
      console.error(`geo search error : ${query} ${postcode} ${error}`);
      responseApiAdresse = null;
    }
  }

  // si pas de réponse troisième recherche sur ville et code postal
  if (!responseApiAdresse || responseApiAdresse.features.length === 0) {
    console.info(`${code_insee ? "Third" : "Second"} geoloc call with postcode and city\t${localite} ${code_postal}`);
    const query = `${localite ? localite : "a"}`; // hack si localite absente
    const postcode = refinePostcode(code_postal);

    try {
      responseApiAdresse = await search(query, { postcode });
    } catch (error) {
      console.error(`geo search error : ${query} ${postcode} ${error}`);
      responseApiAdresse = null;
    }
  }

  if (!responseApiAdresse)
    return {
      geo_coordonnees: null,
      results_count: 0,
    };

  if (responseApiAdresse.features.length === 0) {
    console.info(
      `No geoloc result for establishment.\t${getAddress(
        numero_voie,
        type_voie,
        nom_voie,
        code_postal,
        localite,
        code_insee
      )}`
    );
    return {
      geo_coordonnees: null,
      results_count: 0,
    };
  }

  // signalement des cas avec ambiguité
  if (responseApiAdresse.features.length > 1) {
    console.info(
      `Multiple geoloc results for establishment.\t${getAddress(
        numero_voie,
        type_voie,
        nom_voie,
        code_postal,
        localite,
        code_insee
      )}\t${responseApiAdresse.features[0].properties.label} ${responseApiAdresse.features[0].properties.postcode}`
    );
  }

  const geojson = { ...responseApiAdresse };

  return {
    geo_coordonnees: `${geojson.features[0].geometry.coordinates[1]},${geojson.features[0].geometry.coordinates[0]}`, // format "lat,long"
    results_count: geojson.features.length,
  };
};

interface Municipality {
  citycode: string;
  postcode: string;
  city: string;
  context: string;
}

const formatMunicipality = ({ properties }: { properties: Municipality }) => {
  return {
    fields: {
      insee_com: properties.citycode,
      postal_code: properties.postcode,
      nom_comm: properties.city,
      code_dept: properties.context.split(",")[0],
    },
  };
};

/**
 * Format the results of apiGeoAdresse.searchMunicipalityByCode calls
 */
const formatMunicipalityResponse = async (data: any) => {
  const records = data.features.map(formatMunicipality);

  return {
    records,
  };
};

/**
 * Retrieve a municipality by postal code or insee code
 */
export const getMunicipality = async (code: string, codeInsee: string | null) => {
  const refinedCode = refinePostcode(code);

  // try to find results by postal code & citycode (insee)
  if (codeInsee) {
    try {
      const data = await searchMunicipalityByCode(refinedCode, { codeInsee });
      if (data.features && data.features.length > 0) {
        return formatMunicipalityResponse(data);
      }
    } catch (e) {
      console.error("geo search municipality error", e);
    }
  }

  // try to find results by postal code
  try {
    const data = await searchMunicipalityByCode(refinedCode);
    if (data.features && data.features.length > 0) {
      return formatMunicipalityResponse(data);
    }
  } catch (e) {
    console.error("geo search municipality error", e);
  }

  try {
    // try to find results by citycode (insee)
    const data = await searchMunicipalityByCode(refinedCode, { isCityCode: true });
    if (data.features && data.features.length > 0) {
      return formatMunicipalityResponse(data);
    }
  } catch (e) {
    console.error("geo search municipality error", e);
  }

  return {};
};

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export const getAddressFromGeoCoordinates = async ({ latitude, longitude }: Coordinates) => {
  try {
    const data = await reverse(longitude, latitude, { type: "housenumber" });

    if (!(data.features?.length > 0)) {
      return {
        address: null,
        results_count: 0,
      };
    }

    if (data.features.length > 1) {
      console.info("Multiple results for lat,lon: ", latitude, longitude);
    }

    const { properties } = data.features[0];
    const { housenumber = "", street = "" } = properties;
    const [type_voie, ...rest] = street.split(" ");
    let nom_voie = rest.join(" ");

    // handle edge case where api adresse sends a street instead of a housenumber
    if (properties.type === "street") {
      nom_voie = properties.name;
    }

    return {
      address: {
        ...formatMunicipality({ properties }).fields,
        numero_voie: housenumber,
        type_voie,
        nom_voie,
      },
      results_count: data.features.length,
    };
  } catch (e) {
    console.error("geo reverse error", e);
  }

  return {
    address: null,
    results_count: 0,
  };
};

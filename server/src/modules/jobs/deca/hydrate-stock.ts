import { createReadStream } from "node:fs";

import { oleoduc, writeData } from "oleoduc";
import { JsonObject } from "type-fest";

import { getStaticFilePath } from "../../../common/utils/getStaticFilePath";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { parseCsv } from "../../../common/utils/parserUtils";

export const hydrateStockDeca = async () => {
  await oleoduc(
    createReadStream(getStaticFilePath("./assets/Export_Init_TBA_202310191045.csv")),
    parseCsv({
      delimiter: ",",
    }),
    writeData(async (line: JsonObject) => {
      const outputTDB = {
        alternant: {
          nom: line.nom,
          prenom: line.prenom,
          sexe: line.sexe,
          date_naissance: line.datenaissance,
          departement_naissance: line.departementnaissance,
          // @ts-expect-error
          ...(line.nationalite && !isNaN(line.nationalite) ? { nationalite: parseInt(line.nationalite) } : {}),
          handicap: line.handicap === "true" ? true : false,
          ...(line.courriel ? { courriel: line.courriel } : {}),
          ...(line.telephone ? { telephone: line.telephone } : {}),
          adresse: {
            // @ts-expect-error
            ...(line.adressenumero ? { numero: parseInt(line.adressenumero) } : {}),
            ...(line.adressevoie ? { voie: line.adressevoie } : {}),
            ...(line.adressecodepostal ? { code_postal: line.adressecodepostal } : {}),
          },
          ...(line.derniereclasse ? { derniere_classe: line.derniereclasse } : {}),
        },
        formation: {
          ...(line.datedebutformation ? { date_debut_formation: line.datedebutformation } : {}),
          ...(line.datefinformation ? { date_fin_formation: line.datefinformation } : {}),
          ...(line.codediplome ? { code_diplome: line.codediplome } : {}),
          ...(line.intituleouqualification ? { intitule_ou_qualification: line.intituleouqualification } : {}),
          ...(line.rncp ? { rncp: line.rncp } : {}),
        },
        ...(line.siret
          ? {
              etablissement_formation: {
                siret: line.siret,
              },
            }
          : {}),
        organisme_formation: {
          ...(line.uaicfa ? { uai_cfa: line.uaicfa } : {}),
          ...(line.siretcfa ? { siret: line.siretcfa } : {}),
        },
        ...(line.dateeffetrupture
          ? {
              rupture: {
                date_effet_rupture: line.dateeffetrupture,
              },
            }
          : {}),
        details_contrat: {
          no_contrat: line.nocontrat,
          date_debut_contrat: line.datedebutcontrat,
          date_fin_contrat: line.datefincontrat,
          ...(line.dateeffetavenant ? { date_effet_avenant: line.dateeffetavenant } : {}),
          ...(line.noavenant ? { no_avenant: line.noavenant } : {}),
          ...(line.statut ? { statut: line.statut } : {}),
          flag_correction: line.flagcorrection === "true" ? true : false,
          type_contrat: line.typecontrat,
          ...(line.datesuppression ? { date_suppression: line.datesuppression } : {}),
          ...(line.rupture_avant_debut
            ? { rupture_avant_debut: line.rupture_avant_debut === "true" ? true : false }
            : {}),
        },
        employeur: {
          ...(line.codeidcc ? { code_idcc: line.codeidcc } : {}),
        },
      };

      await getDbCollection("contratsDeca").findOneAndUpdate(
        {
          "details_contrat.no_contrat": line.nocontrat,
          "details_contrat.type_contrat": line.typecontrat,
        },
        { $set: outputTDB },
        {
          upsert: true,
        }
      );
    })
  );
  console.log(" - LBA - ");
  await oleoduc(
    createReadStream(getStaticFilePath("./assets/Export_Init_LBA_202310191045.csv")),
    parseCsv({
      delimiter: ",",
    }),
    writeData(async (line: JsonObject) => {
      const outputLBA = {
        alternant: {
          nom: line.nom,
          prenom: line.prenom,
          date_naissance: line.datenaissance,
          handicap: line.handicap === "true" ? true : false,
          ...(line.courrielalternant ? { courriel: line.courrielalternant } : {}),
          ...(line.telephone ? { telephone: line.telephone } : {}),
          adresse: {
            // @ts-expect-error
            ...(line.adressenumero ? { numero: parseInt(line.adressenumero) } : {}),
            ...(line.adressevoie ? { voie: line.adressevoie } : {}),
          },
          ...(line.derniereclasse ? { derniere_classe: line.derniereclasse } : {}),
        },
        organisme_formation: {
          ...(line.uaicfa ? { uai_cfa: line.uaicfa } : {}),
          ...(line.siretcfa ? { siret: line.siretcfa } : {}),
        },
        formation: {
          ...(line.typediplome ? { type_diplome: line.typediplome } : {}),
          ...(line.codediplome ? { code_diplome: line.codediplome } : {}),
          ...(line.intituleouqualification ? { intitule_ou_qualification: line.intituleouqualification } : {}),
          ...(line.rncp ? { rncp: line.rncp } : {}),
        },
        ...(line.dateeffetrupture
          ? {
              rupture: {
                date_effet_rupture: line.dateeffetrupture,
              },
            }
          : {}),
        employeur: {
          siret: line.siretemployeur,
          adresse: {
            ...(line.adressecodepostal ? { code_postal: line.adressecodepostal } : {}),
          },
          ...(line.naf ? { naf: line.naf } : {}),
          ...(line.codeidcc ? { code_idcc: line.codeidcc } : {}),
          ...(line.nombredesalaries ? { nombre_de_salaries: line.nombredesalaries } : {}),
          ...(line.courrielemployeur ? { courriel: line.courrielemployeur } : {}),
          ...(line.telephone ? { telephone: line.telephone } : {}),
          ...(line.denomination ? { denomination: line.denomination } : {}),
        },
        details_contrat: {
          no_contrat: line.nocontrat,
          dispositif: line.dispositif,
          date_debut_contrat: line.datedebutcontrat,
          date_fin_contrat: line.datefincontrat,
          ...(line.dateeffetavenant ? { date_effet_avenant: line.dateeffetavenant } : {}),
          ...(line.noavenant ? { no_avenant: line.noavenant } : {}),
          ...(line.statut ? { statut: line.statut } : {}),
          flag_correction: line.flagcorrection === "true" ? true : false,
          type_contrat: line.typecontrat,
          ...(line.datesuppression ? { date_suppression: line.datesuppression } : {}),
          ...(line.rupture_avant_debut
            ? { rupture_avant_debut: line.rupture_avant_debut === "true" ? true : false }
            : {}),
        },
      };
      await getDbCollection("contratsDeca").findOneAndUpdate(
        {
          "details_contrat.no_contrat": line.nocontrat,
          "details_contrat.type_contrat": line.typecontrat,
        },
        { $set: outputLBA },
        {
          upsert: true,
        }
      );
    })
  );
};
/*
TDB
.updateMany(
  {},
  {
    $rename: {
      "nom": "alternant.nom",
      "prenom": "alternant.prenom",
      "sexe": "alternant.sexe",
      "datenaissance": "alternant.date_naissance",
      "departementnaissance": "alternant.departement_naissance",
      "nationalite": "alternant.nationalite",
      "handicap": "alternant.handicap",
      "courriel": "alternant.courriel",
      "telephone": "alternant.telephone",
      "derniereclasse": "alternant.derniere_classe",
      "adressenumero": "alternant.adresse.numero",
      "adressevoie": "alternant.adresse.voie",
      "adressecodepostal": "alternant.adresse.code_postal",

      "datedebutformation": "formation.date_debut_formation",
      "datefinformation": "formation.date_fin_formation",
      "datefinformation": "formation.date_fin_formation",
      "codediplome": "formation.code_diplome",
      "intituleouqualification": "formation.intitule_ou_qualification",
      "rncp": "formation.rncp",

      "siret": "etablissement_formation.siret",

      "uaicfa": "organisme_formation.uai_cfa",
      "siretcfa": "organisme_formation.siret",

      "codeidcc": "employeur.code_idcc",


      "nocontrat": "no_contrat",
      "datedebutcontrat": "date_debut_contrat",
      "datefincontrat": "date_fin_contrat",
      "dateeffetavenant": "date_effet_avenant",
      "dateeffetrupture": "date_effet_rupture",
      "datesuppression": "date_suppression",
      "noavenant": "no_avenant",
      "flagcorrection": "flag_correction",
      "typecontrat": "type_contrat",
    },
  }
);

*/

/*
LBA
.updateMany(
  {},
  {
    $rename: {
      "nom": "alternant.nom",
      "prenom": "alternant.prenom",
      "datenaissance": "alternant.date_naissance",
      "handicap": "alternant.handicap",
      "courrielalternant": "alternant.courriel",
      "derniereclasse": "alternant.derniere_classe",
      "adressenumero": "alternant.adresse.numero",
      "adressevoie": "alternant.adresse.voie",

      "typediplome": "formation.type_diplome",
      "codediplome": "formation.code_diplome",
      "intituleouqualification": "formation.intitule_ou_qualification",
      "rncp": "formation.rncp",

      "uaicfa": "organisme_formation.uai_cfa",
      "siretcfa": "organisme_formation.siret",

      "siretemployeur": "employeur.siret",
      "naf": "employeur.naf",
      "codeidcc": "employeur.code_idcc",
      "nombredesalaries": "employeur.nombre_de_salaries",
      "courrielemployeur": "employeur.courriel",
      "telephone": "employeur.telephone",
      "denomination": "employeur.denomination",
      "adressecodepostal": "employeur.adresse.code_postal",


      "nocontrat": "no_contrat",
      "datedebutcontrat": "date_debut_contrat",
      "datefincontrat": "date_fin_contrat",
      "dateeffetavenant": "date_effet_avenant",
      "dateeffetrupture": "date_effet_rupture",
      "datesuppression": "date_suppression",
      "noavenant": "no_avenant",
      "flagcorrection": "flag_correction",
      "typecontrat": "type_contrat",

    },
  }
);
*/

// .aggregate([
//   { $unwind: "$lba" },
//   { $unwind: "$tdb" },
//   {
//     $project: {
//       something: "$lba.something",
//       _id: 0,
//       someField: 1,
//     },
//   },
//   { $out: "deca" },
// ])
// { $merge: { into: "deca", on: "no_contrat", whenMatched: "replace" } }

// .aggregate( [
//   { $merge:
//   {
//     into: "deca",
//     on: ["no_contrat", "type_contrat",  "alternant.date_naissance"],
//     whenMatched: [
//       {
//         $addFields: {
//           alternant: {
//             $mergeObjects: [
//               "$alternant",
//               "$$new.alternant",
//             ],
//           },
//           employeur: {
//             $mergeObjects: [
//               "$employeur",
//               "$$new.employeur",
//             ],
//           },
//           formation: {
//             $mergeObjects: [
//               "$formation",
//               "$$new.formation",
//             ],
//           },
//           organisme_formation: {
//             $mergeObjects: [
//               "$organisme_formation",
//               "$$new.organisme_formation",
//             ],
//           },
//           etablissement_formation: {
//             $mergeObjects: [
//               "$etablissement_formation",
//               "$$new.etablissement_formation",
//             ],
//           },
//         },
//       },
//       {
//         $replaceRoot: {
//           newRoot: {
//             $mergeObjects: ["$$new", "$$ROOT"],
//           },
//         },
//       },
//     ],
//     whenNotMatched: "insert"
//   }
// }
// ] )

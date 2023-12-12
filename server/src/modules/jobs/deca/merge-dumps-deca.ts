import { getDbCollection } from "../../../common/utils/mongodbUtils";

// history 68 235
// from 4 355 923
// to   4 525 415
// yarn cli indexes:recreate
// mongoimport --uri "mongodb://__system:password@localhost:27017/?authSource=local&directConnection=true" -d "mna-bal" -c deca --jsonArray --file ./mna-bal.deca.json
// yarn cli db:validate
// add deca_lba deca_tdb deca_tmp
// mongoimport --uri "mongodb://__system:password@localhost:27017/?authSource=local&directConnection=true" -d "mna-bal" -c deca_tmp --jsonArray --file ./mna-bal.deca.json
// Import "2023-11 Extraction LBA initialisation.csv" dans deca_lba
// Import "2023-11_extraction_tba_initialisation.csv" dans deca_tdb
// Run History in parrallel "yarn cli deca:history"
// Run merge "yarn cli deca:merge"
export const mergeDecaDumps = async () => {
  // PREPARE COLLECTIONS
  // await stageLBA();
  // await stageTDB();
  // CREATE INDEXES
  // // @ts-expect-error
  // await getDbCollection("deca_tmp").createIndex(
  //   { no_contrat: 1, type_contrat: 1, "alternant.nom": 1 },
  //   { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" }
  // );
  // // @ts-expect-error
  // await getDbCollection("deca_lba").createIndex(
  //   { no_contrat: 1, type_contrat: 1, "alternant.nom": 1 },
  //   { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" }
  // );
  // // @ts-expect-error
  // await getDbCollection("deca_tdb").createIndex(
  //   { no_contrat: 1, type_contrat: 1, "alternant.nom": 1 },
  //   { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" }
  // );
  // MERGE INTO
  // await mergeCollections({ from: "deca_lba", to: "deca_tmp" });
  // await mergeCollections({ from: "deca_tdb", to: "deca_tmp" });
  // await mergeCollections({ from: "deca_tmp", to: "deca" });
};

// eslint-disable-next-line unused-imports/no-unused-vars
const stageLBA = async () => {
  await reKeyField("deca_lba", "nocontrat", "no_contrat");
  await reKeyField("deca_lba", "noavenant", "no_avenant");
  await reKeyField("deca_lba", "typecontrat", "type_contrat");
  await reKeyField("deca_lba", "flagcorrection", "flag_correction");
  await reKeyField("deca_lba", "datedebutcontrat", "date_debut_contrat");
  await reKeyField("deca_lba", "datefincontrat", "date_fin_contrat");
  await reKeyField("deca_lba", "dateeffetrupture", "date_effet_rupture");
  await reKeyField("deca_lba", "dateeffetavenant", "date_effet_avenant");
  await reKeyField("deca_lba", "intituleouqualification", "formation.intitule_ou_qualification");
  await reKeyField("deca_lba", "rncp", "formation.rncp");
  await reKeyField("deca_lba", "codediplome", "formation.code_diplome");
  await reKeyField("deca_lba", "typediplome", "formation.type_diplome");
  await reKeyField("deca_lba", "siretcfa", "organisme_formation.siret");
  await reKeyField("deca_lba", "uaicfa", "organisme_formation.uai_cfa");
  await reKeyField("deca_lba", "courrielalternant", "alternant.courriel");
  await reKeyField("deca_lba", "handicap", "alternant.handicap");
  await reKeyField("deca_lba", "datenaissance", "alternant.date_naissance");
  await reKeyField("deca_lba", "nom", "alternant.nom");
  await reKeyField("deca_lba", "prenom", "alternant.prenom");
  await reKeyField("deca_lba", "denomination", "employeur.denomination");
  await reKeyField("deca_lba", "telephone", "employeur.telephone");
  await reKeyField("deca_lba", "courrielemployeur", "employeur.courriel");
  await reKeyField("deca_lba", "nombredesalaries", "employeur.nombre_de_salaries");
  await reKeyField("deca_lba", "codeidcc", "employeur.code_idcc");
  await reKeyField("deca_lba", "naf", "employeur.naf");
  await reKeyField("deca_lba", "adressecodepostal", "employeur.adresse.code_postal");
  await reKeyField("deca_lba", "siretemployeur", "employeur.siret");
  await reKeyField("deca_lba", "datesuppression", "date_suppression");
  await reKeyField("deca_lba", "typeemployeur", "type_employeur");
  await reKeyField("deca_lba", "employeurspecifique", "employeur_specifique");
  await reKeyField("deca_lba", "typederogation", "type_derogation");

  await fixAfterRawImport("deca_lba");
};

// eslint-disable-next-line unused-imports/no-unused-vars
const stageTDB = async () => {
  await reKeyField("deca_tdb", "nom", "alternant.nom");
  await reKeyField("deca_tdb", "prenom", "alternant.prenom");
  await reKeyField("deca_tdb", "sexe", "alternant.sexe");
  await reKeyField("deca_tdb", "datenaissance", "alternant.date_naissance");
  await reKeyField("deca_tdb", "departementnaissance", "alternant.departement_naissance");
  await reKeyField("deca_tdb", "nationalite", "alternant.nationalite");
  await reKeyField("deca_tdb", "handicap", "alternant.handicap");
  await reKeyField("deca_tdb", "courriel", "alternant.courriel");
  await reKeyField("deca_tdb", "telephone", "alternant.telephone");
  await reKeyField("deca_tdb", "adressenumero", "alternant.adresse.numero");
  await reKeyField("deca_tdb", "adressevoie", "alternant.adresse.voie");
  await reKeyField("deca_tdb", "adressecodepostal", "alternant.adresse.code_postal");
  await reKeyField("deca_tdb", "derniereclasse", "alternant.derniere_classe");
  await reKeyField("deca_tdb", "datedebutformation", "formation.date_debut_formation");
  await reKeyField("deca_tdb", "datefinformation", "formation.date_fin_formation");
  await reKeyField("deca_tdb", "codediplome", "formation.code_diplome");
  await reKeyField("deca_tdb", "intituleouqualification", "formation.intitule_ou_qualification");
  await reKeyField("deca_tdb", "rncp", "formation.rncp");

  await reKeyField("deca_tdb", "codeidcc", "employeur.code_idcc");
  await reKeyField("deca_tdb", "typeemployeur", "type_employeur");
  await reKeyField("deca_tdb", "employeurspecifique", "employeur_specifique");

  await reKeyField("deca_tdb", "siret", "etablissement_formation.siret");
  await reKeyField("deca_tdb", "siretcfa", "organisme_formation.siret");
  await reKeyField("deca_tdb", "uaicfa", "organisme_formation.uai_cfa");

  await reKeyField("deca_tdb", "nocontrat", "no_contrat");
  await reKeyField("deca_tdb", "noavenant", "no_avenant");
  await reKeyField("deca_tdb", "typecontrat", "type_contrat");
  await reKeyField("deca_tdb", "flagcorrection", "flag_correction");
  await reKeyField("deca_tdb", "datedebutcontrat", "date_debut_contrat");
  await reKeyField("deca_tdb", "datefincontrat", "date_fin_contrat");
  await reKeyField("deca_tdb", "dateeffetrupture", "date_effet_rupture");
  await reKeyField("deca_tdb", "dateeffetavenant", "date_effet_avenant");
  await reKeyField("deca_tdb", "datesuppression", "date_suppression");

  await fixAfterRawImport("deca_tdb");
};

const fixAfterRawImport = async (dbname: string) => {
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({}, [
    {
      $set: {
        type_contrat: { $toString: "$type_contrat" },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "alternant.nationalite": { $exists: true } }, [
    {
      $set: {
        "alternant.nationalite": { $toInt: "$alternant.nationalite" },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "alternant.adresse.numero": { $exists: true } }, [
    {
      $set: {
        "alternant.adresse.numero": { $toString: "$alternant.adresse.numero" },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "alternant.adresse.code_postal": { $exists: true } }, [
    {
      $set: {
        "alternant.adresse.code_postal": { $toString: "$alternant.adresse.code_postal" },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.adresse.code_postal": { $exists: true } }, [
    {
      $set: {
        "employeur.adresse.code_postal": { $toString: "$employeur.adresse.code_postal" },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "alternant.derniere_classe": { $exists: true } }, [
    {
      $set: {
        "alternant.derniere_classe": { $toInt: "$alternant.derniere_classe" },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.nombre_de_salaries": { $exists: true } }, [
    {
      $set: {
        "employeur.nombre_de_salaries": { $toInt: "$employeur.nombre_de_salaries" },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ type_employeur: { $exists: true } }, [
    {
      $set: {
        type_employeur: { $toInt: "$type_employeur" },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ employeur_specifique: { $exists: true } }, [
    {
      $set: {
        employeur_specifique: { $toInt: "$employeur_specifique" },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ type_derogation: { $exists: true } }, [
    {
      $set: {
        type_derogation: { $toInt: "$type_derogation" },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { date_suppression: { $exists: true } },
    [
      {
        $set: {
          date_suppression: { $toDate: "$date_suppression" },
        },
      },
    ],
    {
      bypassDocumentValidation: true,
    }
  );
  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "alternant.nom": { $exists: false } },
    { $set: { "alternant.nom": "" } },
    { bypassDocumentValidation: true }
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "etablissement_formation.siret": { $exists: true, $not: { $regex: /^[0-9]{14}$/, $options: "si" } } },
    [
      {
        $set: {
          "etablissement_formation.siret": {
            $replaceAll: { input: "$etablissement_formation.siret", find: ".0", replacement: "" },
          },
        },
      },
    ]
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "etablissement_formation.siret": { $regex: /^[0-9]{13}$/, $options: "si" } },
    [
      {
        $set: {
          "etablissement_formation.siret": { $concat: ["0", "$etablissement_formation.siret"] },
        },
      },
    ]
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "organisme_formation.siret": { $exists: true, $not: { $regex: /^[0-9]{14}$/, $options: "si" } } },
    [
      {
        $set: {
          "organisme_formation.siret": {
            $replaceAll: { input: "$organisme_formation.siret", find: ".0", replacement: "" },
          },
        },
      },
    ]
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "organisme_formation.siret": { $regex: /^[0-9]{13}$/, $options: "si" } }, [
    {
      $set: {
        "organisme_formation.siret": { $concat: ["0", "$organisme_formation.siret"] },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.code_idcc": { $regex: /\.0$/, $options: "si" } }, [
    {
      $set: {
        "employeur.code_idcc": {
          $replaceAll: { input: "$employeur.code_idcc", find: ".0", replacement: "" },
        },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.code_idcc": { $regex: /^0$/, $options: "si" } }, [
    {
      $set: {
        "employeur.code_idcc": "0000",
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.code_idcc": { $regex: /^[0-9]{3}$/, $options: "si" } }, [
    {
      $set: {
        "employeur.code_idcc": { $concat: ["0", "$employeur.code_idcc"] },
      },
    },
  ]);
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.code_idcc": { $regex: /^[0-9]{2}$/, $options: "si" } }, [
    {
      $set: {
        "employeur.code_idcc": { $concat: ["00", "$employeur.code_idcc"] },
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "employeur.adresse.code_postal": { $regex: /^[0-9A-Ba-b]{4}$/, $options: "si" } },
    [
      {
        $set: {
          "employeur.adresse.code_postal": { $concat: ["0", "$employeur.adresse.code_postal"] },
        },
      },
    ]
  );
  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "employeur.adresse.code_postal": { $regex: /^[0-9A-Ba-b]{3}$/, $options: "si" } },
    [
      {
        $set: {
          "employeur.adresse.code_postal": { $concat: ["00", "$employeur.adresse.code_postal"] },
        },
      },
    ]
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany(
    { "employeur.siret": { $exists: true, $not: { $regex: /^[0-9]{14}$/, $options: "si" } } },
    [
      {
        $set: {
          "employeur.siret": {
            $replaceAll: { input: "$employeur.siret", find: ".0", replacement: "" },
          },
        },
      },
    ]
  );

  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ "employeur.siret": { $regex: /^[0-9]{13}$/, $options: "si" } }, [
    {
      $set: {
        "employeur.siret": { $concat: ["0", "$employeur.siret"] },
      },
    },
  ]);
};

const reKeyField = async (dbname: string, oldName: string, newName: string) => {
  // @ts-expect-error
  await getDbCollection(dbname).updateMany({ [oldName]: { $exists: true } }, [
    {
      $set: {
        [newName]: `$${oldName}`,
      },
    },
    {
      $unset: [`${oldName}`],
    },
  ]);
};

// eslint-disable-next-line unused-imports/no-unused-vars
const mergeCollections = async ({ from, to }: { from: string; to: string }) => {
  // @ts-expect-error
  await getDbCollection(from).aggregate([
    {
      $merge: {
        into: to,
        on: ["no_contrat", "type_contrat", "alternant.nom"],
        whenMatched: [
          {
            $addFields: {
              alternant: {
                $mergeObjects: ["$alternant", "$$new.alternant"],
              },
              employeur: {
                $mergeObjects: ["$employeur", "$$new.employeur"],
              },
              formation: {
                $mergeObjects: ["$formation", "$$new.formation"],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$$new", "$$ROOT"],
              },
            },
          },
        ],
        whenNotMatched: "insert",
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(from).aggregate([
    {
      $match: {
        etablissement_formation: { $exists: true },
      },
    },
    {
      $merge: {
        into: to,
        on: ["no_contrat", "type_contrat", "alternant.nom"],
        whenMatched: [
          {
            $addFields: {
              etablissement_formation: {
                $mergeObjects: ["$etablissement_formation", "$$new.etablissement_formation"],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$$new", "$$ROOT"],
              },
            },
          },
        ],
        whenNotMatched: "insert",
      },
    },
  ]);

  // @ts-expect-error
  await getDbCollection(from).aggregate([
    {
      $match: {
        organisme_formation: { $exists: true },
      },
    },
    {
      $merge: {
        into: to,
        on: ["no_contrat", "type_contrat", "alternant.nom"],
        whenMatched: [
          {
            $addFields: {
              organisme_formation: {
                $mergeObjects: ["$organisme_formation", "$$new.organisme_formation"],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$$new", "$$ROOT"],
              },
            },
          },
        ],
        whenNotMatched: "insert",
      },
    },
  ]);
};

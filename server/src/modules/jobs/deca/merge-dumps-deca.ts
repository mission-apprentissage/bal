import { getDbCollection } from "../../../common/utils/mongodbUtils";

// 4355923
// mongoimport --uri "mongodb://__system:password@localhost:27017/?authSource=local&directConnection=true" -d "mna-bal" -c deca --jsonArray --file ./mna-bal.deca.json
// Import "2023-11 Extraction LBA initialisation.csv" dans deca_lba
// Import "2023-11_extraction_tba_initialisation.csv" dans deca_tdb
// Run merge "yarn cli deca:merge"
export const mergeDecaDumps = async () => {
  await stageLBA();

  await stageTDB();

  // // @ts-expect-error
  // await getDbCollection("deca_lba").aggregate([
  //   {
  //     $merge: {
  //       into: "deca",
  //       on: ["no_contrat", "type_contrat", "alternant.nom"],
  //       whenMatched: [
  //         {
  //           $addFields: {
  //             alternant: {
  //               $mergeObjects: ["$alternant", "$$new.alternant"],
  //             },
  //             employeur: {
  //               $mergeObjects: ["$employeur", "$$new.employeur"],
  //             },
  //             formation: {
  //               $mergeObjects: ["$formation", "$$new.formation"],
  //             },
  //             etablissement_formation: {
  //               $mergeObjects: ["$etablissement_formation", "$$new.etablissement_formation"],
  //             },
  //             organisme_formation: {
  //               $mergeObjects: ["$organisme_formation", "$$new.organisme_formation"],
  //             },
  //           },
  //         },
  //         {
  //           $replaceRoot: {
  //             newRoot: {
  //               $mergeObjects: ["$$new", "$$ROOT"],
  //             },
  //           },
  //         },
  //       ],
  //       whenNotMatched: "insert",
  //     },
  //   },
  // ]);
};

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

const stageTDB = async () => {
  // await fixAfterRawImport("deca_tdb");
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
  await getDbCollection(dbname).updateMany({ nombre_de_salaries: { $exists: true } }, [
    {
      $set: {
        nombre_de_salaries: { $toInt: "$nombre_de_salaries" },
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

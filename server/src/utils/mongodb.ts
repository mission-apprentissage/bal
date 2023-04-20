import { CollectionInfo, MongoClient } from "mongodb";
import omitDeep from "omit-deep";

import { IModelDescriptor } from "../db/models";
import logger from "./logger";

/** @type {MongoClient} */
let mongodbClient: MongoClient;

const ensureInitialization = () => {
  if (!mongodbClient) {
    throw new Error(
      "Database connection does not exist. Please call connectToMongodb before."
    );
  }
};

/**
 * @param  {string} uri
 * @returns client
 */
export const connectToMongodb = async (uri: string) => {
  const client = new MongoClient(uri);

  await client.connect();
  mongodbClient = client;
  logger.info("Connected to MongoDB");

  return client;
};

export const closeMongodbConnection = () => {
  ensureInitialization();
  return mongodbClient.close();
};

export const getDatabase = () => {
  ensureInitialization();
  return mongodbClient.db();
};

export const getDbCollection = (name: string) => {
  ensureInitialization();
  return mongodbClient.db().collection(name);
};

export const getDbCollectionIndexes = async (name: string) => {
  ensureInitialization();
  return await mongodbClient.db().collection(name).indexes();
};

/**
 * Création d'une collection si elle n'existe pas
 * @param {string} collectionName
 */
const createCollectionIfDoesNotExist = async (collectionName: string) => {
  const db = getDatabase();
  const collectionsInDb = await db.listCollections().toArray();
  const collectionExistsInDb = collectionsInDb
    .map(({ name }) => name)
    .includes(collectionName);

  if (!collectionExistsInDb) {
    await db.createCollection(collectionName);
  }
};

/**
 * Vérification de l'existence d'une collection à partir de la liste des collections
 * @param {*} collectionsInDb
 * @param {*} collectionName
 * @returns
 */
export const collectionExistInDb = (
  collectionsInDb: CollectionInfo[],
  collectionName: string
) =>
  collectionsInDb
    .map(({ name }: { name: string }) => name)
    .includes(collectionName);

/**
 * Conversion du schema pour le format mongoDB
 */
const convertSchemaToMongoSchema = (schema: unknown) => {
  let replacedTypes = JSON.parse(
    JSON.stringify(schema)
      .replaceAll("type", "bsonType")
      .replaceAll("boolean", "bool")
      .replaceAll("integer", "int")
  );

  // remplacer _id de "string" à "objectId"
  replacedTypes = {
    ...replacedTypes,
    properties: {
      ...replacedTypes.properties,
      _id: { bsonType: "objectId" },
    },
  };

  // strip example field because NON STANDARD jsonSchema
  return omitDeep(replacedTypes, ["example", "format"]);
};

/**
 * Config de la validation
 * @param {*} modelDescriptors
 */
export const configureDbSchemaValidation = async (
  modelDescriptors: IModelDescriptor[]
) => {
  const db = getDatabase();
  ensureInitialization();
  await Promise.all(
    modelDescriptors.map(async ({ collectionName, schema }) => {
      await createCollectionIfDoesNotExist(collectionName);

      if (!schema) {
        return;
      }

      const convertedSchema = convertSchemaToMongoSchema(schema);

      try {
        await db.command({
          collMod: collectionName,
          validationLevel: "strict",
          validationAction: "error",
          validator: {
            $jsonSchema: {
              title: `${collectionName} validation schema`,
              ...convertedSchema,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    })
  );
};

/**
 * Clear de toutes les collections
 * @returns
 */
export const clearAllCollections = async () => {
  const collections = await getDatabase().collections();
  return Promise.all(collections.map((c) => c.deleteMany({})));
};

/**
 * Clear d'une collection
 * @param {string} name
 * @returns
 */
export async function clearCollection(name: string) {
  ensureInitialization();
  await getDatabase().collection(name).deleteMany({});
}

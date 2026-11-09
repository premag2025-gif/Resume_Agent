import { env } from "./env";
import { Db, MongoClient } from "mongodb";

export const databaseConfig = {
  uri: env.mongodbUri,
  name: env.mongodbDbName
};

let client: MongoClient | undefined;
let connectionPromise: Promise<Db> | undefined;

export function getDatabase(): Promise<Db> {
  if (connectionPromise) {
    return connectionPromise;
  }

  if (!databaseConfig.uri) {
    return Promise.reject(new Error("MONGODB_URI is not configured"));
  }

  const newClient = new MongoClient(databaseConfig.uri);
  client = newClient;
  connectionPromise = newClient.connect()
    .then(() => newClient.db(databaseConfig.name))
    .catch(async (error: unknown) => {
      connectionPromise = undefined;
      client = undefined;
      await newClient.close().catch(() => undefined);
      throw error;
    });

  return connectionPromise;
}
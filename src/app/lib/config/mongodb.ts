import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';
import data from '../config/mainConfig.json';
import { ensureMongoIndexes } from './mongodbIndexes';

const options: MongoClientOptions = data.databases.mongodb || {};

const client = new MongoClient(process.env.MONGODB_URI || '', options);
attachDatabasePool(client);

let isConnected = false;

/**
 * Return a connected MongoClient singleton.
 *
 * This function ensures the client is connected once and reused across
 * requests. We also attach the database pool for Vercel function environments.
 *
 * @returns Promise resolving to the configured MongoClient
 */
export default async function getClient(): Promise<MongoClient> {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('MongoDB connected successfully');
    await ensureMongoIndexes(client);
  }
  return client;
}
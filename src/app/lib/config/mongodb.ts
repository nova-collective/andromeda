import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';
import data from '../config/mainConfig.json';

const options: MongoClientOptions = data.databases.mongodb || {};

const client = new MongoClient(process.env.MONGODB_URI || '', options);
attachDatabasePool(client);

let isConnected = false;

export default async function getClient() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('MongoDB connected successfully');
  }
  return client;
}
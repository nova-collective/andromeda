import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const options: MongoClientOptions = {
  appName: "andromeda",
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 5000
};

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
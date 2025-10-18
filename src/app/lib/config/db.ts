import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || '';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

declare global {
  // store a cached connection on the global object to avoid
  // creating multiple connections in development hot-reloads
  // the types below reference the mongoose module type directly
  // to avoid circular `typeof mongoose` resolution inside the
  // declaration merging scope.
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  } | undefined;
}

type MongooseCache = { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null };

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
cached = global.mongoose as MongooseCache;

async function dbConnect(): Promise<typeof import('mongoose')> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Db connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
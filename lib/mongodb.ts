// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri: any = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient instance is not recreated every time.
  const globalWithAny = global as any;
  if (!globalWithAny._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithAny._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithAny._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

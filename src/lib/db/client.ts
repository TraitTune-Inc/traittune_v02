import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) return db;

  try {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db('traittune');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('requests').createIndex({ userId: 1 });
    await db.collection('requests').createIndex({ type: 1 });
    await db.collection('requests').createIndex({ status: 1 });
    
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}
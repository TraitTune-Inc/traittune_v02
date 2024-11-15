import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from '../../../lib/auth';

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession();
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // Remove session
    await db.collection('sessions').deleteOne({
      userId: session.user.id,
    });

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  } finally {
    await mongoClient.close();
  }
}
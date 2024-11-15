import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../lib/auth';
import clientPromise from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db();

      const result = await db.collection('requests').insertOne(req.body);

      res.status(201).json({ requestId: result.insertedId });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
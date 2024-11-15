import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../lib/auth';
import clientPromise from '../../lib/mongodb';
import { generateSummary } from '../../lib/openai';

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
      const { requestId, moduleNumber, moduleData } = req.body;

      // Generate summary using OpenAI
      const summary = await generateSummary(moduleData, moduleNumber);

      // Save summary to database
      const client = await clientPromise;
      const db = client.db();

      await db.collection('requests').updateOne(
        { _id: requestId },
        {
          $set: {
            [`moduleData.module${moduleNumber}.summary`]: summary,
            updatedAt: new Date(),
          },
        }
      );

      res.status(200).json({ summary });
    } catch (error) {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
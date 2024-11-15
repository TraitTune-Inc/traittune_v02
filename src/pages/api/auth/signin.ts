import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // Find or create user
    let user = await db.collection('users').findOne({ email: payload.email });
    
    if (!user) {
      const result = await db.collection('users').insertOne({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        createdAt: new Date(),
      });

      user = {
        _id: result.insertedId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    }

    // Generate session token
    const sessionToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update user's session
    await db.collection('sessions').updateOne(
      { userId: new ObjectId(user._id) },
      {
        $set: {
          token: sessionToken,
          lastActivity: new Date(),
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.picture,
      },
      token: sessionToken,
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  } finally {
    await mongoClient.close();
  }
}
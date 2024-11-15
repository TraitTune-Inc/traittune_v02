import { ObjectId } from 'mongodb';
import { connectToDatabase } from './client';
import { Request } from './models';

export async function createRequest(request: Omit<Request, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await connectToDatabase();
  
  const now = new Date();
  const newRequest = {
    ...request,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('requests').insertOne(newRequest);
  return { ...newRequest, _id: result.insertedId };
}

export async function getRequestsByUserId(userId: ObjectId) {
  const db = await connectToDatabase();
  return db.collection('requests')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getRequestById(requestId: string) {
  const db = await connectToDatabase();
  return db.collection('requests').findOne({
    _id: new ObjectId(requestId)
  });
}

export async function updateRequest(
  requestId: string,
  update: Partial<Request>
) {
  const db = await connectToDatabase();
  
  const result = await db.collection('requests').updateOne(
    { _id: new ObjectId(requestId) },
    { 
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}

export async function deleteRequest(requestId: string, userId: ObjectId) {
  const db = await connectToDatabase();
  
  const result = await db.collection('requests').deleteOne({
    _id: new ObjectId(requestId),
    userId // Ensure user owns the request
  });
  
  return result.deletedCount > 0;
}

export async function getRequestCountsByType(userId: ObjectId) {
  const db = await connectToDatabase();
  
  const counts = await db.collection('requests').aggregate([
    { $match: { userId } },
    { $group: {
      _id: '$type',
      count: { $sum: 1 }
    }}
  ]).toArray();
  
  return counts.reduce((acc, { _id, count }) => ({
    ...acc,
    [_id]: count
  }), {
    personal: 0,
    pair: 0,
    group: 0,
    team: 0,
    startup: 0
  });
}
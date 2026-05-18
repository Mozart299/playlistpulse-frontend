import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const { search, sort = 'recent', limit = '20', skip = '0' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 20, 50);
    const skipNum = parseInt(skip as string, 10) || 0;

    const client = await clientPromise;
    const db = client.db('theplaylist');
    const collection = db.collection('posts');

    const filter: Record<string, unknown> = { playlistId: { $exists: true, $ne: '' } };

    if (search) {
      filter.$or = [
        { playlistName: { $regex: search, $options: 'i' } },
        { user: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder: Record<string, -1> = sort === 'popular'
      ? { likeCount: -1, created_at: -1 }
      : { created_at: -1 };

    const [posts, total] = await Promise.all([
      collection.find(filter).sort(sortOrder).skip(skipNum).limit(limitNum).toArray(),
      collection.countDocuments(filter),
    ]);

    return res.status(200).json({ posts, total, limit: limitNum, skip: skipNum });
  } catch (error) {
    console.error('Discover API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

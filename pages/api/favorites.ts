import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const client = await clientPromise;
    const db = client.db('theplaylist');
    const favCol = db.collection('favorites');
    const postsCol = db.collection('posts');
    const userEmail = session.user?.email!;

    if (req.method === 'GET') {
      const { postId } = req.query;

      // Check if a single post is bookmarked
      if (postId) {
        const fav = await favCol.findOne({ postId: postId as string, userEmail });
        return res.status(200).json({ bookmarked: !!fav });
      }

      // Return all bookmarked posts
      const favorites = await favCol.find({ userEmail }).sort({ created_at: -1 }).toArray();
      if (!favorites.length) return res.status(200).json([]);

      const postIds = favorites
        .filter(f => ObjectId.isValid(f.postId))
        .map(f => new ObjectId(f.postId));

      const posts = await postsCol.find({ _id: { $in: postIds } }).toArray();
      // Sort to match favorites order
      const sorted = favorites
        .map(f => posts.find(p => p._id.toString() === f.postId))
        .filter(Boolean);

      return res.status(200).json(sorted);
    }

    if (req.method === 'POST') {
      const { postId } = req.body;
      if (!postId) return res.status(400).json({ message: 'postId required' });

      const existing = await favCol.findOne({ postId, userEmail });
      if (existing) {
        await favCol.deleteOne({ _id: existing._id });
        return res.status(200).json({ bookmarked: false });
      }

      await favCol.insertOne({ postId, userEmail, created_at: new Date().toISOString() });
      return res.status(201).json({ bookmarked: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  } catch (error) {
    console.error('Favorites API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

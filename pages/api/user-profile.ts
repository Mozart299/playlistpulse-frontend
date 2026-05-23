import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const client = await clientPromise;
    const db = client.db('theplaylist');
    const settingsCol = db.collection('user_settings');
    const profilesCol = db.collection('taste_profiles');
    const postsCol = db.collection('posts');

    if (req.method === 'GET') {
      const email = (req.query.email as string) || session.user?.email;
      if (!email) return res.status(401).json({ message: 'Unauthorized' });

      const [settings, tasteProfile, posts] = await Promise.all([
        settingsCol.findOne({ email }),
        profilesCol.findOne({ email }),
        postsCol.find({ user_email: email }).sort({ created_at: -1 }).toArray(),
      ]);

      return res.status(200).json({
        email,
        name: tasteProfile?.name || settings?.name || '',
        displayName: settings?.displayName || tasteProfile?.name || '',
        image: tasteProfile?.image || settings?.image || '',
        bio: settings?.bio || '',
        topGenres: (tasteProfile?.topGenres || []).slice(0, 8),
        topArtistNames: (tasteProfile?.topArtistNames || []).slice(0, 5),
        posts,
        postCount: posts.length,
      });
    }

    if (req.method === 'POST') {
      const userEmail = session.user?.email;
      if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });
      const { displayName, bio } = req.body;

      await settingsCol.updateOne(
        { email: userEmail },
        {
          $set: {
            email: userEmail,
            displayName: displayName?.trim() || '',
            bio: bio?.trim() || '',
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ message: 'Profile updated' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  } catch (error) {
    console.error('User profile API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

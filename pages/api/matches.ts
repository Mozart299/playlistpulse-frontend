import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

async function fetchTopArtists(accessToken: string) {
  const res = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Spotify error: ${res.status}`);
  const data = await res.json();
  return data.items as Array<{ id: string; name: string; genres: string[] }>;
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const userEmail = session.user?.email!;
    const client = await clientPromise;
    const db = client.db('theplaylist');
    const profilesCol = db.collection('taste_profiles');

    // Refresh profile from Spotify if requested or no profile exists yet
    const existing = await profilesCol.findOne({ email: userEmail });
    if (!existing || req.query.refresh === 'true') {
      if (session.accessToken) {
        try {
          const artists = await fetchTopArtists(session.accessToken);
          const genres = [...new Set(artists.flatMap(a => a.genres))].slice(0, 20);
          await profilesCol.updateOne(
            { email: userEmail },
            {
              $set: {
                email: userEmail,
                name: session.user?.name,
                image: session.user?.image,
                topArtistIds: artists.map(a => a.id),
                topArtistNames: artists.map(a => a.name),
                topGenres: genres,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.error('Spotify taste fetch failed:', e);
          if (!existing) {
            return res.status(200).json({
              matches: [],
              noProfile: true,
              message: 'Could not fetch your Spotify taste. Make sure you have re-logged in after the latest update.',
            });
          }
        }
      }
    }

    const myProfile = await profilesCol.findOne({ email: userEmail });
    if (!myProfile?.topArtistIds?.length) {
      return res.status(200).json({ matches: [], noProfile: true });
    }

    const others = await profilesCol.find({ email: { $ne: userEmail } }).toArray();

    const matches = others
      .map(other => {
        const similarity = jaccardSimilarity(myProfile.topArtistIds, other.topArtistIds || []);
        const sharedIds = myProfile.topArtistIds.filter((id: string) =>
          (other.topArtistIds || []).includes(id)
        );
        const sharedArtists = sharedIds
          .map((id: string) => {
            const idx = myProfile.topArtistIds.indexOf(id);
            return myProfile.topArtistNames?.[idx] ?? '';
          })
          .filter(Boolean)
          .slice(0, 3);

        return {
          email: other.email,
          name: other.name,
          image: other.image,
          similarity: Math.round(similarity * 100),
          sharedArtists,
          topGenres: (other.topGenres || []).slice(0, 3),
        };
      })
      .filter(m => m.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 50);

    return res.status(200).json({ matches, noProfile: false });
  } catch (error) {
    console.error('Matches API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

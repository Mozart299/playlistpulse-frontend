// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';  
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions) as CustomSession | null;

        console.log('Session:', session);

        if (!session) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const client = await clientPromise;
        const db = client.db('theplaylist');
        const collection = db.collection('posts');

        const userEmail = session.user?.email;
        const username = session.user?.name;

        if (req.method === 'GET') {
            const posts = await collection.find({ user: username }).toArray();
            res.status(200).json(posts);
        } else if (req.method === 'POST') {
            const now = new Date();
            const newPost = {
                ...req.body,
                user: username,
                user_email: userEmail,
            };
            const result = await collection.insertOne(newPost);

            if (result.acknowledged) {
                res.status(201).json(newPost);
            } else {
                throw new Error('Failed to insert post');
            }
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
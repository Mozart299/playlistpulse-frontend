
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import authOptions from './auth/[...nextauth]';  
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions) as CustomSession | null;

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await clientPromise;
        const db = client.db('theplaylist');
        const collection = db.collection('posts');

        const userEmail = session.user?.email;
        const username = session.user?.name;

        if (req.method === 'GET') {
            // Get posts - either all posts or filter by user if specified
            const filter = req.query.username 
                ? { user: req.query.username } 
                : {};
                
            const posts = await collection
                .find(filter)
                .sort({ created_at: -1 }) // Sort by newest first
                .toArray();
                
            return res.status(200).json(posts);
            
        } else if (req.method === 'POST') {
            // Create new post
            const { content, playlistId, playlistName, playlistImage, location } = req.body;
            
            // Basic validation
            if (!content && !playlistId) {
                return res.status(400).json({ message: 'Post content or playlist is required' });
            }
            
            const now = new Date();
            
            // Allow both regular posts and playlist posts
            const postData = {
                content: content || '',
                user: username,
                user_email: userEmail,
                created_at: req.body.created_at || now.toISOString(),
                likeCount: 0,
                commentCount: 0,
                shareCount: 0,
                ...(playlistId && { 
                    playlistId, 
                    playlistName, 
                    playlistImage 
                }),
                ...(location && { location })
            };
            
            // Insert the post
            const result = await collection.insertOne(postData);

            if (result.acknowledged) {
                return res.status(201).json({
                    ...postData,
                    _id: result.insertedId
                });
            } else {
                throw new Error('Failed to insert post');
            }
            
        } else if (req.method === 'DELETE') {
            // Delete a post
            const postId = req.query.id;
            
            if (!postId || Array.isArray(postId)) {
                return res.status(400).json({ message: 'A valid Post ID is required' });
            }
            
            const objectId = new ObjectId(postId);
            
            // Ensure users can only delete their own posts
            const result = await collection.deleteOne({ 
                _id: objectId, 
                user_email: userEmail 
            });
            
            if (result.deletedCount === 1) {
                return res.status(200).json({ message: 'Post deleted successfully' });
            } else {
                return res.status(404).json({ message: 'Post not found or not authorized to delete' });
            }
            
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { CustomSession } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db('theplaylist');
    const postsCollection = db.collection('posts');
    const interactionsCollection = db.collection('post_interactions');

    const userEmail = session.user?.email;
    const username = session.user?.name;

    // Handle POST request for adding a like, comment, or share
    if (req.method === 'POST') {
      const { postId, type, content } = req.body;

      if (!postId || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Ensure postId is a valid ObjectId
      if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }

      const postObjectId = new ObjectId(postId);

      // Check if the post exists
      const post = await postsCollection.findOne({ _id: postObjectId });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const now = new Date();

      // Handle different interaction types
      switch (type) {
        case 'like':
          // Check if user already liked this post
          const existingLike = await interactionsCollection.findOne({ 
            postId: postObjectId, 
            userEmail, 
            type: 'like' 
          });

          if (existingLike) {
            // If user already liked, remove the like (toggle)
            await interactionsCollection.deleteOne({ _id: existingLike._id });
            // Decrement like count on the post
            await postsCollection.updateOne(
              { _id: postObjectId },
              { $inc: { likeCount: -1 } }
            );
            return res.status(200).json({ message: 'Like removed', action: 'removed' });
          } else {
            // Add new like
            await interactionsCollection.insertOne({
              postId: postObjectId,
              type: 'like',
              userEmail,
              username,
              created_at: now.toISOString()
            });
            // Increment like count on the post
            await postsCollection.updateOne(
              { _id: postObjectId },
              { $inc: { likeCount: 1 } }
            );
            return res.status(201).json({ message: 'Post liked', action: 'added' });
          }

        case 'comment':
          if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content cannot be empty' });
          }

          // Add new comment
          const commentResult = await interactionsCollection.insertOne({
            postId: postObjectId,
            type: 'comment',
            content: content.trim(),
            userEmail,
            username,
            created_at: now.toISOString()
          });

          // Increment comment count on the post
          await postsCollection.updateOne(
            { _id: postObjectId },
            { $inc: { commentCount: 1 } }
          );

          return res.status(201).json({ 
            message: 'Comment added', 
            commentId: commentResult.insertedId 
          });

        case 'share':
          // Add new share record
          await interactionsCollection.insertOne({
            postId: postObjectId,
            type: 'share',
            userEmail,
            username,
            created_at: now.toISOString()
          });

          // Increment share count on the post
          await postsCollection.updateOne(
            { _id: postObjectId },
            { $inc: { shareCount: 1 } }
          );

          return res.status(201).json({ message: 'Post shared' });

        default:
          return res.status(400).json({ message: 'Invalid interaction type' });
      }
    }

    // Handle GET request to fetch interactions for a post
    if (req.method === 'GET') {
      const { postId, type } = req.query;

      if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
      }

      if (!ObjectId.isValid(postId as string)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }

      const postObjectId = new ObjectId(postId as string);

      // Build query based on parameters
      const query: any = { postId: postObjectId };
      
      if (type) {
        query.type = type;
      }

      // Fetch interactions
      const interactions = await interactionsCollection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();

      // For likes, just send count and whether current user liked
      if (type === 'like') {
        const userLiked = interactions.some(like => like.userEmail === userEmail);
        return res.status(200).json({ 
          count: interactions.length,
          userLiked
        });
      }

      // For comments, return the full list
      if (type === 'comment') {
        return res.status(200).json(interactions);
      }

      // For all interactions or shares
      return res.status(200).json(interactions);
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
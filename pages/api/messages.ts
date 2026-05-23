import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';
import { CustomSession } from './auth/[...nextauth]';

function makeConversationId(a: string, b: string) {
  return [a, b].sort().join('__CONV__');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as CustomSession | null;
    if (!session) return res.status(401).json({ message: 'Unauthorized' });

    const client = await clientPromise;
    const db = client.db('theplaylist');
    const msgCol = db.collection('messages');
    const userEmail = session.user?.email;
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });

    if (req.method === 'GET') {
      const { conversationId } = req.query;

      if (conversationId) {
        // Fetch messages in a conversation (only participants can read)
        const messages = await msgCol
          .find({ conversationId, participants: userEmail })
          .sort({ created_at: 1 })
          .toArray();
        return res.status(200).json(messages);
      }

      // Fetch conversation list: latest message per conversation
      const conversations = await msgCol
        .aggregate([
          { $match: { participants: userEmail } },
          { $sort: { created_at: -1 } },
          {
            $group: {
              _id: '$conversationId',
              lastMessage: { $first: '$$ROOT' },
              unread: {
                $sum: {
                  $cond: [
                    { $and: [{ $ne: ['$senderEmail', userEmail] }, { $eq: ['$read', false] }] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          { $sort: { 'lastMessage.created_at': -1 } },
        ])
        .toArray();

      return res.status(200).json(conversations);
    }

    if (req.method === 'POST') {
      const { recipientEmail, recipientName, recipientImage, content } = req.body;
      if (!recipientEmail || !content?.trim()) {
        return res.status(400).json({ message: 'recipientEmail and content required' });
      }
      if (recipientEmail === userEmail) {
        return res.status(400).json({ message: 'Cannot message yourself' });
      }

      const conversationId = makeConversationId(userEmail, recipientEmail);
      const message = {
        conversationId,
        participants: [userEmail, recipientEmail],
        senderEmail: userEmail,
        senderName: session.user?.name || '',
        senderImage: session.user?.image || '',
        recipientEmail,
        recipientName: recipientName || '',
        recipientImage: recipientImage || '',
        content: content.trim(),
        read: false,
        created_at: new Date().toISOString(),
      };

      const result = await msgCol.insertOne(message);
      return res.status(201).json({ ...message, _id: result.insertedId });
    }

    // Mark conversation as read
    if (req.method === 'PATCH') {
      const { conversationId } = req.body;
      if (!conversationId) return res.status(400).json({ message: 'conversationId required' });

      await msgCol.updateMany(
        { conversationId, senderEmail: { $ne: userEmail }, read: false },
        { $set: { read: true } }
      );
      return res.status(200).json({ message: 'Marked as read' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    return res.status(405).end();
  } catch (error) {
    console.error('Messages API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

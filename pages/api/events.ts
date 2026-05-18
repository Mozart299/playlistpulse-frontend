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
    const eventsCol = db.collection('events');
    const userEmail = session.user?.email!;

    if (req.method === 'GET') {
      const { search, upcoming, limit = '50' } = req.query;
      const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
      const filter: Record<string, unknown> = {};

      if (upcoming === 'true') {
        filter.date = { $gte: new Date().toISOString().split('T')[0] };
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const events = await eventsCol.find(filter).sort({ date: 1 }).limit(limitNum).toArray();
      return res.status(200).json(events);
    }

    if (req.method === 'POST') {
      const { name, venue, date, time, description, genre, price, link } = req.body;
      if (!name?.trim() || !date) {
        return res.status(400).json({ message: 'name and date are required' });
      }

      const event = {
        name: name.trim(),
        venue: venue?.trim() || '',
        date,
        time: time || '',
        description: description?.trim() || '',
        genre: genre?.trim() || '',
        price: price?.trim() || 'Free',
        link: link?.trim() || '',
        creatorEmail: userEmail,
        creatorName: session.user?.name || '',
        creatorImage: session.user?.image || '',
        attendees: [userEmail],
        created_at: new Date().toISOString(),
      };

      const result = await eventsCol.insertOne(event);
      return res.status(201).json({ ...event, _id: result.insertedId });
    }

    // RSVP toggle
    if (req.method === 'PATCH') {
      const { eventId } = req.body;
      if (!eventId || !ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Valid eventId required' });
      }

      const event = await eventsCol.findOne({ _id: new ObjectId(eventId) });
      if (!event) return res.status(404).json({ message: 'Event not found' });

      const attending = (event.attendees || []).includes(userEmail);
      if (attending) {
        await eventsCol.updateOne({ _id: new ObjectId(eventId) }, { $pull: { attendees: userEmail } } as any);
      } else {
        await eventsCol.updateOne({ _id: new ObjectId(eventId) }, { $addToSet: { attendees: userEmail } });
      }

      return res.status(200).json({ attending: !attending });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || !ObjectId.isValid(id as string)) {
        return res.status(400).json({ message: 'Valid event id required' });
      }
      const result = await eventsCol.deleteOne({
        _id: new ObjectId(id as string),
        creatorEmail: userEmail,
      });
      if (!result.deletedCount) return res.status(403).json({ message: 'Not found or not authorized' });
      return res.status(200).json({ message: 'Event deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end();
  } catch (error) {
    console.error('Events API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

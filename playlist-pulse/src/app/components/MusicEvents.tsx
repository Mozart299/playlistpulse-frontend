import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

interface MusicEventsProps {
  events: Event[];
}

const MusicEvents: React.FC<MusicEventsProps> = ({ events }) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Your Music Events</CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="space-y-3">
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <Link href={`/events/${event.id}`} className="group">
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      layout="fill" 
                      objectFit="cover" 
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <span>{event.date}, {event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <Separator />
            </React.Fragment>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Link href="/events" className="text-sm text-blue-600 hover:underline">
            View all events
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample events data
export const sampleEvents = [
  {
    id: '1',
    title: 'Music BBQ',
    date: 'Sat 16 June',
    location: 'Playlist Garden',
    image: '/images/albumcover4.jpg'
  },
  {
    id: '2',
    title: 'Playlist Groove',
    date: 'Sat 16 June',
    location: 'Playlist Garden',
    image: '/images/albumcover3.jpg'
  },
  {
    id: '3',
    title: 'indie Music Fest',
    date: 'Sat 16 June',
    location: 'Playlist Garden',
    image: '/images/albumcover2.jpg'
  },
  {
    id: '4',
    title: 'Stand-up Comedy Night',
    date: 'Sat 16 June',
    location: 'Playlist Garden',
    image: '/images/albumcover1.jpg'
  },
  {
    id: '5',
    title: 'Concert Tour 2023',
    date: 'Sat 16 June',
    location: 'Playlist Garden',
    image: '/images/event1.jpg'
  }
];

// Default export with sample data
const MusicEventsWithData: React.FC = () => {
  return <MusicEvents events={sampleEvents} />;
};

export default MusicEventsWithData;
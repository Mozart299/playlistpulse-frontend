import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  Music,
  Play,
  Heart,
  MessageCircle,
  UserPlus
} from 'lucide-react';

interface MusicMatch {
  id: string;
  name: string;
  genre: string;
  compatibility: number;
  avatar: string;
  mutual: number;
}

interface TrendingPlaylist {
  id: string;
  name: string;
  creator: string;
  plays: string;
  cover: string;
  genre: string;
}

interface UpcomingEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  image: string;
  attendees: number;
}

interface CommunityChat {
  id: string;
  name: string;
  avatar: string;
  members: number;
  lastActive: string;
}

const RightSideBar: React.FC = () => {
  // Mock data
  const musicMatches: MusicMatch[] = [
    { 
      id: '1', 
      name: 'Alex Rivera', 
      genre: 'Indie Rock', 
      compatibility: 94, 
      avatar: '🎸',
      mutual: 12
    },
    { 
      id: '2', 
      name: 'Emma Wu', 
      genre: 'Electronic', 
      compatibility: 89, 
      avatar: '🎧',
      mutual: 8
    },
    { 
      id: '3', 
      name: 'David Kim', 
      genre: 'Jazz Fusion', 
      compatibility: 85, 
      avatar: '🎷',
      mutual: 5
    }
  ];

  const trendingPlaylists: TrendingPlaylist[] = [
    { 
      id: '1', 
      name: 'Chill Synthwave', 
      creator: 'NeonVibes', 
      plays: '2.1M', 
      cover: '🌆',
      genre: 'Electronic'
    },
    { 
      id: '2', 
      name: 'Acoustic Coffee', 
      creator: 'CafeMelodies', 
      plays: '1.8M', 
      cover: '☕',
      genre: 'Acoustic'
    },
    { 
      id: '3', 
      name: 'Workout Beats', 
      creator: 'FitnessMusic', 
      plays: '1.5M', 
      cover: '💪',
      genre: 'Electronic'
    }
  ];

  const upcomingEvents: UpcomingEvent[] = [
    { 
      id: '1', 
      name: 'Jazz Night Live', 
      venue: 'Blue Note Cafe', 
      date: 'Tonight', 
      time: '8:00 PM', 
      price: 'Free', 
      image: '🎺',
      attendees: 45
    },
    { 
      id: '2', 
      name: 'Indie Rock Festival', 
      venue: 'Central Park', 
      date: 'Saturday', 
      time: '2:00 PM', 
      price: '$25', 
      image: '🎸',
      attendees: 234
    },
    { 
      id: '3', 
      name: 'Electronic Showcase', 
      venue: 'Underground Club', 
      date: 'Sunday', 
      time: '9:00 PM', 
      price: '$15', 
      image: '🎧',
      attendees: 89
    }
  ];

  const communityChats: CommunityChat[] = [
    { 
      id: '1', 
      name: 'Folk Enthusiasts', 
      avatar: '🎻', 
      members: 1240, 
      lastActive: '2m ago' 
    },
    { 
      id: '2', 
      name: 'Electronic Vibes', 
      avatar: '🎹', 
      members: 2156, 
      lastActive: '5m ago' 
    },
    { 
      id: '3', 
      name: 'Jazz Collective', 
      avatar: '🎺', 
      members: 890, 
      lastActive: '12m ago' 
    },
    { 
      id: '4', 
      name: 'Indie Underground', 
      avatar: '🎸', 
      members: 1567, 
      lastActive: '1h ago' 
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 w-80 h-full overflow-y-auto border-l border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 space-y-6">
        {/* Music Matches Section */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Music Matches
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                {musicMatches.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {musicMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                      {match.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{match.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{match.genre}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{match.mutual} mutual friends</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{match.compatibility}%</p>
                    <Button size="sm" variant="ghost" className="text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 p-1">
                      <UserPlus className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20" asChild>
              <Link href="/matches">View All Matches</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trending Playlists Section */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Trending Playlists
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {trendingPlaylists.map((playlist) => (
                <div key={playlist.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg shadow-sm">
                    {playlist.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{playlist.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {playlist.creator}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs py-0 px-1">{playlist.genre}</Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{playlist.plays} plays</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 p-1">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Chats Section */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Community Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {communityChats.map((chat) => (
                <Link key={chat.id} href="/messages" className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm mr-3">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{chat.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chat.members.toLocaleString()} members</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{chat.lastActive}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" asChild>
              <Link href="/communities">Explore Communities</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events Section */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="text-2xl">{event.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{event.name}</h4>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.venue}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.date} {event.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1 text-green-600" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{event.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" asChild>
              <Link href="/events">See All Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RightSideBar;
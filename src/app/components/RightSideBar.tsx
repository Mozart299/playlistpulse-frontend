'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users, TrendingUp, Calendar, MapPin, Clock, DollarSign, Tag, Play, UserPlus,
} from 'lucide-react';
import {
  MusicMatchSkeleton, TrendingPlaylistSkeleton, EventSkeleton,
} from '@/components/ui/skeletons';
import { getInitials } from '@/lib/utils';

interface Match {
  email: string;
  name: string;
  image: string;
  similarity: number;
  topGenres: string[];
}

interface TrendingPost {
  _id: string;
  user: string;
  playlistName: string;
  playlistImage: string;
  playlistUrl: string;
  likeCount: number;
}

interface Event {
  _id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  attendees: string[];
}

const RightSideBar: React.FC = () => {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [trending, setTrending] = useState<TrendingPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!session) return;

    // Fetch top 3 matches (no refresh — use cached profiles only)
    axios.get('/api/matches')
      .then(res => setMatches((res.data.matches || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingMatches(false));

    // Fetch top 3 trending playlists
    axios.get('/api/discover?sort=popular&limit=3')
      .then(res => setTrending(res.data.posts || []))
      .catch(() => {})
      .finally(() => setLoadingTrending(false));

    // Fetch next 3 upcoming events
    axios.get('/api/events?upcoming=true&limit=3')
      .then(res => setEvents(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, [session]);

  return (
    <div className="bg-card w-80 h-full overflow-y-auto border-l border-border">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">

        {/* Music Matches */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Music Matches
              </CardTitle>
              {matches.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {matches.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingMatches ? (
              <div className="space-y-2">
                <MusicMatchSkeleton /><MusicMatchSkeleton />
              </div>
            ) : matches.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Visit <Link href="/matches" className="text-primary hover:underline">Matches</Link> to find your music twins
              </p>
            ) : (
              <div className="space-y-2">
                {matches.map(match => (
                  <div key={match.email} className="flex items-center justify-between p-2 bg-muted/40 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={match.image} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(match.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{match.name}</p>
                        {match.topGenres[0] && (
                          <p className="text-xs text-muted-foreground truncate capitalize">{match.topGenres[0]}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-semibold text-primary">{match.similarity}%</p>
                      <Button size="sm" variant="ghost" className="text-xs p-1 h-auto" asChild>
                        <Link href={`/user/${encodeURIComponent(match.email)}`}>
                          <UserPlus className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-3 text-sm" asChild>
              <Link href="/matches">View All Matches</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trending Playlists */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending Playlists
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingTrending ? (
              <div className="space-y-2">
                <TrendingPlaylistSkeleton /><TrendingPlaylistSkeleton />
              </div>
            ) : trending.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No playlists shared yet. <Link href="/discover" className="text-primary hover:underline">Be the first!</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {trending.map(post => (
                  <div key={post._id} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors">
                    <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      {post.playlistImage ? (
                        <img src={post.playlistImage} alt={post.playlistName} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-lg">♪</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{post.playlistName}</p>
                      <p className="text-xs text-muted-foreground truncate">by {post.user}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.likeCount || 0} likes</p>
                    </div>
                    {post.playlistUrl && (
                      <Button size="sm" variant="ghost" className="p-1 flex-shrink-0" asChild>
                        <a href={post.playlistUrl} target="_blank" rel="noopener noreferrer" aria-label="Open playlist">
                          <Play className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-3 text-sm" asChild>
              <Link href="/discover">Browse All Playlists</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingEvents ? (
              <div className="space-y-2">
                <EventSkeleton /><EventSkeleton />
              </div>
            ) : events.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No events yet. <Link href="/events" className="text-primary hover:underline">Create one!</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event._id} className="p-3 bg-muted/40 rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground text-sm mb-1 truncate">{event.name}</h4>
                    {event.venue && (
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3 mr-1" />{event.venue}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {event.time && ` ${event.time}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {event.price === 'Free' ? (
                          <Tag className="w-3 h-3 text-primary" />
                        ) : (
                          <DollarSign className="w-3 h-3 text-primary" />
                        )}
                        <span className="font-semibold text-primary">{event.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-3 text-sm" asChild>
              <Link href="/events">See All Events</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Community Chats — placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Community Chats
              <Badge variant="secondary" className="text-xs ml-1">Coming Soon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Group chats for music genres and communities are coming soon. For now, connect with matches directly via messages.</p>
            <Button variant="ghost" className="w-full mt-3 text-sm" asChild>
              <Link href="/messages">Open Messages</Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default RightSideBar;

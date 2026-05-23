'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, RefreshCw, Music2, MessageSquare, UserCircle, AlertCircle } from 'lucide-react';
import { MusicMatchSkeleton } from '@/components/ui/skeletons';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

interface Match {
  email: string;
  name: string;
  image: string;
  similarity: number;
  sharedArtists: string[];
  topGenres: string[];
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noProfile, setNoProfile] = useState(false);

  const fetchMatches = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axios.get(`/api/matches${refresh ? '?refresh=true' : ''}`);
      setMatches(res.data.matches || []);
      setNoProfile(res.data.noProfile ?? false);
      if (refresh) toast.success('Taste profile updated!');
    } catch {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Music Matches</h1>
            </div>
            <p className="text-muted-foreground text-sm">People with similar taste, powered by Spotify</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchMatches(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* How it works */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Music2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
            <p>
              Matches are based on your top Spotify artists. The more artists you share with someone,
              the higher your compatibility. Hit <strong>Refresh</strong> to sync your latest taste.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <MusicMatchSkeleton key={i} />)}
        </div>
      ) : noProfile ? (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="font-medium text-lg mb-2">No taste profile yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Click <strong>Refresh</strong> to sync your Spotify listening history and find your matches.
          </p>
          <Button onClick={() => fetchMatches(true)} disabled={refreshing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync my Spotify taste
          </Button>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg mb-1">No matches yet</p>
          <p className="text-sm">As more people join and sync their taste, matches will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map(match => (
            <Card key={match.email} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border border-border flex-shrink-0">
                    <AvatarImage src={match.image} alt={match.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {getInitials(match.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{match.name || match.email}</p>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="text-sm font-semibold text-primary">{match.similarity}% match</span>
                    </div>
                    <Progress value={match.similarity} className="h-1.5 mb-3" />
                    {match.sharedArtists.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Both love: <span className="font-medium text-foreground">{match.sharedArtists.join(', ')}</span>
                      </p>
                    )}
                    {match.topGenres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.topGenres.map(g => (
                          <Badge key={g} variant="secondary" className="text-xs capitalize">{g}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 flex-1" asChild>
                        <Link href={`/user/${encodeURIComponent(match.email)}`}>
                          <UserCircle className="w-3.5 h-3.5" /> Profile
                        </Link>
                      </Button>
                      <Button size="sm" className="gap-1.5 flex-1" asChild>
                        <Link href={`/messages?with=${encodeURIComponent(match.email)}&name=${encodeURIComponent(match.name || '')}&image=${encodeURIComponent(match.image || '')}`}>
                          <MessageSquare className="w-3.5 h-3.5" /> Message
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

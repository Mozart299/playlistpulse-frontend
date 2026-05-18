'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Music, FileText, UserCircle } from 'lucide-react';
import { FeedSkeleton } from '@/components/ui/skeletons';
import UnifiedPostCard from '@/app/components/UnifiedPostCard';
import { getInitials } from '@/lib/utils';

interface UserProfile {
  email: string;
  name: string;
  displayName: string;
  image: string;
  bio: string;
  topGenres: string[];
  topArtistNames: string[];
  posts: any[];
  postCount: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const email = decodeURIComponent((params?.id as string) || '');
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = session?.user?.email === email;

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    axios
      .get(`/api/user-profile?email=${encodeURIComponent(email)}`)
      .then(res => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="h-20 w-20 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
        <FeedSkeleton count={3} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium text-lg">User not found</p>
      </div>
    );
  }

  const displayName = profile.displayName || profile.name || email;
  const playlistPosts = profile.posts.filter(p => p.playlistId);
  const regularPosts = profile.posts.filter(p => !p.playlistId);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-5">
          <Avatar className="h-20 w-20 border-4 border-white/30 flex-shrink-0">
            <AvatarImage src={profile.image} alt={displayName} />
            <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{displayName}</h1>
            {profile.bio && <p className="text-white/90 text-sm mt-1">{profile.bio}</p>}
            <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
              <span><strong className="text-white">{profile.postCount}</strong> posts</span>
              <span><strong className="text-white">{playlistPosts.length}</strong> playlists shared</span>
            </div>
          </div>
          {!isOwnProfile && (
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5 bg-white/20 hover:bg-white/30 text-white border-0 flex-shrink-0"
              asChild
            >
              <Link href={`/messages?with=${encodeURIComponent(email)}&name=${encodeURIComponent(displayName)}&image=${encodeURIComponent(profile.image || '')}`}>
                <MessageSquare className="w-4 h-4" /> Message
              </Link>
            </Button>
          )}
          {isOwnProfile && (
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0" asChild>
              <Link href="/settings">Edit Profile</Link>
            </Button>
          )}
        </div>

        {/* Genres */}
        {profile.topGenres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {profile.topGenres.map(g => (
              <Badge key={g} className="bg-white/20 text-white border-0 capitalize text-xs">{g}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Top Artists */}
      {profile.topArtistNames.length > 0 && (
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top Artists</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.topArtistNames.map(a => (
                <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1 gap-1.5">
            <FileText className="w-4 h-4" /> All Posts ({profile.postCount})
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex-1 gap-1.5">
            <Music className="w-4 h-4" /> Playlists ({playlistPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-0">
          {profile.posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No posts yet.</div>
          ) : (
            profile.posts.map(post => (
              <UnifiedPostCard
                key={post._id}
                post={post}
                userImage={profile.image || ''}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-4 space-y-0">
          {playlistPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No playlists shared yet.</div>
          ) : (
            playlistPosts.map(post => (
              <UnifiedPostCard
                key={post._id}
                post={{ ...post, type: 'playlist' }}
                userImage={profile.image || ''}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

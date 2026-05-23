'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Clock, Music } from 'lucide-react';
import { FeedSkeleton } from '@/components/ui/skeletons';
import UnifiedPostCard from '@/app/components/UnifiedPostCard';
import debounce from 'lodash.debounce';

type SortMode = 'recent' | 'popular';

interface Post {
  _id: string;
  user: string;
  user_email: string;
  content?: string;
  created_at: string;
  playlistId?: string;
  playlistName?: string;
  playlistImage?: string;
  playlistUrl?: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>('recent');
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const LIMIT = 20;

  const fetchPosts = useCallback(async (newSort: SortMode, newSearch: string, newSkip: number, append = false) => {
    try {
      if (newSkip === 0) setLoading(true);
      const params = new URLSearchParams({
        sort: newSort,
        limit: String(LIMIT),
        skip: String(newSkip),
      });
      if (newSearch) params.set('search', newSearch);

      const res = await axios.get(`/api/discover?${params}`);
      const { posts: fetched, total } = res.data;

      setPosts(prev => append ? [...prev, ...fetched] : fetched);
      setHasMore(newSkip + fetched.length < total);
    } catch {
      // keep existing state on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedFetch = useRef(
    debounce((s: SortMode, q: string) => {
      setSkip(0);
      fetchPosts(s, q, 0);
    }, 350)
  ).current;

  useEffect(() => {
    debouncedFetch(sort, search);
    return () => debouncedFetch.cancel();
  }, [sort, search, debouncedFetch]);

  const handleSortChange = (val: string) => {
    setSort(val as SortMode);
    setSkip(0);
  };

  const loadMore = () => {
    const nextSkip = skip + LIMIT;
    setSkip(nextSkip);
    fetchPosts(sort, search, nextSkip, true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Discover</h1>
        </div>
        <p className="text-muted-foreground text-sm">Browse playlists shared by the community</p>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search playlists or users…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={sort} onValueChange={handleSortChange} className="flex-shrink-0">
          <TabsList>
            <TabsTrigger value="recent" className="gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recent
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Feed */}
      {loading ? (
        <FeedSkeleton count={4} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg mb-1">No playlists found</p>
          <p className="text-sm">
            {search ? 'Try a different search term.' : 'Be the first to share a playlist!'}
          </p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <UnifiedPostCard
              key={post._id}
              post={{ ...post, type: 'playlist' } as any}
              userImage={session?.user?.image || ''}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore}>Load more</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

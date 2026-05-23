'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Bookmark } from 'lucide-react';
import { FeedSkeleton } from '@/components/ui/skeletons';
import UnifiedPostCard from '@/app/components/UnifiedPostCard';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/favorites')
      .then(res => setPosts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <Bookmark className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Saved Posts</h1>
        </div>
        <p className="text-muted-foreground text-sm">Posts you&apos;ve bookmarked</p>
      </div>

      {loading ? (
        <FeedSkeleton count={3} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg mb-1">No saved posts</p>
          <p className="text-sm">Bookmark posts to find them here later.</p>
        </div>
      ) : (
        posts.map(post => (
          <UnifiedPostCard
            key={post._id}
            post={post}
            userImage={session?.user?.image || ''}
          />
        ))
      )}
    </div>
  );
}

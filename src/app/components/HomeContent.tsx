import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreatePost from './CreatePost';
import UnifiedPostCard from './UnifiedPostCard';
import { FeedSkeleton } from '@/components/ui/skeletons';
import { Music, RefreshCw } from 'lucide-react';

const HomeContent: React.FC = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (postData: any) => {
    try {
      const response = await axios.post('/api/posts', postData);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      return response.data;
    } catch (err) {
      console.error('Error submitting post:', err);
      throw err;
    }
  };

  const renderPost = (post: any) => {
    // Determine post type and add it to the post object
    const postWithType = {
      ...post,
      type: (post.playlistId && post.playlistName) ? 'playlist' : 'regular'
    };
    
    return (
      <UnifiedPostCard
        key={post._id}
        post={postWithType}
        userImage={session?.user?.image as string}
      />
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Post Creation Form */}
      <CreatePost
        userImage={session?.user?.image as string}
        userName={session?.user?.name as string}
        onPostSubmit={handlePostSubmit}
      />
      
      {/* Posts Feed */}
      {isLoading ? (
        <FeedSkeleton count={3} />
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-500 font-medium mb-1">Failed to load posts</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button variant="outline" onClick={fetchPosts} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/20">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to share a playlist or start a conversation!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map(renderPost)}
        </div>
      )}
    </div>
  );
};

export default HomeContent;
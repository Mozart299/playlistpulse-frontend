import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import CreatePost from './CreatePost';
import UnifiedPostCard from './UnifiedPostCard';
import { FeedSkeleton } from '@/components/ui/skeletons';

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
        <Card className="p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-4 text-blue-600 hover:underline"
            onClick={fetchPosts}
          >
            Try again
          </button>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No posts yet. Be the first to share!</p>
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
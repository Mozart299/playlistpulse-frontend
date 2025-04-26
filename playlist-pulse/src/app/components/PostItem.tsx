import React, { useState, useEffect } from 'react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getInitials } from '@/lib/utils';

interface Post {
  _id: string;
  user: string;
  content: string;
  created_at: string;
  images?: string[] | null;
  playlistId?: string;
  playlistName?: string;
  playlistImage?: string;
  playlistUrl?: string;
  user_email: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

interface PostItemProps {
  post: Post;
  userImage: string;
}

const PostItem: React.FC<PostItemProps> = ({ post, userImage }) => {
  const relativeTime = useRelativeTime(post.created_at);
  const { data: session } = useSession();
  
  // State for interactions
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // Ensure images is an array or default to an empty array
  const images = Array.isArray(post.images) ? post.images : [];

  // Check if user has liked the post on component mount
  useEffect(() => {
    const checkUserLike = async () => {
      try {
        const response = await axios.get(`/api/post-interactions?postId=${post._id}&type=like`);
        setUserLiked(response.data.userLiked);
        setLikeCount(response.data.count);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    if (session) {
      checkUserLike();
    }
  }, [post._id, session]);

  // Handle like button click
  const handleLike = async () => {
    try {
      const response = await axios.post('/api/post-interactions', {
        postId: post._id,
        type: 'like'
      });
      
      // Toggle like status based on response
      if (response.data.action === 'added') {
        setUserLiked(true);
        setLikeCount(prevCount => prevCount + 1);
      } else {
        setUserLiked(false);
        setLikeCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment button click
  const handleCommentClick = async () => {
    setShowComments(!showComments);
    
    // Fetch comments if showing comments and we haven't loaded them yet
    if (!showComments && comments.length === 0) {
      await fetchComments();
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`/api/post-interactions?postId=${post._id}&type=comment`);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    try {
      const response = await axios.post('/api/post-interactions', {
        postId: post._id,
        type: 'comment',
        content
      });
      
      // Add the new comment to the list
      const newComment = {
        _id: response.data.commentId,
        postId: post._id,
        content,
        username: session?.user?.name,
        userEmail: session?.user?.email,
        created_at: new Date().toISOString()
      };
      
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  };

  // Handle share button click
  const handleShare = async () => {
    try {
      await axios.post('/api/post-interactions', {
        postId: post._id,
        type: 'share'
      });
      
      setShareCount(prevCount => prevCount + 1);
      
      // Show a success message or modal for sharing
      alert('Post shared successfully!');
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage src={userImage} alt={post.user} />
            <AvatarFallback>
              {getInitials(post.user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user}</p>
            <p className="text-sm text-gray-500">{relativeTime}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <p className="whitespace-pre-line mb-4">{post.content}</p>
        
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                <div className="w-full h-full">
                  <img 
                    src={image} 
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {post.playlistImage && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">{post.playlistName}</p>
            <a 
              href={post.playlistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-48 h-48 relative hover:opacity-90 transition-opacity"
            >
              <div className="w-full h-full">
                <img
                  src={post.playlistImage}
                  alt={post.playlistName || 'Playlist'}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </a>
          </div>
        )}
        
        {/* Interaction counts */}
        {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
          <div className="flex justify-between items-center py-2 text-sm text-gray-500 border-t mt-4">
            {likeCount > 0 && (
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-blue-500" />
                <span>{likeCount}</span>
              </div>
            )}
            <div className="flex space-x-4">
              {commentCount > 0 && (
                <button 
                  onClick={handleCommentClick} 
                  className="hover:underline"
                >
                  {commentCount} comment{commentCount !== 1 ? 's' : ''}
                </button>
              )}
              {shareCount > 0 && (
                <span>{shareCount} share{shareCount !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Comments section */}
        {showComments && (
          <div className="mt-4 border-t pt-4">
            <CommentForm 
              postId={post._id}
              userImage={userImage}
              userName={session?.user?.name || ''}
              onCommentSubmit={handleCommentSubmit}
            />
            
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <CommentList comments={comments} userImage={userImage} />
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center ${userLiked ? 'text-blue-600' : ''}`}
          onClick={handleLike}
        >
          <ThumbsUp className={`mr-1 h-4 w-4 ${userLiked ? 'fill-current text-blue-600' : ''}`} />
          <span>Like</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center"
          onClick={handleCommentClick}
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>Comment</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center"
          onClick={handleShare}
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
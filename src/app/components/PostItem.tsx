import React, { useState, useEffect } from 'react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageSquare, Share2, Music, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getInitials, cn } from '@/lib/utils';

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
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-brand/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-11 w-11 border-2 border-brand/10">
              <AvatarImage src={userImage} alt={post.user} />
              <AvatarFallback className="bg-brand/5 text-brand font-medium">
                {getInitials(post.user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.user}</p>
              <p className="text-sm text-muted-foreground">{relativeTime}</p>
            </div>
          </div>
          {post.playlistName && (
            <Badge variant="secondary" className="gap-1">
              <Music className="w-3 h-3" />
              Playlist
            </Badge>
          )}
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
          <Card className="mb-4 bg-gradient-to-br from-brand/5 to-brand/10 border-brand/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-5 h-5 text-brand" />
                <h4 className="font-semibold text-foreground">{post.playlistName}</h4>
              </div>
              <a 
                href={post.playlistUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block relative"
              >
                <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={post.playlistImage}
                    alt={post.playlistName || 'Playlist'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        )}
        
        {/* Interaction counts */}
        {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
          <>
            <Separator className="my-3" />
            <div className="flex justify-between items-center py-2 text-sm text-muted-foreground">
              {likeCount > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{likeCount}</span>
                </div>
              )}
              <div className="flex gap-4">
                {commentCount > 0 && (
                  <Button 
                    variant="link"
                    size="sm"
                    onClick={handleCommentClick} 
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  >
                    {commentCount} comment{commentCount !== 1 ? 's' : ''}
                  </Button>
                )}
                {shareCount > 0 && (
                  <span className="text-sm">{shareCount} share{shareCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Comments section */}
        {showComments && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <CommentForm 
                postId={post._id}
                userImage={userImage}
                userName={session?.user?.name || ''}
                onCommentSubmit={handleCommentSubmit}
              />
              
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
                </div>
              ) : (
                <CommentList comments={comments} userImage={userImage} />
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between bg-muted/20">
        <Button 
          variant={userLiked ? "default" : "ghost"} 
          size="sm" 
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            userLiked ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-blue-50 hover:text-blue-600"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("h-4 w-4", userLiked && "fill-current")} />
          <span className="font-medium">Like</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
          onClick={handleCommentClick}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
'use client';

import React, { useState, useEffect } from 'react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageSquare, Share2, Music, ExternalLink, Play, Heart } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getInitials, cn } from '@/lib/utils';
import { designSystem, componentTokens } from '@/styles/design-tokens';
import { PostSkeleton, CommentSkeleton } from '@/components/ui/skeletons';
import { toast } from 'sonner';

interface BasePost {
  _id: string;
  user: string;
  content?: string;
  created_at: string;
  user_email: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

interface RegularPost extends BasePost {
  type?: 'regular';
  images?: string[] | null;
  playlistId?: string;
  playlistName?: string;
  playlistImage?: string;
  playlistUrl?: string;
}

interface PlaylistPost extends BasePost {
  type: 'playlist';
  playlistId: string;
  playlistName: string;
  playlistImage?: string;
  playlistUrl: string;
}

type Post = RegularPost | PlaylistPost;

interface UnifiedPostCardProps {
  post: Post;
  userImage?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

const UnifiedPostCard: React.FC<UnifiedPostCardProps> = ({ 
  post, 
  userImage, 
  variant = 'default',
  className
}) => {
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
  const [loadingInteraction, setLoadingInteraction] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  
  // Determine post type and extract playlist info
  const isPlaylistPost = post.type === 'playlist' || Boolean(post.playlistId);
  const playlistInfo = isPlaylistPost ? {
    id: (post as PlaylistPost).playlistId || (post as RegularPost).playlistId,
    name: (post as PlaylistPost).playlistName || (post as RegularPost).playlistName,
    image: (post as PlaylistPost).playlistImage || (post as RegularPost).playlistImage,
    url: (post as PlaylistPost).playlistUrl || (post as RegularPost).playlistUrl
  } : null;
  
  // Ensure images is an array for regular posts
  const images = !isPlaylistPost && (post as RegularPost).images 
    ? Array.isArray((post as RegularPost).images) 
      ? (post as RegularPost).images as string[]
      : []
    : [];

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

  // Handle like button click with optimistic updates
  const handleLike = async () => {
    if (loadingInteraction) return;
    
    try {
      setLoadingInteraction(true);
      
      // Optimistic update with animation
      const newLikedState = !userLiked;
      setUserLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      // Trigger heartbeat animation
      if (newLikedState) {
        setLikeAnimation(true);
        setTimeout(() => setLikeAnimation(false), 300);
      }
      
      const response = await axios.post('/api/post-interactions', {
        postId: post._id,
        type: 'like'
      });
      
      // Confirm the actual state from server
      if (response.data.action === 'added') {
        setUserLiked(true);
        setLikeCount(response.data.count || likeCount);
      } else {
        setUserLiked(false);
        setLikeCount(response.data.count || likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setUserLiked(!userLiked);
      setLikeCount(prev => userLiked ? prev + 1 : prev - 1);
    } finally {
      setLoadingInteraction(false);
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
      
      // Try native sharing first
      if (navigator.share && playlistInfo) {
        try {
          await navigator.share({
            title: `Check out ${playlistInfo.name}`,
            text: post.content || `${post.user} shared a playlist: ${playlistInfo.name}`,
            url: playlistInfo.url || window.location.href
          });
          toast.success('Post shared successfully!', {
            description: 'Thank you for sharing with your friends'
          });
          return;
        } catch (shareError) {
          console.log('Share cancelled or failed, falling back to clipboard');
        }
      }
      
      // Fallback to clipboard
      const shareText = `Check out ${playlistInfo?.name || 'this post'} by ${post.user}${playlistInfo?.url ? `: ${playlistInfo.url}` : ''}`;
      await navigator.clipboard.writeText(shareText);
      
      toast.success('Link copied to clipboard!', {
        description: 'Share link has been copied to your clipboard',
        action: {
          label: 'Paste',
          onClick: () => {
            // Focus on a text input if available
            const textInput = document.querySelector('input[type="text"], textarea') as HTMLInputElement;
            if (textInput) {
              textInput.focus();
              document.execCommand('paste');
            }
          }
        }
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post', {
        description: 'Please try again in a moment'
      });
    }
  };

  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      componentTokens.card.default,
      componentTokens.card.hover,
      componentTokens.card.interactive,
      "overflow-hidden animate-fadeIn",
      isPlaylistPost && "border-l-4 border-l-brand-primary/30",
      !isPlaylistPost && images.length > 0 && "border-l-4 border-l-blue-500/30",
      isCompact ? "mb-4" : "mb-6",
      className
    )}>
      <CardHeader className={cn("pb-3", isCompact && "pb-2")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={cn(
              "border-2 border-brand-primary/10",
              isCompact ? "h-9 w-9" : "h-11 w-11"
            )}>
              <AvatarImage src={userImage} alt={post.user} />
              <AvatarFallback className="bg-brand-light text-brand-primary font-medium">
                {getInitials(post.user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={cn(
                "font-semibold text-foreground",
                isCompact && "text-sm"
              )}>
                {post.user}
              </p>
              <p className={cn(
                "text-muted-foreground",
                isCompact ? "text-xs" : "text-sm"
              )}>
                {relativeTime}
              </p>
            </div>
          </div>
          {isPlaylistPost && (
            <Badge variant="secondary" className="gap-1 bg-brand-light text-brand-primary border-brand-primary/20">
              <Music className="w-3 h-3" />
              Playlist
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {post.content && (
          <p className={cn(
            "whitespace-pre-line mb-4 text-foreground",
            isCompact && "text-sm"
          )}>
            {post.content}
          </p>
        )}
        
        {/* Regular post images */}
        {!isPlaylistPost && images.length > 0 && (
          <div className={cn(
            "grid gap-2 mb-4 rounded-lg overflow-hidden",
            images.length === 1 && "grid-cols-1",
            images.length === 2 && "grid-cols-2",
            images.length >= 3 && "grid-cols-2 sm:grid-cols-3"
          )}>
            {images.map((image: string, index: number) => (
              <div 
                key={index} 
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden group",
                  images.length === 3 && index === 0 && "row-span-2"
                )}
              >
                <img 
                  src={image} 
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}
        
        {/* Playlist content */}
        {isPlaylistPost && playlistInfo && (
          <Card className="mb-4 bg-gradient-to-br from-brand-light/50 to-brand-primary/5 border-brand-primary/20 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-5 h-5 text-brand-primary" />
                <h4 className="font-semibold text-foreground">{playlistInfo.name}</h4>
              </div>
              <div className="flex items-start space-x-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 group shadow-md">
                  <img
                    src={playlistInfo.image || '/default-playlist.png'}
                    alt={`${playlistInfo.name} cover`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-primary hover:bg-brand-secondary text-white rounded-full h-10 w-10 shadow-glow"
                      onClick={() => window.open(playlistInfo.url, '_blank')}
                      aria-label={`Play ${playlistInfo.name} on Spotify`}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">Spotify Playlist</p>
                  <a
                    href={playlistInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-brand-primary hover:text-brand-secondary text-sm font-medium hover:underline transition-colors duration-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Open in Spotify
                  </a>
                </div>
              </div>
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
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{likeCount}</span>
                </div>
              )}
              <div className="flex gap-4">
                {commentCount > 0 && (
                  <Button 
                    variant="link"
                    size="sm"
                    onClick={handleCommentClick} 
                    className="h-auto p-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                userImage={userImage || '/default-avatar.png'}
                userName={session?.user?.name || ''}
                onCommentSubmit={handleCommentSubmit}
              />
              
              {loadingComments ? (
                <div className="space-y-3">
                  <CommentSkeleton />
                  <CommentSkeleton />
                </div>
              ) : (
                <CommentList comments={comments} userImage={userImage || '/default-avatar.png'} />
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between bg-muted/20 border-t">
        <Button 
          variant={userLiked ? "default" : "ghost"} 
          size="sm" 
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            userLiked 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
          )}
          onClick={handleLike}
          disabled={loadingInteraction}
          aria-label={userLiked ? "Unlike post" : "Like post"}
        >
          <Heart className={cn(
            "h-4 w-4", 
            userLiked && "fill-current",
            likeAnimation && "heartbeat"
          )} />
          <span className="font-medium">Like</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 transition-all duration-200"
          onClick={handleCommentClick}
          aria-label="Comment on post"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-brand-light hover:text-brand-primary dark:hover:bg-brand-primary/10 transition-all duration-200"
          onClick={handleShare}
          aria-label="Share post"
        >
          <Share2 className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(UnifiedPostCard);
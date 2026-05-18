'use client';

import React from 'react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Share2, Music, ExternalLink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { getInitials, cn } from '@/lib/utils';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { CommentSkeleton } from '@/components/ui/skeletons';

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
  const images = Array.isArray(post.images) ? post.images : [];

  const {
    likeCount, commentCount, shareCount,
    userLiked, comments, showComments, loadingComments, loadingInteraction,
    handleLike, handleCommentClick, handleCommentSubmit, handleShare: sharePost,
    hasInteractions,
  } = usePostInteractions({
    postId: post._id,
    initialLikeCount: post.likeCount,
    initialCommentCount: post.commentCount,
    initialShareCount: post.shareCount,
  });

  const handleShare = async () => {
    try {
      const result = await sharePost({
        title: `Check out this post by ${post.user}`,
        text: post.content,
        url: post.playlistUrl || window.location.href,
      });
      if (result?.method === 'clipboard') {
        toast.success('Link copied to clipboard!');
      }
    } catch {
      toast.error('Failed to share post');
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
        {post.content && <p className="whitespace-pre-line mb-4">{post.content}</p>}

        {images.length > 0 && (
          <div className={cn(
            'grid gap-2 mb-4',
            images.length === 1 && 'grid-cols-1',
            images.length === 2 && 'grid-cols-2',
            images.length >= 3 && 'grid-cols-2 sm:grid-cols-3',
          )}>
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                <img src={image} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
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
              <a href={post.playlistUrl} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
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

        {hasInteractions && (
          <>
            <Separator className="my-3" />
            <div className="flex justify-between items-center py-1 text-sm text-muted-foreground">
              {likeCount > 0 && (
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{likeCount}</span>
                </div>
              )}
              <div className="flex gap-4">
                {commentCount > 0 && (
                  <Button variant="link" size="sm" onClick={handleCommentClick} className="h-auto p-0 text-muted-foreground hover:text-foreground">
                    {commentCount} comment{commentCount !== 1 ? 's' : ''}
                  </Button>
                )}
                {shareCount > 0 && <span>{shareCount} share{shareCount !== 1 ? 's' : ''}</span>}
              </div>
            </div>
          </>
        )}

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
                <div className="space-y-3"><CommentSkeleton /><CommentSkeleton /></div>
              ) : (
                <CommentList comments={comments} />
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-4 flex justify-between bg-muted/20">
        <Button
          variant={userLiked ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            userLiked ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20'
          )}
          onClick={handleLike}
          disabled={loadingInteraction}
        >
          <Heart className={cn('h-4 w-4', userLiked && 'fill-current')} />
          <span className="font-medium">Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 transition-all duration-200"
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

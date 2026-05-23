'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, ExternalLink, Play } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRelativeTime } from '../utils/useRelativeTime';
import { getInitials, cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { CommentSkeleton } from '@/components/ui/skeletons';
import { usePostInteractions } from '@/hooks/usePostInteractions';

interface PlaylistPost {
  _id: string;
  user: string;
  content?: string;
  created_at: string;
  playlistId: string;
  playlistName: string;
  playlistImage?: string;
  playlistUrl: string;
  user_email: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

interface PlaylistPostCardProps {
  post: PlaylistPost;
  userImage?: string;
}

const PlaylistPostCard: React.FC<PlaylistPostCardProps> = ({ post, userImage }) => {
  const relativeTime = useRelativeTime(post.created_at);
  const { data: session } = useSession();

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
        title: `Check out ${post.playlistName} by ${post.user}`,
        text: post.content || `${post.user} shared a playlist: ${post.playlistName}`,
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
    <Card className="mb-4 overflow-hidden max-w-2xl">
      <CardContent className="pt-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage src={userImage} alt={`${post.user}'s profile picture`} />
            <AvatarFallback>{getInitials(post.user)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user}</p>
            <p className="text-sm text-gray-500">{relativeTime}</p>
          </div>
        </div>

        {post.content && <p className="whitespace-pre-line mb-4">{post.content}</p>}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-32 h-32 relative rounded-md overflow-hidden flex-shrink-0 group">
              <img
                src={post.playlistImage || '/default-playlist.png'}
                alt={`${post.playlistName} cover`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  size="icon"
                  className="bg-brand hover:bg-brand/90 text-white rounded-full h-10 w-10"
                  onClick={() => window.open(post.playlistUrl, '_blank')}
                  aria-label={`Play ${post.playlistName} on Spotify`}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{post.playlistName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Spotify Playlist</p>
              <a
                href={post.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-sm hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Open in Spotify
              </a>
            </div>
          </div>
        </div>

        {hasInteractions && (
          <>
            <Separator className="my-2" />
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
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  >
                    {commentCount} comment{commentCount !== 1 ? 's' : ''}
                  </Button>
                )}
                {shareCount > 0 && (
                  <span>{shareCount} share{shareCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </>
        )}

        {showComments && (
          <div className="mt-4 border-t pt-4 space-y-4">
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
              <CommentList comments={comments} />
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant={userLiked ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'flex items-center gap-2 transition-all duration-200',
            userLiked
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={handleLike}
          disabled={loadingInteraction}
          aria-label={userLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart className={cn('h-4 w-4', userLiked && 'fill-current')} />
          <span className="font-medium">Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleCommentClick}
          aria-label="Comment on post"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
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

export default React.memo(PlaylistPostCard);

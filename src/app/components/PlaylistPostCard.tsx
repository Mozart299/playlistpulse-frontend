import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Share2, ExternalLink, Play } from 'lucide-react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { getInitials } from '@/lib/utils';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

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

  // State for interactions
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

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
        type: 'like',
      });
      if (response.data.action === 'added') {
        setUserLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      } else {
        setUserLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment button click
  const handleCommentClick = async () => {
    setShowComments(!showComments);
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
        content,
      });
      const newComment = {
        _id: response.data.commentId,
        postId: post._id,
        content,
        username: session?.user?.name,
        userEmail: session?.user?.email,
        created_at: new Date().toISOString(),
      };
      setComments((prevComments) => [newComment, ...prevComments]);
      setCommentCount((prevCount) => prevCount + 1);
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
        type: 'share',
      });
      setShareCount((prevCount) => prevCount + 1);
      alert('Post shared successfully!');
    } catch (error) {
      console.error('Error sharing post:', error);
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

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
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
              <p className="text-sm text-gray-600 mb-3">Spotify Playlist</p>
              <a
                href={post.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 text-sm hover:underline"
                role="link"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Open in Spotify
              </a>
            </div>
          </div>
        </div>

        {/* Interaction counts */}
        {(likeCount > 0 || commentCount > 0 || shareCount > 0) && (
          <div className="flex justify-between items-center py-2 text-sm text-gray-500 border-t mb-2">
            {likeCount > 0 && (
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-blue-500" />
                <span>{likeCount}</span>
              </div>
            )}
            <div className="flex space-x-4">
              {commentCount > 0 && (
                <button onClick={handleCommentClick} className="hover:underline">
                  {commentCount} comment{commentCount !== 1 ? 's' : ''}
                </button>
              )}
              {shareCount > 0 && (
                <span>
                  {shareCount} share{shareCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 border-t pt-4">
            <CommentForm
              postId={post._id}
              userImage={userImage || '/default-avatar.png'}
              userName={session?.user?.name || ''}
              onCommentSubmit={handleCommentSubmit}
            />
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <CommentList comments={comments} userImage={userImage || '/default-avatar.png'} />
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
          aria-label="Like post"
        >
          <ThumbsUp
            className={`mr-1 h-4 w-4 ${userLiked ? 'fill-current text-blue-600' : ''}`}
          />
          <span>Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center"
          onClick={handleCommentClick}
          aria-label="Comment on post"
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>Comment</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center"
          onClick={handleShare}
          aria-label="Share post"
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(PlaylistPostCard);
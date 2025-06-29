import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface UsePostInteractionsProps {
  postId: string;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialShareCount?: number;
}

export const usePostInteractions = ({
  postId,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialShareCount = 0
}: UsePostInteractionsProps) => {
  const { data: session } = useSession();
  
  // State for interactions
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  const [userLiked, setUserLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingInteraction, setLoadingInteraction] = useState(false);

  // Check if user has liked the post on component mount
  useEffect(() => {
    const checkUserLike = async () => {
      try {
        const response = await axios.get(`/api/post-interactions?postId=${postId}&type=like`);
        setUserLiked(response.data.userLiked);
        setLikeCount(response.data.count);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    if (session && postId) {
      checkUserLike();
    }
  }, [postId, session]);

  // Handle like button click with optimistic updates
  const handleLike = async () => {
    if (loadingInteraction || !session) return;
    
    try {
      setLoadingInteraction(true);
      
      // Optimistic update
      const newLikedState = !userLiked;
      setUserLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
      
      const response = await axios.post('/api/post-interactions', {
        postId,
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
      setUserLiked(userLiked);
      setLikeCount(prev => userLiked ? prev + 1 : prev - 1);
    } finally {
      setLoadingInteraction(false);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`/api/post-interactions?postId=${postId}&type=comment`);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
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

  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    if (!session) throw new Error('Must be logged in to comment');
    
    try {
      const response = await axios.post('/api/post-interactions', {
        postId,
        type: 'comment',
        content
      });
      
      // Add the new comment to the list
      const newComment = {
        _id: response.data.commentId,
        postId,
        content,
        username: session.user?.name,
        userEmail: session.user?.email,
        created_at: new Date().toISOString()
      };
      
      setComments(prevComments => [newComment, ...prevComments]);
      setCommentCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  };

  // Handle share with native sharing API fallback
  const handleShare = async (shareData?: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    try {
      await axios.post('/api/post-interactions', {
        postId,
        type: 'share'
      });
      
      setShareCount(prevCount => prevCount + 1);
      
      // Try native sharing first
      if (navigator.share && shareData) {
        try {
          await navigator.share(shareData);
          return { success: true, method: 'native' };
        } catch (shareError) {
          console.log('Native share cancelled or failed, falling back to clipboard');
        }
      }
      
      // Fallback to clipboard
      if (shareData?.url || shareData?.text) {
        const textToShare = shareData.url || shareData.text || 'Check out this post!';
        await navigator.clipboard.writeText(textToShare);
        return { success: true, method: 'clipboard' };
      }
      
      return { success: true, method: 'tracked' };
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  };

  return {
    // State
    likeCount,
    commentCount,
    shareCount,
    userLiked,
    comments,
    showComments,
    loadingComments,
    loadingInteraction,
    
    // Actions
    handleLike,
    handleCommentClick,
    handleCommentSubmit,
    handleShare,
    fetchComments,
    
    // Utilities
    hasInteractions: likeCount > 0 || commentCount > 0 || shareCount > 0
  };
};
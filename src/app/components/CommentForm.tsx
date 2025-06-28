import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface CommentFormProps {
  postId: string;
  userImage: string;
  userName: string;
  onCommentSubmit: (comment: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  userImage, 
  userName, 
  onCommentSubmit 
}) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onCommentSubmit(comment);
      setComment(''); // Clear the input after successful submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-2">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 relative">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] pr-10 resize-none"
        />
        <Button 
          type="submit" 
          size="sm" 
          variant="ghost" 
          className="absolute bottom-2 right-2"
          disabled={!comment.trim() || isSubmitting}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
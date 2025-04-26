import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { getInitials } from '@/lib/utils';

interface Comment {
  _id: string;
  username: string;
  userEmail: string;
  content: string;
  created_at: string;
}

interface CommentListProps {
  comments: Comment[];
  userImage: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, userImage }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment._id} 
          comment={comment}
          userImage={userImage}
        />
      ))}
    </div>
  );
};

const CommentItem: React.FC<{ comment: Comment; userImage: string }> = ({ 
  comment, 
  userImage 
}) => {
  const relativeTime = useRelativeTime(comment.created_at);

  return (
    <div className="flex space-x-2">
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarImage src={userImage} alt={comment.username} />
        <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <div className="font-medium text-sm">{comment.username}</div>
          <p className="text-sm">{comment.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>{relativeTime}</span>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <span className="text-xs">Reply</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
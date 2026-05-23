import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
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
        />
      ))}
    </div>
  );
};

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const relativeTime = useRelativeTime(comment.created_at);

  return (
    <div className="flex space-x-2">
      <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {getInitials(comment.username)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-muted rounded-lg px-3 py-2">
          <div className="font-medium text-sm text-foreground">{comment.username}</div>
          <p className="text-sm text-foreground/80">{comment.content}</p>
        </div>
        <div className="mt-1 text-xs text-muted-foreground pl-1">
          {relativeTime}
        </div>
      </div>
    </div>
  );
};

export default CommentList;

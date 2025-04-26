import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Share2, ExternalLink, Play } from 'lucide-react';
import { useRelativeTime } from '../utils/useRelativeTime';
import { getInitials } from '@/lib/utils';

interface PlaylistPost {
  _id: string;
  user: string;
  content: string;
  created_at: string;
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistUrl: string;
  user_email: string;
}

interface PlaylistPostCardProps {
  post: PlaylistPost;
  userImage: string;
}

const PlaylistPostCard: React.FC<PlaylistPostCardProps> = ({ post, userImage }) => {
  const relativeTime = useRelativeTime(post.created_at);

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="pt-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage src={userImage} alt={post.user} />
            <AvatarFallback>
              {getInitials(post.user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user}</p>
            <p className="text-xs text-gray-500">{relativeTime}</p>
          </div>
        </div>
        
        {post.content && <p className="whitespace-pre-line mb-4">{post.content}</p>}
        
        <div className="bg-gray-50 rounded-lg p-4 mb-2">
          <div className="flex items-start space-x-4">
            <div className="w-32 h-32 relative rounded-md overflow-hidden flex-shrink-0 group">
              <img 
                src={post.playlistImage || '/default-playlist.png'} 
                alt={post.playlistName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button 
                  size="icon" 
                  className="bg-brand hover:bg-brand/90 text-white rounded-full h-10 w-10"
                  onClick={() => window.open(post.playlistUrl, '_blank')}
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
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Open in Spotify
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button variant="ghost" size="sm" className="flex items-center">
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span>Like</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center">
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>Comment</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center">
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaylistPostCard;
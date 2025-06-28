import React, { useState } from 'react';
import axios from 'axios';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Share2 } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface SharePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  onShareSuccess?: () => void;
}

const SharePlaylistModal: React.FC<SharePlaylistModalProps> = ({
  isOpen,
  onClose,
  playlist,
  onShareSuccess
}) => {
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSubmit = async () => {
    if (!playlist) return;

    try {
      setIsSubmitting(true);
      
      await axios.post('/api/posts', {
        created_at: new Date().toISOString(),
        content: postContent,
        playlistId: playlist.id,
        playlistName: playlist.name,
        playlistImage: playlist.images[0]?.url,
        playlistUrl: playlist.external_urls.spotify,
      });
      
      setIsSubmitting(false);
      setPostContent('');
      onClose();
      
      if (onShareSuccess) {
        onShareSuccess();
      }
      
    } catch (error) {
      console.error('Error sharing playlist:', error);
      setIsSubmitting(false);
    }
  };

  if (!playlist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Playlist</DialogTitle>
          <DialogDescription>
            Share {playlist.name} with your connections
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start space-x-4 py-4">
          <div className="w-20 h-20 relative flex-shrink-0">
            <img 
              src={playlist.images[0]?.url || '/default-playlist.png'} 
              alt={playlist.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div>
            <h3 className="font-medium">{playlist.name}</h3>
            <a 
              href={playlist.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View on Spotify
            </a>
          </div>
        </div>
        
        <Textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write something about this playlist..."
          className="min-h-[100px]"
        />
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePostSubmit} 
            className="bg-brand hover:bg-brand/90"
            disabled={!postContent.trim() || isSubmitting}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Sharing...' : 'Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharePlaylistModal;
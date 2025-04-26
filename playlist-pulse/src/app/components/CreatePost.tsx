import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Smile,
  X,
  Music,
} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import PlaylistSelectorModal from './PlaylistSelectorModal'
import SharePlaylistModal from './SharePlaylistModal'
import useSpotifyToken from '../utils/useSpotifytoken'

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface CreatePostProps {
  userImage: string
  userName: string
  onPostSubmit: (post: any) => Promise<any>
}

const CreatePost: React.FC<CreatePostProps> = ({ userImage, userName, onPostSubmit }) => {
  const [postContent, setPostContent] = useState('')
  const [postImages, setPostImages] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Playlist related states
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [showPlaylistShareModal, setShowPlaylistShareModal] = useState(false)
  
  // Link input state
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  
  // Location input state
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  
  // Get Spotify token
  const { accessToken, error: tokenError } = useSpotifyToken()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      )
      setPostImages((prevImages) => [...prevImages, ...filesArray])
    }
  }

  const handleRemoveImage = (index: number) => {
    setPostImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const handleLinkInsert = () => {
    // Validate URL
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (urlPattern.test(linkInput)) {
      setPostContent((prevContent) => prevContent + ' ' + linkInput)
      setLinkInput('')
      setShowLinkInput(false)
    } else {
      alert('Please enter a valid URL (e.g., https://example.com)')
    }
  }

  const handleLocationInsert = () => {
    if (locationInput.trim()) {
      setPostContent((prevContent) => prevContent + ' 📍 ' + locationInput.trim())
      setLocationInput('')
      setShowLocationInput(false)
    } else {
      alert('Please enter a valid location')
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setPostContent((prevContent) => prevContent + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handlePlaylistButtonClick = () => {
    if (!accessToken) {
      alert('Please connect your Spotify account to share playlists')
      return
    }
    
    setShowPlaylistSelector(true)
  }

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setShowPlaylistSelector(false)
    setShowPlaylistShareModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPostValid()) return
    
    setIsSubmitting(true)
    
    try {
      const post = {
        content: postContent,
        images: postImages,
        created_at: new Date().toISOString(),
      }
      
      await onPostSubmit(post)
      
      // Reset form
      setPostContent('')
      setPostImages([])
      setShowLinkInput(false)
      setLinkInput('')
      setShowLocationInput(false)
      setLocationInput('')
    } catch (error) {
      console.error('Error submitting post:', error)
      alert('Failed to submit post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPostValid = () => {
    return postContent.trim() !== '' || postImages.length > 0
  }

  const handlePlaylistShareSuccess = () => {
    console.log('Playlist shared successfully')
  }

  return (
    <>
      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>
                  {userName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
                className="flex-1 resize-none focus-visible:ring-2"
                rows={3}
              />
            </div>
            
            {postImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {postImages.map((image, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden aspect-square">
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {showEmojiPicker && (
              <div className="absolute z-10 mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            
            {showLinkInput && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Enter a URL (e.g., https://example.com)"
                  className="flex-1 border rounded p-2 text-sm"
                  aria-label="Enter URL"
                />
                <Button
                  type="button"
                  onClick={handleLinkInsert}
                  size="sm"
                  aria-label="Add URL"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLinkInput('')
                    setShowLinkInput(false)
                  }}
                  size="sm"
                  aria-label="Cancel URL input"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {showLocationInput && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter your location (e.g., New York, NY)"
                  className="flex-1 border rounded p-2 text-sm"
                  aria-label="Enter location"
                />
                <Button
                  type="button"
                  onClick={handleLocationInsert}
                  size="sm"
                  aria-label="Add location"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLocationInput('')
                    setShowLocationInput(false)
                  }}
                  size="sm"
                  aria-label="Cancel location input"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  type="button"
                  aria-label="Upload photo"
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Photo</span>
                </Button>
              </label>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                type="button"
                onClick={() => setShowLinkInput(true)}
                aria-label="Insert link"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Link</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                type="button"
                onClick={() => setShowLocationInput(true)}
                aria-label="Insert location"
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Location</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Toggle emoji picker"
                aria-expanded={showEmojiPicker}
              >
                <Smile className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Emoji</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                type="button"
                onClick={handlePlaylistButtonClick}
                aria-label="Share playlist"
              >
                <Music className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Playlist</span>
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={!isPostValid() || isSubmitting}
              className="bg-brand hover:bg-brand/90"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <PlaylistSelectorModal
        isOpen={showPlaylistSelector}
        onClose={() => setShowPlaylistSelector(false)}
        onSelectPlaylist={handleSelectPlaylist}
      />
      
      <SharePlaylistModal
        isOpen={showPlaylistShareModal}
        onClose={() => setShowPlaylistShareModal(false)}
        playlist={selectedPlaylist}
        onShareSuccess={handlePlaylistShareSuccess}
      />
    </>
  )
}

export default CreatePost
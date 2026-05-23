import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Smile,
  X,
  Music,
  Send,
} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import PlaylistSelectorModal from './PlaylistSelectorModal'
import SharePlaylistModal from './SharePlaylistModal'
import useSpotifyToken from '../utils/useSpotifytoken'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { toast } from 'sonner'

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface NominatimResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
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
  const [locationSuggestions, setLocationSuggestions] = useState<NominatimResult[]>([])
  const [selectedLocation, setSelectedLocation] = useState<NominatimResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Get Spotify token
  const { accessToken, error: tokenError } = useSpotifyToken()

  // Refs
  const locationInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Debounced fetch for location suggestions
  const fetchLocationSuggestions = debounce(async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
        headers: {
          'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // Replace with your app name and email
        },
      })
      setLocationSuggestions(response.data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setLocationSuggestions([])
      setShowSuggestions(false)
    }
  }, 300)

  // Handle location input change
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocationInput(value)
    fetchLocationSuggestions(value)
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: NominatimResult) => {
    setSelectedLocation(suggestion)
    setLocationInput(suggestion.display_name)
    setShowSuggestions(false)
  }

  // Handle keyboard navigation for suggestions
  const handleSuggestionKeyDown = (e: React.KeyboardEvent, suggestion: NominatimResult) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSuggestionSelect(suggestion)
    }
  }

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
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (urlPattern.test(linkInput)) {
      setPostContent((prevContent) => prevContent + ' ' + linkInput)
      setLinkInput('')
      setShowLinkInput(false)
    } else {
      toast.warning('Please enter a valid URL (e.g., https://example.com)')
    }
  }

  const handleLocationInsert = () => {
    if (selectedLocation && selectedLocation.display_name) {
      setPostContent((prevContent) => prevContent + ' 📍 ' + selectedLocation.display_name)
      setLocationInput('')
      setSelectedLocation(null)
      setLocationSuggestions([])
      setShowSuggestions(false)
      setShowLocationInput(false)
    } else {
      toast.warning('Please select a valid location from the suggestions')
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setPostContent((prevContent) => prevContent + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handlePlaylistButtonClick = () => {
    if (!accessToken) {
      toast.warning('Please connect your Spotify account to share playlists')
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
        location: selectedLocation ? {
          address: selectedLocation.display_name,
          latitude: parseFloat(selectedLocation.lat),
          longitude: parseFloat(selectedLocation.lon),
        } : null,
      }
      
      await onPostSubmit(post)
      
      // Reset form
      setPostContent('')
      setPostImages([])
      setShowLinkInput(false)
      setLinkInput('')
      setShowLocationInput(false)
      setLocationInput('')
      setSelectedLocation(null)
      setLocationSuggestions([])
      setShowSuggestions(false)
    } catch (error) {
      console.error('Error submitting post:', error)
      toast.error('Failed to submit post. Please try again.')
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

  // Close location suggestions and emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <Card className="mb-6 border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-border">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {userName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Create a post</p>
              <p className="text-sm text-muted-foreground">Share what's on your mind</p>
            </div>
            {selectedPlaylist && (
              <Badge variant="secondary" className="gap-1">
                <Music className="w-3 h-3" />
                Playlist attached
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-0">
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
              className="flex-1 resize-none border-0 bg-muted/40 text-base shadow-none"
              rows={4}
            />
            
            {selectedLocation && (
              <div className="mt-3 p-3 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Location</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{selectedLocation.display_name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="mt-2 h-6 text-xs"
                >
                  Remove
                </Button>
              </div>
            )}
            
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
              <div className="relative" ref={emojiPickerRef}>
                <div className="absolute z-20 mt-2 right-0">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              </div>
            )}
            
            {showLinkInput && (
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Enter a URL (e.g., https://example.com)"
                  className="flex-1"
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
              <div className="mt-2 relative" ref={locationInputRef}>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={locationInput}
                    onChange={handleLocationInputChange}
                    placeholder="Search for a location (e.g., New York, NY)"
                    className="flex-1"
                    aria-label="Search for a location"
                    autoComplete="off"
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
                      setSelectedLocation(null)
                      setLocationSuggestions([])
                      setShowSuggestions(false)
                      setShowLocationInput(false)
                    }}
                    size="sm"
                    aria-label="Cancel location input"
                  >
                    Cancel
                  </Button>
                </div>
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul
                    className="absolute z-10 w-full bg-popover text-popover-foreground border border-border rounded-lg shadow-lg mt-1 max-h-60 overflow-auto"
                    role="listbox"
                    aria-label="Location suggestions"
                  >
                    {locationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 hover:bg-accent cursor-pointer text-sm transition-colors"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        onKeyDown={(e) => handleSuggestionKeyDown(e, suggestion)}
                        role="option"
                        tabIndex={0}
                        aria-selected={selectedLocation?.place_id === suggestion.place_id}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
          
          <Separator />
          <CardFooter className="pt-4 flex items-center gap-2 bg-muted/20 overflow-x-auto">
            <div className="flex space-x-1 flex-shrink-0">
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
                  className="text-muted-foreground hover:text-foreground"
                  type="button"
                  aria-label="Upload photo"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline font-medium">Photo</span>
                </Button>
              </label>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                type="button"
                onClick={() => setShowLinkInput(true)}
                aria-label="Insert link"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Link</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                type="button"
                onClick={() => setShowLocationInput(true)}
                aria-label="Insert location"
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Location</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Toggle emoji picker"
                aria-expanded={showEmojiPicker}
              >
                <Smile className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Emoji</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                type="button"
                onClick={handlePlaylistButtonClick}
                aria-label="Share playlist"
              >
                <Music className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Playlist</span>
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={!isPostValid() || isSubmitting}
              className="font-medium px-4 sm:px-6 gap-2 flex-shrink-0 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post
                </>
              )}
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

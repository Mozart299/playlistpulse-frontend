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
} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Image from 'next/image'

interface CreatePostProps {
  userImage: string
  userName: string
  onPostSubmit: (post: any) => Promise<void>
}

const CreatePost: React.FC<CreatePostProps> = ({ userImage, userName, onPostSubmit }) => {
  const [postContent, setPostContent] = useState('')
  const [postImages, setPostImages] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    const url = prompt("Enter a URL:")
    if (url) {
      setPostContent((prevContent) => prevContent + ' ' + url)
    }
  }

  const handleLocationInsert = () => {
    const newLocation = prompt("Enter your location:")
    if (newLocation) {
      setLocation(newLocation)
      setPostContent((prevContent) => prevContent + ' 📍 ' + newLocation)
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setPostContent((prevContent) => prevContent + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPostValid()) return
    
    setIsSubmitting(true)
    
    try {
      const post = {
        content: postContent,
        images: postImages,
        location: location,
        created_at: new Date().toISOString(),
      }
      
      await onPostSubmit(post)
      
      // Reset form
      setPostContent('')
      setPostImages([])
      setLocation('')
    } catch (error) {
      console.error('Error submitting post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPostValid = () => {
    return postContent.trim() !== '' || postImages.length > 0
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>
                {userName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
              className="flex-1 resize-none"
              rows={3}
            />
          </div>
          
          {postImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {postImages.map((image, index) => (
                <div key={index} className="relative rounded-md overflow-hidden aspect-square">
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    type="button"
                    onClick={() => handleRemoveImage(index)}
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
              onClick={handleLinkInsert}
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Link</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              type="button"
              onClick={handleLocationInsert}
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
            >
              <Smile className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Emoji</span>
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
  )
}

export default CreatePost
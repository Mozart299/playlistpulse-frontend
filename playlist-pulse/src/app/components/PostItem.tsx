import React from 'react'
import { useRelativeTime } from '../utils/useRelativeTime'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react'

interface Post {
  _id: string
  user: string
  content: string
  created_at: string
  images?: string[] | null
  playlistId?: string
  playlistName?: string
  playlistImage?: string
  playlistUrl?: string
  user_email: string
}

interface PostItemProps {
  post: Post
  userImage: string
}

const PostItem: React.FC<PostItemProps> = ({ post, userImage }) => {
  const relativeTime = useRelativeTime(post.created_at)
  
  // Ensure images is an array or default to an empty array
  const images = Array.isArray(post.images) ? post.images : []

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 border">
            <AvatarImage src={userImage} alt={post.user} />
            <AvatarFallback>
              {post.user.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user}</p>
            <p className="text-sm text-gray-500">{relativeTime}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <p className="whitespace-pre-line mb-4">{post.content}</p>
        
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                <div className="w-full h-full">
                  <img 
                    src={image} 
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {post.playlistImage && (
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">{post.playlistName}</p>
            <a 
              href={post.playlistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-48 h-48 relative hover:opacity-90 transition-opacity"
            >
              <div className="w-full h-full">
                <img
                  src={post.playlistImage}
                  alt={post.playlistName || 'Playlist'}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
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
  )
}

export default PostItem
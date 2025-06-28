'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Music, Sparkles, Shield, Zap } from 'lucide-react'
import Image from 'next/image'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/home' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-background to-muted/30">
        {/* Header Section */}
        <div className="relative p-8 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(248,149,8,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          
          <div className="relative z-10">
            <div className="relative mx-auto mb-6 w-20 h-20">
              <Image 
                src="/images/logo.png" 
                alt="Playlist Pulse Logo" 
                width={80} 
                height={80}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-brand text-white border-0 shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Beta
                </Badge>
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
                Playlist Pulse
              </span>
            </DialogTitle>
            
            <p className="text-muted-foreground mb-6">
              Connect your music and join thousands of music lovers discovering, 
              sharing, and vibing together.
            </p>
            
            {/* Features Preview */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Music className="w-5 h-5 text-brand" />
                </div>
                <p className="text-xs text-muted-foreground">Share Playlists</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">Instant Connect</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">Privacy First</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Login Section */}
        <div className="p-8 pt-0">
          <div className="space-y-4">
            <Button 
              onClick={() => handleLogin('spotify')} 
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-lg shadow-[#1DB954]/25 h-12 text-base gap-3 group"
            >
              <Image 
                src="/assets/spotify.png" 
                alt="Spotify Logo" 
                width={24} 
                height={24}
                className="group-hover:scale-110 transition-transform"
              />
              Continue with Spotify
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-800 border-gray-700 h-12 text-base gap-3 group"
              disabled
            >
              <Image 
                src="/assets/apple music.png" 
                alt="Apple Music Logo" 
                width={24} 
                height={24}
                className="group-hover:scale-110 transition-transform"
              />
              Apple Music (Coming Soon)
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="text-brand hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-brand hover:underline">Privacy Policy</a>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Your data is secure and never shared without permission</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
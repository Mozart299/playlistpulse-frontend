'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Music, Sparkles, Shield, Zap, X } from 'lucide-react'
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
      <DialogContent className="sm:max-w-md border-0 bg-white dark:bg-gray-900 p-0 shadow-2xl data-[state=open]:backdrop-blur-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-hidden rounded-lg">
          {/* Header Section with better contrast */}
          <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 px-8 py-12 text-center">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(248,149,8,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
            
            <div className="relative z-10">
              {/* Logo with better styling */}
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-lg flex items-center justify-center">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-orange-500 text-white border-0 shadow-lg text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Beta
                  </Badge>
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Welcome to Playlist Pulse
              </DialogTitle>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Connect your music and join thousands of music lovers discovering, 
                sharing, and vibing together.
              </p>
            </div>
          </div>

          {/* Features Preview with better visibility */}
          <div className="bg-white dark:bg-gray-900 px-8 py-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Share Playlists</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Instant Connect</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Privacy First</p>
              </div>
            </div>

            {/* Login buttons with better contrast */}
            <div className="space-y-3">
              <Button 
                onClick={() => handleLogin('spotify')} 
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-lg h-12 text-base font-semibold gap-3 group transition-all duration-200 hover:scale-[1.02]"
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
                className="w-full bg-black hover:bg-gray-800 text-white border-gray-600 h-12 text-base font-semibold gap-3 group transition-all duration-200 hover:scale-[1.02]"
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
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            {/* Footer with better readability */}
            <div className="text-center space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="#" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Your data is secure and never shared without permission</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
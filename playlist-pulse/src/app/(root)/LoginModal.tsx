'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image src="/images/logo.png" alt="App Logo" width={80} height={80} />
          </div>
          <DialogTitle className="text-2xl font-bold">Get Started</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            By logging in, you agree to our terms. Read our privacy policy.
          </p>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Button 
            onClick={() => handleLogin('spotify')} 
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <Image src="/assets/spotify.png" alt="Spotify Logo" width={24} height={24} className="mr-2" />
            Login with Spotify
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            <Image src="/assets/apple music.png" alt="Apple Music Logo" width={24} height={24} className="mr-2" />
            Login with Apple Music
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
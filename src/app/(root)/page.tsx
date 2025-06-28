'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Music, Users, MessageSquare, Calendar, Sparkles, Star, ArrowRight, Play } from 'lucide-react'
import LoginModal from './LoginModal'

const WelcomePage = () => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1 items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Playlist Pulse Logo"
                  width={48}
                  height={48}
                  className="h-12 w-auto"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
                  Playlist Pulse
                </h1>
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700">
                    <span className="sr-only">Open menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex items-center justify-between mb-6">
                    <a href="#" className="-m-1.5 p-1.5">
                      <Image
                        src="/images/logo.png"
                        alt="Playlist Pulse Logo"
                        width={40}
                        height={40}
                      />
                    </a>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="space-y-2 py-6">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-base"
                          onClick={openModal}
                        >
                          Features
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-base"
                          onClick={openModal}
                        >
                          About Us
                        </Button>
                      </div>
                      <div className="py-6">
                        <Button 
                          className="w-full"
                          onClick={openModal}
                        >
                          Log in
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden lg:flex lg:gap-x-8 items-center">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </Button>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
              </Button>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Community
              </Button>
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={openModal}
              >
                Sign in
              </Button>
              <Button 
                className="bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/25 gap-2"
                onClick={openModal}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-20 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="mb-8 flex justify-center">
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4" />
              Now in Beta - Join the Revolution
            </Badge>
          </div>
          
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Where Music
                </span>
                <br />
                <span className="bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
                  Meets Community
                </span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-xl leading-8 text-muted-foreground">
                Discover, share, and connect through music. Create playlists, find your tribe, 
                and turn every song into a conversation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-brand hover:bg-brand/90 text-white shadow-xl shadow-brand/25 px-8 py-6 text-lg gap-3 group"
                onClick={openModal}
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg gap-2 hover:bg-muted/50"
              >
                Watch Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="pt-8">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-brand/20 to-brand/40 rounded-full border-2 border-background"></div>
                  ))}
                </div>
                <span>Join 10,000+ music lovers already vibing together</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#gradient)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF9637" />
                <stop offset={1} stopColor="#F89508" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="gap-2 mb-6">
              <Star className="w-4 h-4" />
              Featured Experience
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Everything you need for
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
                social music discovery
              </span>
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Connect your favorite streaming service and unlock a world of musical connections.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand/20">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-brand to-brand/60 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Share Playlists</h3>
                  <p className="text-sm text-muted-foreground">
                    Show off your music taste with seamless playlist sharing
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 2 */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand/20">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Find Your Tribe</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with people who share your musical passions
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 3 */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand/20">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Music Conversations</h3>
                  <p className="text-sm text-muted-foreground">
                    Dive deep into discussions about artists and albums
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 4 */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-brand/20">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Discover Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Find live music events and see who's attending
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-muted/30">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-brand via-brand to-brand/80 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16 border border-brand/20">
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="mx-auto max-w-2xl">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                🎵 Limited Beta Access
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                Ready to revolutionize your music experience?
              </h2>
              <p className="text-lg leading-8 text-white/90 mb-10">
                Join thousands of music lovers who are already discovering, sharing, and connecting 
                through the power of music on Playlist Pulse.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-brand hover:bg-white/90 shadow-lg px-8 py-6 text-lg gap-3 group"
                  onClick={openModal}
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Connecting Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-white border-white/50 hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Explore Features
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-muted-foreground hover:text-brand transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand transition-colors">
              <span className="sr-only">Discord</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Playlist Pulse Logo"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-sm font-medium">Playlist Pulse</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2025 Playlist Pulse. Made with ❤️ for music lovers.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Login Modal */}
      <LoginModal isOpen={showModal} onClose={closeModal} />
    </div>
  )
}

export default WelcomePage
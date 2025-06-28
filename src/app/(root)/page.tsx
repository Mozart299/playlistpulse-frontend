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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()
  
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  
  const features = [
    {
      icon: Music,
      title: "Share Playlists",
      description: "Connect your Spotify and share your favorite playlists with friends and the community."
    },
    {
      icon: Users,
      title: "Find Music Matches",
      description: "Discover people with similar music taste and build meaningful connections."
    },
    {
      icon: MessageSquare,
      title: "Music Communities",
      description: "Join genre-specific groups and chat with fellow music enthusiasts."
    },
    {
      icon: Calendar,
      title: "Music Events",
      description: "Discover local concerts, festivals, and music events in your area."
    },
    {
      icon: Star,
      title: "Discover New Music",
      description: "Get personalized recommendations based on your music taste and community activity."
    },
    {
      icon: Sparkles,
      title: "Premium Features",
      description: "Unlock advanced features with premium membership and enhanced social tools."
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Playlists Shared" },
    { number: "100K+", label: "Songs Discovered" },
    { number: "25+", label: "Countries" }
  ]
  
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-black/80 border-b border-gray-800/40">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1 items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  The Playlist
                </h1>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white p-2"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black border-gray-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base text-white hover:bg-gray-800"
                    >
                      Features
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base text-white hover:bg-gray-800"
                    >
                      Community
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base text-white hover:bg-gray-800"
                    >
                      About
                    </Button>
                    <div className="pt-6 border-t border-gray-800">
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                        onClick={openModal}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden lg:flex lg:gap-x-8 items-center">
              <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-white">
                Features
              </Button>
              <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-white">
                Community
              </Button>
              <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-white">
                About
              </Button>
            </div>
            
            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
              <Button 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200"
                onClick={openModal}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-600/20 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Music Visualizer */}
          <div className="flex justify-center mb-8">
            <div className="flex items-end space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 rounded-full animate-bounce ${
                    i === 0 ? 'bg-orange-500 h-5' :
                    i === 1 ? 'bg-purple-500 h-8' :
                    i === 2 ? 'bg-pink-500 h-6' :
                    i === 3 ? 'bg-blue-500 h-10' :
                    'bg-green-500 h-4'
                  }`}
                  style={{animationDelay: `${i * 0.2}s`}}
                />
              ))}
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Connect Through
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent block">
              Music
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Share playlists, discover new sounds, and build meaningful connections with music lovers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200"
              onClick={openModal}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline"
              className="border-gray-600 text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> Connect</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to bring music lovers together
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-md border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Connect Through
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> Music?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of music lovers who are already building connections through shared playlists and musical experiences.
          </p>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold text-xl px-10 py-4 rounded-full shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200"
            onClick={openModal}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  The Playlist
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Connect with music lovers worldwide. Share playlists, discover new sounds, and build meaningful relationships through music.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 The Playlist. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={showModal} onClose={closeModal} />
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}

export default WelcomePage
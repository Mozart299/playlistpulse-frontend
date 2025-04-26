'use client';

import React from "react";
import { useSession } from "next-auth/react";
import HomeContent from "../../components/HomeContent";
import MusicEvents from "../../components/MusicEvents";
import MusicMatches from "../../components/MusicMatches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="flex">
      {/* Main content area */}
      <div className="flex-1 pr-4">
        <HomeContent />
      </div>
      
      {/* Side content area */}
      <div className="w-80 space-y-6">
        {/* Music Events Section */}
        <MusicEvents />
        
        {/* Music Matches Section */}
        <MusicMatches />
        
        {/* Music Promotions Section */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Music Promotions</CardTitle>
          </CardHeader>
          
          <CardContent className="p-3">
            <div className="flex flex-col items-center">
              <div className="w-full h-40 relative rounded-lg overflow-hidden mb-3">
                <Image 
                  src="/images/playlist3.jpg" 
                  alt="New playlist alert" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <h3 className="font-semibold text-center mb-2">New playlist alert!!</h3>
              <p className="text-sm text-center text-gray-600">
                Discover fresh sounds and vibes<br />for your daily playlist rotation!
              </p>
              
              <Button 
                className="bg-brand hover:bg-brand/90 text-white mt-4 w-full"
                asChild
              >
                <Link href="/promotions/new-playlist">
                  Explore Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
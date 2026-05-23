'use client';

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import HomeContent from "@/app/components/HomeContent";

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
          {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'Music Lover'}!
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Ready to discover new sounds and connect with fellow music enthusiasts?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Link href="/discover" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Discover</h3>
                <p className="text-xs text-muted-foreground hidden sm:block">Browse playlists</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/matches" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Matches</h3>
                <p className="text-xs text-muted-foreground hidden sm:block">Find music twins</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/events" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Events</h3>
                <p className="text-xs text-muted-foreground hidden sm:block">Music events</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Real Posts Feed using HomeContent component */}
      <HomeContent />
    </div>
  );
};

export default HomePage;

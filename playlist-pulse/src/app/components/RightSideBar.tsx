import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const RightSideBar: React.FC = () => {
    return (
        <div className="bg-gray-50 w-56 h-screen overflow-y-auto border-l border-gray-200 shadow-sm">
            {/* Music Community Chats Section */}
            <div className="p-3">
                <h3 className="font-semibold text-sm px-2 py-2">Music Community Chats</h3>
                
                <div className="space-y-2 mt-2">
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/albumcover1.jpg" alt="Folk Enthusiasts" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Folk Enthusiasts</span>
                    </Link>
                    
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/playlist4.jpg" alt="Nordic Friends Band" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Nordic Friends Band</span>
                    </Link>
                    
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/playlist3.jpg" alt="Retro Mix" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Retro Mix</span>
                    </Link>
                </div>
            </div>
            
            <Separator className="my-2" />
            
            {/* Interest Groups Section */}
            <div className="p-3">
                <h3 className="font-semibold text-sm px-2 py-2">Interest Groups</h3>
                
                <div className="space-y-2 mt-2">
                    <Link href="/messages" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-6 h-6 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/event4.jpg" alt="Music Enthusiasts" width={24} height={24} className="object-cover" />
                        </div>
                        <span className="text-xs truncate">Music Enthusiasts</span>
                    </Link>
                    
                    <Link href="/playlists" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-6 h-6 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/albumcover1.jpg" alt="Amapiano Groove" width={24} height={24} className="object-cover" />
                        </div>
                        <span className="text-xs truncate">Amapiano Groove</span>
                    </Link>
                    
                    <Link href="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-6 h-6 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/albumcover2.jpg" alt="Mental Heads" width={24} height={24} className="object-cover" />
                        </div>
                        <span className="text-xs truncate">Mental Heads</span>
                    </Link>
                    
                    <Link href="/playlists" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-6 h-6 relative mr-2 rounded overflow-hidden flex-shrink-0">
                            <Image src="/images/albumcover4.jpg" alt="Oldies Lovers" width={24} height={24} className="object-cover" />
                        </div>
                        <span className="text-xs truncate">Oldies Lovers</span>
                    </Link>
                </div>
            </div>
            
            <Separator className="my-2" />
            
            {/* Connect with Others Section */}
            <div className="p-3">
                <h3 className="font-semibold text-sm px-2 py-2">Connect with Others</h3>
                
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden flex-shrink-0">
                            <Image src="/images/event2.jpg" alt="Music lover" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Music lover</span>
                    </Link>
                    
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden flex-shrink-0">
                            <Image src="/images/albumcover1.jpg" alt="Playlist curator" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Playlist curator</span>
                    </Link>
                    
                    <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden flex-shrink-0">
                            <Image src="/images/event1.jpg" alt="Music fan" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-sm truncate">Music fan</span>
                    </Link>
                </div>
                
                <div className="text-center pt-3">
                    <Link href="/people" className="text-xs text-blue-600 hover:underline">See more people</Link>
                </div>
            </div>
        </div>
    );
};

export default RightSideBar;
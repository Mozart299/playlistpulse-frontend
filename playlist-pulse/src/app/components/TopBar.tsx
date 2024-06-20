// src/components/TopBar.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TopBar: React.FC = () => {
    return (
        <div className="bg-white shadow-md py-5 px-4 flex items-center justify-between">
            <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold">
                    The Playlist
                </Link>
            </div>
            <div className="flex-1 mx-20 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/assets/search.png" alt="Search" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for music playlists"
                    className="w-full p-2 rounded-md border border-gray-300 placeholder-padding"
                />
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/messages" className="relative">
                    <img src="/assets/chat.png" alt="Messages" className="w-4 h-4" />
                </Link>
                <Link href="/notifications" className="relative">
                    <img src="/assets/notification.png" alt="Notifications" className="w-4 h-4" />
                </Link>
                <Link href="/profile" className="relative">
                    <Image src="/images/profile-picture.jpg" alt="Profile" width={40} height={40} className="rounded-full" />
                </Link>
            </div>
        </div>
    );
};

export default TopBar;

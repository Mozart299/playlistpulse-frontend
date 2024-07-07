"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const TopBar: React.FC = () => {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-brand shadow-md py-5 px-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">
            <div className="flex items-center">
                <Link href="/home" className="text-2xl font-bold text-white">
                    The Playlist
                </Link>
            </div>
            <div className="flex-1 mx-20 relative">
                <input
                    type="text"
                    placeholder="Search for anything"
                    className="w-full p-2 rounded-md border border-gray-300 "
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/messages" className="relative">
                    <img src="/assets/chat.svg" alt="Messages" className="w-4 h-4" />
                </Link>
                <Link href="/notifications" className="relative">
                    <img src="/assets/notification.svg" alt="Notifications" className="w-4 h-4" />
                </Link>
                <Link href="/my-profile" className="relative">
                    <Image src={session?.user?.image as string} alt="Profile" width={40} height={40} className="rounded-full" />
                </Link>
            </div>
        </div>
    );
};

export default TopBar;

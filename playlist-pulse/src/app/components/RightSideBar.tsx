
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RightSideBar: React.FC = () => {
    return (
        <div className="bg-customgray text-black w-56 min-h-screen flex flex-col ">
            <div className="flex flex-col p-4 ">
                <span className=" font-semibold ">Music Community Chats</span>
            </div>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Folk Enthusiasts
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/playlist4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Nordic Friends Band
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/playlist3.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Retro Mix 
            </Link>
            <div className='flex px-4 pt-5 pb-2'>
                    <span className='font-semibold'>Interest Groups</span>
                </div>
                <Link href="/messages" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/images/event4.jpg" alt="Playlists" width={30} height={30} className="mr-3 rounded-md" />
                    Music Enthusiasts
                </Link>
                <Link href="/playlists" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/images/albumcover1.jpg" alt="Playlists" width={30} height={30} className="mr-3 rounded-md" />
                    Amapiano Groove
                </Link>
                <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/images/albumcover2.jpg" alt="Settings" width={30} height={30} className="mr-3 rounded-md" />
                    Mental Heads
                </Link>
                <Link href="/messages" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/images/albumcover3.jpg" alt="Playlists" width={30} height={30} className="mr-3 rounded-md" />
                    Latest Updates
                </Link>
                <Link href="/playlists" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/images/albumcover4.jpg" alt="Playlists" width={30} height={30} className="mr-3 rounded-md" />
                    Oldies Lovers
                </Link>
            <div className="flex flex-col p-4 ">
                <span className=" font-semibold ">Connect with Others</span>
            </div>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/event2.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music lover
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Playlist curator
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/event1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music fan
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/event2.jpg" alt="image" width={50} height={50} className="mr-3 event4" />
                Playlist sharer
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/event5.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music Buddy
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover3.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music explorer
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music aficionado
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover2.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music listener
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-2">
                <Image src="/images/albumcover1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-md" />
                Music supporter
            </Link>

        </div>
    );
};

export default RightSideBar;


import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SideBar: React.FC = () => {
    return (
        <div className="bg-customgray text-black w-56 min-h-screen flex flex-col">
            <div className="flex p-6 ">
                <span className="text-2xl font-bold ">Discover</span>
            </div>
            <nav className="flex flex-col p-4">
                <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/home.png" alt="Home" width={20} height={20} className="mr-3" />
                    Home
                </Link>
                <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/user.png" alt="Profile" width={20} height={20} className="mr-3" />
                    My Profile
                </Link>
                <div className='flex px-4 pt-5 pb-2'>
                    <span className='text-xl font-semibold'>My Favourites</span>
                </div>
                <Link href="/messages" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/chat.png" alt="Playlists" width={20} height={20} className="mr-3" />
                    Inbox
                </Link>
                <Link href="/playlists" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/people.png" alt="Playlists" width={20} height={20} className="mr-3" />
                    My Connections
                </Link>
                <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/news.png" alt="Settings" width={20} height={20} className="mr-3" />
                    News Feed
                </Link>
                <Link href="/playlists" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/events.png" alt="Playlists" width={20} height={20} className="mr-3" />
                    Upcoming Events
                </Link>

                <Link href="/playlists" className="flex items-center px-4 py-10 hover:bg-gray-700 rounded-md">
                    <Image src="/assets/signout.png" alt="Playlists" width={20} height={20} className="mr-3" />
                    Sign Out
                </Link>
            </nav>
        </div>
    );
};

export default SideBar;

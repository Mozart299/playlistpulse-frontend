import React from "react";
import Image from 'next/image';
import Link from "next/link";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import RightSideBar from "./components/RightSideBar";


const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <div className="flex flex-1">
                <SideBar />
                <div className="flex flex-col flex-1 p-4 bg-gray-100">
                    <div className="bg-white p-4 mb-4 shadow-md rounded-lg">01</div>
                    <div className="bg-white p-4 mb-4 shadow-md rounded-lg">02</div>
                    <div className="bg-white p-4 mb-4 shadow-md rounded-lg">03</div>
                    <div className="bg-white p-4 mb-4 shadow-md rounded-lg">04</div>
                </div>
                <div className="flex flex-col p-4">
                    <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
                        <div className='flex flex-col p-1'>
                            <span className='font-semibold pb-2'>
                                Your Music Events
                            </span>
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Music BBQ</h3>
                                    <span>Sat 16 June, Playlist Garden</span>
                                </div>
                            </Link>
                            <hr />
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Playlist Groove</h3>
                                    <span>Sat 16 June, Playlist Garden</span>
                                </div>
                            </Link>
                            <hr />
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">indie Music Fest</h3>
                                    <span>Sat 16 June, Playlist Garden</span>
                                </div>
                            </Link>
                            <hr />
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Stand-up Comedy Night</h3>
                                    <span>Sat 16 June, Playlist Garden</span>
                                </div>
                            </Link>
                            <hr />
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Concert Tour 2023</h3>
                                    <span>Sat 16 June, Playlist Garden</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
                        <div className='flex flex-col p-1'>
                            <span className='text-lg font-semibold pb-2'>
                                Music Matches
                            </span>
                            <span className='font-semibold py-2'>
                                Today's Picks
                            </span>
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Lila Thompson</h3>
                                    <span>Discovering new beats</span>
                                </div>
                            </Link>
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover2.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Ethan Reynolds</h3>
                                    <span>Jamming to favourite tunes</span>
                                </div>
                            </Link>

                            <span className='font-semibold py-2'>
                                New Releases
                            </span>
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover3.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Sophie Walker</h3>
                                    <span>Creating a new mix</span>
                                </div>
                            </Link>

                            <span className='font-semibold py-2'>
                                Top Charts
                            </span>
                            <Link href="/dashboard" className="flex items-center px-0 py-2">
                                <Image src="/images/albumcover4.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                                <div className="flex-col">
                                    <h3 className="font-semibold">Oliver Scott</h3>
                                    <span>Exploring indie tracks</span>
                                </div>
                            </Link>

                        </div>
                    </div>
                    <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
                        <div className='flex flex-col p-1'>
                            <span className='font-semibold pb-2'>
                                Music Promotions
                            </span>
                            <Image src="/images/playlist3.jpg" width={250} height={50} alt="image" className="rounded-lg" />
                            <span className='text-x font-semibold py-2'>
                                New playlist alert!!
                            </span>
                            <p>Discover fresh sounds and vibes<br />for your daily playlist rotation!</p>
                        </div>
                    </div>
                </div>
                <RightSideBar />
            </div>
        </div>
    );
};

export default Home;

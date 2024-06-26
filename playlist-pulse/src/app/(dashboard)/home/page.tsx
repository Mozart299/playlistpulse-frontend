"use client";
import React, { useState,  useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import RightSideBar from "../../components/RightSideBar";



const post = {
  userProfileImage: '/images/profile-picture.jpg',
  userName: 'John Smith',
  postTitle: 'My Recent Adventure',
  postTime: '2 hours ago',
  postContent: 'Had an amazing time hiking the trails at the national park. The views were breathtaking!',
  postImages: [
    '/images/playlist1.jpg',
    '/images/playlist3.jpg',
    '/images/playlist4.jpg',
  ],
};

const Home: React.FC = () => {

  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Post content:', postContent);
    console.log('Post images:', postImages);
    setPostContent('');
    setPostImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPostImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };



  return (
    <div className="flex min-h-screen">
      <TopBar />
      <SideBar />
      <div className="flex overflow-hidden pt-20 pl-56">
        {/*Main content*/}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
            <form onSubmit={handlePostSubmit}>
              <div className="flex items-center mb-4">
                <Image src="/images/profile-picture.jpg" alt="User Profile" width={40} height={40} className="rounded-lg" />
                <input
                  type="text"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="ml-4 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Share your favourite Spotify playlist..."
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
                  Add Photos
                </label>
                <button type="submit" className="bg-brand text-white px-4 py-2 rounded-md">
                  Share
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {postImages.map((image, index) => (
                  <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={image} alt={`Post image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </form>
          </div>
          <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
            <div className="flex items-center mb-4">
              <Image src="/images/profile-picture4.jpg" alt="User Profile" width={40} height={40} className="rounded-md" />
              <div className="ml-3">
                <p className="font-bold">Angella Davont</p>
                <p className="text-sm text-gray-600">{post.postTime}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Share your music journey and connect with like-minded individuals. Here's a glimpse of my latest music adventures.</p>
            <div className="flex space-x-4 mb-4">
              <Image src="/images/event4.jpg" alt="Photo 1" width={200} height={200} className="rounded-lg" />
              <Image src="/images/albumcover4.jpg" alt="Photo 2" width={200} height={200} className="rounded-lg" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/like.png" alt="Like" width={20} height={20} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/comment.png" alt="Comment" width={20} height={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/share.png" alt="Share" width={20} height={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
            <div className="flex items-center mb-4">
              <Image src="/images/profile-picture3.jpg" alt="User Profile" width={40} height={40} className="rounded-md" />
              <div className="ml-3">
                <p className="font-bold">Paul Wayden</p>
                <p className="text-sm text-gray-600">{post.postTime}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula mauris et sem consequat, a pellentesque eros sagittis.</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Image src="/images/event1.jpg" alt="Photo 1" width={150} height={150} className="rounded-lg" />
              <Image src="/images/event2.jpg" alt="Photo 2" width={150} height={150} className="rounded-lg" />
              <Image src="/images/event3.jpg" alt="Photo 3" width={150} height={150} className="rounded-lg" />
              <Image src="/images/playlist5.jpg" alt="Photo 1" width={150} height={150} className="rounded-lg" />
              <Image src="/images/albumcover2.jpg" alt="Photo 2" width={150} height={150} className="rounded-lg" />
              <Image src="/images/albumcover5.jpg" alt="Photo 3" width={150} height={150} className="rounded-lg" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/like.png" alt="Like" width={20} height={20} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/comment.png" alt="Comment" width={20} height={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/share.png" alt="Share" width={20} height={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
            <div className="flex items-center mb-4">
              <Image src="/images/profile-picture5.jpg" alt="User Profile" width={40} height={40} className="rounded-md" />
              <div className="ml-3">
                <p className="font-bold">Peter Olamide</p>
                <p className="text-sm text-gray-600">{post.postTime}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula mauris et sem consequat, a pellentesque eros sagittis.</p>
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/like.png" alt="Like" width={20} height={20} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/comment.png" alt="Comment" width={20} height={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Image src="/assets/share.png" alt="Share" width={20} height={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        {/*Side content*/}
        <div className="w-80 overflow-y-auto p-4">
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
                <Image src="/images/albumcover3.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                <div className="flex-col">
                  <h3 className="font-semibold">Playlist Groove</h3>
                  <span>Sat 16 June, Playlist Garden</span>
                </div>
              </Link>
              <hr />
              <Link href="/dashboard" className="flex items-center px-0 py-2">
                <Image src="/images/albumcover2.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                <div className="flex-col">
                  <h3 className="font-semibold">indie Music Fest</h3>
                  <span>Sat 16 June, Playlist Garden</span>
                </div>
              </Link>
              <hr />
              <Link href="/dashboard" className="flex items-center px-0 py-2">
                <Image src="/images/albumcover1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
                <div className="flex-col">
                  <h3 className="font-semibold">Stand-up Comedy Night</h3>
                  <span>Sat 16 June, Playlist Garden</span>
                </div>
              </Link>
              <hr />
              <Link href="/dashboard" className="flex items-center px-0 py-2">
                <Image src="/images/event1.jpg" alt="image" width={50} height={50} className="mr-3 rounded-lg" />
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

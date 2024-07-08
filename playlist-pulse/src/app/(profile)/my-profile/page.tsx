"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TopBar from '@/app/components/TopBar';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import AllPlaylists from '@/app/(playlists)/all-playlists/page';
import PostItem from '@/app/components/PostItem';
import EmojiPicker from 'emoji-picker-react';


const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState('');
  const [posts, setPosts] = useState<any[]>([]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedUrls = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await response.json();
          return data.url; // The URL of the uploaded image
        })
      );
      setPostImages((prevImages) => [...prevImages, ...uploadedUrls]);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter a URL:");
    if (url) {
      setPostContent(prevContent => prevContent + ' ' + url);
    }
  };

  const handleLocationInsert = () => {
    const newLocation = prompt("Enter your location:");
    if (newLocation) {
      setLocation(newLocation);
      setPostContent(prevContent => prevContent + ' 📍 ' + newLocation);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setPostContent(prevContent => prevContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handlePostSubmit = (e: any) => {
    e.preventDefault();
    const post = {
      content: postContent,
      images: postImages,
      location: location,
      created_at: new Date().toISOString(),
    };
    onPostSubmit(post);
    setPostContent('');
    setPostImages([]);
    setLocation('');
  };


  const isShareButtonEnabled = postContent.trim() !== '' || postImages.length > 0 || location !== '';

  const onPostSubmit = async (postData: any) => {
    try {
      // Send the post data to your API
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit post');
      }

      const newPost = await response.json();

      // Update the local state with the new post
      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Optionally, you could show a success message to the user
      alert('Post submitted successfully!');
    } catch (error) {
      console.error('Error submitting post:', error);
      // Optionally, show an error message to the user
      alert('Failed to submit post. Please try again.');
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      console.log('Fetched posts:', response.data);
    }

    fetchPosts();
  }, []);


  useEffect(() => {
    const fetchPlaylists = async () => {
      if (session?.accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const allPlaylists = response.data.items;
          const randomPlaylists = shuffleArray([...allPlaylists]).slice(0, 4);
          setPlaylists(randomPlaylists);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      }
    };

    fetchPlaylists();
  }, [session]);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const user = {
    name: session?.user?.name,
    followers: 34554,
    profilePicture: session?.user?.image as string,
    bannerImage: '/images/banner-image.jpg',
  };


  return (
    <div>
      <TopBar />
      <div className="container mx-auto mt-24 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative h-40 rounded-lg overflow-hidden mb-4">
            <Image src={user.bannerImage} alt="Banner" layout="fill" objectFit="cover" className="w-full h-full object-cover" />
          </div>
          <div className="relative flex items-center pb-2 bg-white rounded-lg">
            <div className="relative -mt-16">
              <Image src={user.profilePicture} alt="Profile Picture" width={120} height={120} className="rounded-full border-4 border-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg">{user.followers.toLocaleString()} followers</p>
            </div>
            <div className="ml-auto space-x-4 flex items-center">
              <button className="bg-brand text-white px-4 py-2 rounded-md">Connect</button>
              <button className="bg-customgray text-black px-4 py-2 rounded-md">Chat</button>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="flex items-center space-x-2 bg-brand px-4 py-2 text-white rounded-md">
              <span>Share</span>
            </button>
            <Link href="/all-playlists" className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Playlists</span>
            </Link>
            <button className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-2 bg-customgray text-black px-4 py-2 rounded-md">
              <span>Connections</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg py-8 mb-8">
          <div className="grid grid-cols-3 grid-flow-row  ">

            <div className="col-span-2 p-6 pb-0 pt-0 px-0 rounded-lg mr-5">
              <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
                <form onSubmit={handlePostSubmit}>
                  {/* Your form content */}
                  <div className="flex items-center mb-4">
                    <Image src={session?.user?.image as string} alt="User Profile" width={40} height={40} className="rounded-lg" />
                    <input
                      type="text"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="ml-4 w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Share your thoughts"
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
                    <label htmlFor="file-input" className="cursor-pointer">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </label>
                    <button type="button" onClick={handleLinkInsert}>
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    <button type="button" onClick={handleLocationInsert}>
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      type="submit"
                      className={`bg-brand text-white px-4 py-2 rounded-md ${!isShareButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isShareButtonEnabled}
                    >
                      Share
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute z-10">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  {postImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {postImages.map((image, index) => (
                        <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                          <img src={image} alt={`Post image ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
              {/* Posts */}
              <div>
                {posts.map(post => (
                  <PostItem
                    key={post._id}
                    post={post}
                    userImage={session?.user?.image as string}
                  />
                ))}
              </div>
            </div>
            <div className="bg-gray-300 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Shared Playlists</h3>
                <Link href="/all-playlists" className="text-blue-600 hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {playlists.map((playlist) => (
                  <a key={playlist.id} href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="relative group">
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <Image src={playlist.images[0]?.url || '/default-playlist.png'} alt={playlist.name} layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <span className="text-white text-center">{playlist.name}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-gray-200 p-6 rounded-lg mt-5">
                <h3 className="text-x font-bold mb-2">User Info</h3>
                <div className="space-y-2">
                  <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add bio</button>
                  <button className="bg-gray-300 p-2 rounded-md w-full text-center">Edit Profile</button>
                  <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add interests</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

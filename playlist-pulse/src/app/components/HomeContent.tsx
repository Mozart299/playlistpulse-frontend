"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useSession } from "next-auth/react";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import PostItem from "./PostItem";


const HomeContent: React.FC = () => {
    const { data: session, status } = useSession();
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState<string[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [location, setLocation] = useState('');
    const [posts, setPosts] = useState<any[]>([]);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setPostImages((prevImages) => [...prevImages, ...filesArray]);
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
        }

        fetchPosts();
    }, []);



    return (
        <>
            {/*Main content*/}
            <div className="flex-1 overflow-y-auto p-4 px-10 ">
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


            {/*Side content*/}
            <div className="w-80 overflow-y-auto p-4">
                {/* Your side content */}
                <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
                    <div className='flex flex-col p-1'>
                        <span className='font-semibold pb-2'>
                            Your Music Events
                        </span>
                        {/* Music event components... */}
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
                        {/* Music match components... */}
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
        </>
    );
};

export default HomeContent;
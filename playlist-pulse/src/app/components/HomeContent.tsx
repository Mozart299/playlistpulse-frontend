'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useSession } from "next-auth/react";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const post = {
            content: postContent,
            images: postImages,
            location: location,
            created_at: new Date().toISOString(),
        };
        
        try {
            // Send the post data to your API
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                throw new Error('Failed to submit post');
            }

            const newPost = await response.json();

            // Update the local state with the new post
            setPosts(prevPosts => [newPost, ...prevPosts]);

            // Reset form
            setPostContent('');
            setPostImages([]);
            setLocation('');
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const isShareButtonEnabled = postContent.trim() !== '' || postImages.length > 0 || location !== '';

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }

        fetchPosts();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Create Post Card */}
            <Card className="mb-6 shadow-sm border border-gray-200">
                <CardContent className="p-4">
                    <form onSubmit={handlePostSubmit}>
                        <div className="flex items-center mb-4">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={session?.user?.image as string} alt="Profile" />
                                <AvatarFallback>{session?.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <input
                                type="text"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="ml-4 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/50 focus:border-brand"
                                placeholder="Share your thoughts"
                            />
                        </div>
                        
                        {postImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {postImages.map((image, index) => (
                                    <div key={index} className="relative rounded-lg overflow-hidden h-24">
                                        <img 
                                            src={image} 
                                            alt={`Post image ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPostImages(imgs => imgs.filter((_, i) => i !== index))}
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="file-input"
                                />
                                <label htmlFor="file-input" className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </label>
                                <button type="button" onClick={handleLinkInsert} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </button>
                                <button type="button" onClick={handleLocationInsert} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                            
                            <Button
                                type="submit"
                                className={`bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-md ${!isShareButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isShareButtonEnabled}
                            >
                                Share
                            </Button>
                        </div>
                        
                        {showEmojiPicker && (
                            <div className="absolute z-10 mt-2">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostItem 
                            key={post._id} 
                            post={post} 
                            userImage={session?.user?.image as string} 
                        />
                    ))
                ) : (
                    <Card className="text-center p-6">
                        <p className="text-gray-500">No posts yet. Be the first to share!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default HomeContent;
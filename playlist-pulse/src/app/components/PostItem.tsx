import React from 'react';
import Image from 'next/image';
import { useRelativeTime } from '../utils/useRelativeTime';

interface Post {
    _id: string;
    user: string;
    content: string;
    created_at: string;
    images?: string[] | null;
    playlistId?: string;
    playlistName?: string;
    playlistImage?: string;
    playlistUrl?: string;
    user_email: string;

}

interface PostItemProps {
    post: Post;
    userImage: string;
}

const PostItem: React.FC<PostItemProps> = ({ post, userImage }) => {
    console.log('Post in PostItem:', post);
    console.log('Images in PostItem:', post.images);


    const relativeTime = useRelativeTime(post.created_at);

    // Ensure images is an array or default to an empty array
    const images = Array.isArray(post.images) ? post.images : [];

    return (
        <div className="bg-customgray p-4 mb-4 shadow-md rounded-lg">
            <div className="flex items-center mb-4">
                <Image src={userImage} alt="User Profile" width={40} height={40} className="rounded-md" />
                <div className="ml-3">
                    <p className="font-bold">{post.user}</p>
                    <p className="text-sm text-gray-600">{relativeTime}</p>
                </div>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {images.map((image: string, index: number) => (
                    <Image key={index} src={image} alt={`Photo ${index + 1}`} width={150} height={150} className="rounded-lg" />
                ))}

                {post.playlistImage && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">{post.playlistName}</p>
                        <a href={post.playlistUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={post.playlistImage}
                                alt={post.playlistName || 'Playlist'}
                                width={150}
                                height={150}
                                className="rounded-lg"
                            />
                        </a>
                    </div>
                )}
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
    );
};

export default PostItem;
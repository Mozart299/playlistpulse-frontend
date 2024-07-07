import { useRelativeTime } from "../utils/useRelativeTime";
import Image from "next/image";


const PostItem: React.FC<{ post: any, userImage: string }> = ({ post, userImage }) => {
    const relativeTime = useRelativeTime(post.created_at);

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
                {post.images.map((image: any, index: number) => (
                    <Image key={index} src={image} alt={`Photo ${index + 1}`} width={150} height={150} className="rounded-lg" />
                ))}
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
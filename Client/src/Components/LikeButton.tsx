import { useState } from "react";
import { likePost } from "@/Store/Post";
import { Button } from "@/components/ui/button";
import { RiHeartLine, RiHeartFill } from "@remixicon/react";
import { toast } from "sonner";
import { getUser } from "@/utils/storage";
import { formatCount } from "@/utils/formatNumber";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    isInitiallyLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes, isInitiallyLiked }) => {
    const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
    const [likesCount, setLikesCount] = useState<number>(initialLikes);

    const data = getUser();
    const token = data?.token;

    const handleLike = async () => {
        if (!token) {
            toast("You need to be logged in to like posts.");
            return;
        }

        try {
            const response = await likePost(postId, token);
            if (response) {
                setIsLiked(response.post.likes.includes(data.user.id));
                setLikesCount(response.post.likes.length);
            }
        } catch (error) {
            console.error("Error while liking post:", error);
        }
    };

    return (
        <Button
            onClick={handleLike}
            variant="outline"
            className="px-4 py-2 rounded-full cursor-pointer dark:bg-gray-900 bg-gray-300"
        >
            {token ? (
                isLiked ? <RiHeartFill className="text-red-500" size={32} /> : <RiHeartLine size={32} />
            ) : (
                <RiHeartLine size={32} className="opacity-50 cursor-not-allowed" />
            )}
            <span>{formatCount(likesCount)}</span>
        </Button>

    );
};

export default LikeButton;
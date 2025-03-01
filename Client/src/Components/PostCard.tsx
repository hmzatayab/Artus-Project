import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { RiVerifiedBadgeFill, RiChat1Line, RiGroupLine, } from "@remixicon/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import LikeButton from "./LikeButton";
import { getUser } from "@/utils/storage";

// Define Post Type
interface Post {
    id: string;
    imageURL: string;
    isLive: boolean;
    user: {
        name: string;
        username: string;
        image: string;
        followers: number[];
        identityVerified: boolean;
    };
    likes: number[];
    comments: {}[];
}

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

    const data = getUser();

    return (

        <Card className="shadow-lg dark:shadow-gray-800/50 shadow-gray-500/50 dark:bg-gray-950 bg-gray-200 rounded-lg overflow-hidden h-fit p-4 transition duration-500"> {/**  bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 animate-pulse */}
            {/* Post Image */}
            <div className="relative w-full pb-[140%] overflow-hidden rounded-lg cursor-pointer">
                <Link to={`/post/${post.id}`}>
                    <img
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src={post.imageURL}
                        alt="Post Image"
                    />
                </Link>
            </div>

            {/* User Details & Actions */}
            <div className="flex items-center justify-between w-full">
                {/* User Profile */}
                <div className="flex justify-start items-center w-auto">
                    <Link to={`/profile`} className="flex items-center space-x-3 cursor-pointer">
                        <Avatar className="w-12 h-12 outline-2 border-3 dark:border-gray-950 border-white outline-green-500">
                            <AvatarImage src={post.user.image} alt="User Profile" />
                            <AvatarFallback className="text-green-500">{post.user.name.split(" ")[0].slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-1">
                                <h3 className=" font-semibold text-sm md:text-xs sm:text-base lg:text-lg">
                                    {(() => {
                                        const words = post.user.name.split(" ");
                                        const firstWord = words[0] || "";
                                        const secondWord = words[1] || "";

                                        if (firstWord.length > 5) {
                                            return `${firstWord.slice(0, 5)}...`;
                                        } else if (secondWord) {
                                            return `${firstWord} ${secondWord[0]}.`;
                                        } else {
                                            return firstWord;
                                        }
                                    })()}
                                </h3>
                                {post.user?.identityVerified && (
                                    <div>
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <RiVerifiedBadgeFill size={16} color="#089dea" />
                                            </HoverCardTrigger>
                                            <HoverCardContent className="shadow-lg shadow-amber-50">
                                                <div className="flex justify-between space-x-4">
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold">@{post.user.username}</h4>
                                                        <p className="text-sm">
                                                            The React Framework – created and maintained by @vercel.
                                                        </p>
                                                        <div className="flex items-center pt-2">
                                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                                            <span className="text-xs text-muted-foreground">
                                                                Joined December 2021
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                )}

                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <div className="text-sm text-muted-foreground">
                                    {post.user.followers.length || 0}
                                </div>
                                <span className="hidden md:hidden lg:inline 2xl:inline xl:inline space-x-2 text-[13px] text-muted-foreground">followers</span>
                                <span><RiGroupLine size={12} /></span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Actions (Like & Comment) */}
                <div className="flex items-center justify-end w-auto ">
                    <div>
                        {post.isLive ? (

                            <>
                                <LikeButton
                                    postId={post.id}
                                    initialLikes={post.likes.length}
                                    isInitiallyLiked={data?.user?.id ? post.likes.includes(data.user.id) : false}
                                    color={"bg-gray-900"}
                                />


                                <Link to={`/post/${post.id}`}>
                                    <Button variant="outline" className="rounded-full ml-2 cursor-pointer dark:bg-gray-900 bg-gray-300">
                                        <RiChat1Line />
                                        {post.comments?.length || 0}
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Button variant="outline" className="px-4 py-2 rounded-full cursor-pointer dark:bg-yellow-700 bg-gray-300">
                                In Review
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </Card>
    );
};

export default PostCard;

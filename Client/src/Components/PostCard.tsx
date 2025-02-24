import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon, MessageSquare } from "lucide-react";
import { RiVerifiedBadgeFill, RiHeartFill, RiHeartLine, RiChat1Fill, RiChat1Line, RiShareForwardFill, RiBookmarkFill, RiBookmarkLine, RiUser3Line } from "@remixicon/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

// Define Post Type
interface Post {
    _id: string;
    imageURL: string;
    userData: {
        name: string;
        username: string;
        image: string;
        followers: number[];
    };
    likes: number[];
    comments: {}[];
}


// Props Type Define Karo
interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <Card className="shadow-lg dark:shadow-gray-800/50 shadow-gray-500/50 dark:bg-gray-950 bg-gray-200 rounded-lg overflow-hidden h-fit p-4 transition duration-500"> {/**  bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 animate-pulse */}
            {/* Post Image */}
            <div className="relative w-full pb-[140%] overflow-hidden rounded-lg cursor-pointer">
                <Link to={`/post/${post._id}`}>
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
                    {/* <div className="bg-gray-900 w-10 h-10 rounded-lg absolute -top-123 -right-48 sm:-top-200 sm:-right-100 md:-top-110 md:-right-40 lg:-top-150 lg:-right-62 xl:-top-120 xl:-right-50 2xl:-top-130 2xl:-right-55 flex items-center justify-center cursor-pointer">
                        <RiBookmarkLine size={18} color="#fff" />
                    </div> */}
                    <Link to={`/profile/${post.userData.username}`} className="flex items-center space-x-3 cursor-pointer">
                        <Avatar className="w-12 h-12 outline-2 border-3 dark:border-gray-950 border-white outline-green-500">
                            <AvatarImage src={post.userData.image} alt="User Profile" />
                            <AvatarFallback>{post.userData.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-1">
                                <h3 className=" font-semibold text-sm md:text-xs sm:text-base lg:text-lg">
                                    {(() => {
                                        const words = post.userData.name.split(" ");
                                        const firstWord = words[0] || "";
                                        const secondWord = words[1] || "";

                                        if (firstWord.length > 5) {
                                            return `${firstWord.slice(0, 5)}...`; // Pehla word 6+ letters ka hai, toh sirf pehle 5 letters + "..."
                                        } else if (secondWord) {
                                            return `${firstWord} ${secondWord[0]}.`; // Pehla word 5 ya kam ka hai, toh second word ka pehla letter + "."
                                        } else {
                                            return firstWord; // Sirf ek hi word hai, woh as it is dikhao
                                        }
                                    })()}
                                </h3>
                                <div>
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <RiVerifiedBadgeFill
                                                size={16}
                                                color="#089dea"
                                            />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="shadow-lg shadow-amber-50 ">
                                            <div className="flex justify-between space-x-4 ">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">@username</h4>
                                                    <p className="text-sm">
                                                        The React Framework – created and maintained by @vercel.
                                                    </p>
                                                    <div className="flex items-center pt-2">
                                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                        <span className="text-xs text-muted-foreground">
                                                            Joined December 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <div className="text-sm text-muted-foreground">
                                    {post.userData.followers.length || 0}2.2k
                                </div>
                                <span className="hidden md:hidden lg:inline 2xl:inline xl:inline space-x-2 text-md text-muted-foreground">followers</span>
                                <span><RiUser3Line size={12} /></span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Actions (Like & Comment) */}
                <div className="flex items-center justify-end w-auto ">
                    <div>
                        <Button variant="outline" className="px-4 py-2 rounded-full cursor-pointer dark:bg-gray-900 bg-gray-300">
                            <RiHeartLine size={32} />
                            {post.likes.length}3.1k
                        </Button>

                        <Link to={`/post/${post._id}`}>
                            <Button variant="outline" className="rounded-full ml-2 cursor-pointer dark:bg-gray-900 bg-gray-300">
                                <RiChat1Line className="" />
                                {post.comments.length}2.2k
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PostCard;

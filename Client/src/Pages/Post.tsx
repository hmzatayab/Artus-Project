"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllPosts, getPost } from "@/Store/Post";
import { RiBookmarkLine, RiChat1Line, RiGroupLine, RiMore2Fill, RiUserStarLine, RiVerifiedBadgeFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarIcon, SendHorizonal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeButton from "@/components/LikeButton";
import { getUser } from "@/utils/storage";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/PostCard";

type Post = {
    id: string;
    imageURL: string;
    isLive: boolean;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    user: {
        id: string;
        name: string;
        username: string;
        image: string;
        followers: number[];
        identityVerified: boolean;
    };
    likes: number[];
    comments: {}[];
};

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("comments");

    const data = getUser();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (!postId) return;
                const data = await getPost(postId);
                setPost(data);
            } catch (err) {
                setError("Failed to fetch post");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts(); // API Call
                setPosts(data); // Save posts in state
            } catch (err) {
                setError("Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts(); // Call function on component mount
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>No post found</p>;

    return (
        <div className="mt-24">
            <div className="flex justify-center mt-10">
                <div className="w-[82%] flex flex-col md:flex-row gap-3">
                    {/* Left Column - Image */}
                    <div className="w-full md:w-[30%] bg-gray-900 rounded-xl p-6 flex items-center justify-center">
                        <img
                            className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                            src={post.imageURL}
                            alt="Post Image"
                        />
                    </div>

                    {/* Right Column - Post Details */}
                    <div className="w-full md:w-[70%] bg-gray-900 rounded-xl p-6 flex flex-col gap-3">
                        {/* User Profile Row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to={`/profile/${post.user.username}`}>
                                    <Avatar className="w-15 h-15 outline-2 border-3 dark:border-gray-950 border-white outline-green-500">
                                        <AvatarImage src={post.user.image} alt="Profile" />
                                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <div className="flex  items-center gap-2">
                                        <h4 className="text-lg font-semibold">{post.user.name}</h4>
                                        {post.user.identityVerified && (
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
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-400 italic">@{post.user.username}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <RiGroupLine size={12} />
                                            <span>{post.user.followers.length} followers</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button variant="outline" className="bg-transparent border-gray-700">
                                        Follow
                                    </Button>

                                </div>
                            </div>

                            <div className=" flex gap-2 items-center">
                                <Button variant="outline" className="bg-transparent border-gray-700 w-12 h-12"><RiBookmarkLine /></Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <RiMore2Fill />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                Profile
                                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Billing
                                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Settings
                                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Keyboard shortcuts
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>Team</DropdownMenuItem>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuItem>
                                                New Team
                                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                                        <DropdownMenuItem>Support</DropdownMenuItem>
                                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            Log out
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        </div>

                        {/* Post Title */}
                        <h1 className="text-2xl font-bold">{post.title}</h1>

                        {/* Description Section */}
                        <p className="text-gray-300 leading-relaxed">{post.description}</p>

                        {/* Tags Section */}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>

                        {/* menu section  */}
                        <div className="flex flex-col justify-between">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800">
                                <div>
                                    <LikeButton
                                        postId={post.id}
                                        initialLikes={post.likes.length}
                                        isInitiallyLiked={post?.user?.id ? post.likes.includes(data.user.id) : false}
                                    />
                                    <Button variant="outline" className="rounded-full ml-2 cursor-pointer" onClick={() => setActiveTab("comments")}>
                                        <RiChat1Line />
                                        {post.comments?.length || 0}
                                    </Button>
                                    <Button variant="outline" className="rounded-full ml-2 cursor-pointer" onClick={() => setActiveTab("ownership")}>
                                        <RiUserStarLine />
                                        Ownership
                                    </Button>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mr-4">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={post.user.image} alt="Creator" />
                                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>Created by</span><span className="font-semibold text-white">{post.user.name}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>



                            {activeTab === "comments" ? (
                                <div className="relative flex flex-col h-[450px]">
                                    {/* Comments Section (Top) */}
                                    <div className="flex-1 overflow-y-auto space-y-2 p-3">
                                        <h3>Coments</h3>
                                    </div>

                                    {/* Input Box (Fixed at Bottom) */}
                                    <div className="sticky bottom-0 pt-2 ">
                                        <Card className="p-3 bg-black">
                                            <CardContent className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={data.user.image} alt="User" />
                                                    <AvatarFallback>{data.user.name[0]}</AvatarFallback>
                                                </Avatar>

                                                {/* Input Field */}
                                                <Input
                                                    placeholder="Write a comment..."
                                                    className="flex-1 rounded-full px-4 py-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                                                />

                                                {/* Submit Button */}
                                                <Button variant="ghost" size="icon">
                                                    <SendHorizonal className="w-5 h-5 text-blue-500 hover:text-blue-700 transition" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : activeTab === "ownership" ? (
                                <div>
                                    <div className="mt-2 max-h-[450px] overflow-y-auto">ownership</div>
                                    <div className="p-3">hamza</div>
                                </div>
                            ) : null}


                        </div>

                    </div>
                </div>
            </div>

            <div>
                <div className="mt-6">
                    <div className="relative mb-8 flex flex-col items-center text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Related Posts
                        </h2>
                        <div className="mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
                    </div>

                    <div className="mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-5">
                        {posts
                            .filter(post => post.isLive)
                            .map((post, index) => (
                                <PostCard key={index} post={post} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

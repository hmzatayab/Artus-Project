"use client";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { getAllPost, getPost } from "@/APIs/Post";
import { formatDistanceToNow } from "date-fns";
import { getUser } from "@/utils/storage";
import { toast } from "sonner"
import { Post } from "@/Types/Post"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiBookmarkLine, RiChat1Line, RiGroupLine, RiMore2Fill, RiUserStarLine, RiVerifiedBadgeFill } from "@remixicon/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeButton from "@/components/LikeButton";
import PostCard from "@/components/PostCard";
import CommentCard from "@/components/Comment";
import { PostSkeleton } from "@/components/Skeleton/Post";
import { PostCardSkeleton } from "@/components/Skeleton/PostCard";


export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
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
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPost();
                setPosts(data.posts);
            } catch (err) {
                setError("Failed to fetch posts");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (error) return toast(`${error}`);

    return (
        <div className="mt-24 mb-10">
            {!post ? ( // Show skeleton while loading
                <PostSkeleton />
            ) : (
                <div className="flex justify-center mt-10">
                    <div className="lg:w-[82%] w-[95%] flex flex-col md:flex-row gap-3">
                        {/* Left Column - Image */}
                        <div className="w-full md:w-[30%] dark:bg-gray-950 bg-gray-200 border rounded-xl p-6 flex items-center justify-center">
                            <img
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                                src={post.imageURL}
                                alt="Post Image"
                            />
                        </div>

                        {/* Right Column - Post Details */}
                        <div className="w-full md:w-[70%] dark:bg-gray-950 bg-gray-200 border rounded-xl p-6 flex flex-col gap-3">
                            {/* User Profile Row */}
                            <div className="flex items-center justify-between lg:flex-row">
                                <div className="flex items-center gap-4">
                                    <Link to={`/profile/${post.user.username}`}>
                                        <Avatar className="cursor-pointer w-15 h-15 outline-2 border-3 dark:border-gray-950 border-white outline-green-500 text-green-500">
                                            <AvatarImage src={post.user.image} alt="Profile" />
                                            <AvatarFallback className="text-green-500">{post.user.name.split(" ")[0].slice(0, 2).toUpperCase()}</AvatarFallback>
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
                                                <span>{post.user.followers.length}</span><span className="hidden lg:inline-block">followers</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" className="bg-transparent border-gray-700 cursor-pointer">
                                            Follow
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <RiMore2Fill className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem className="cursor-pointer"><Link to={'/'}>Report</Link></DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer"><Link to={'/'}>Edit</Link></DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">Copy link</DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500 cursor-pointer"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                            </div>

                            {/* Post Title */}
                            <h1 className="text-2xl font-bold">{post.title}</h1>

                            {/* Description Section */}
                            <p className=" leading-relaxed">{post.description}</p>

                            {/* Tags Section */}
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="lg:hidden inline-block">
                                <div className="flex items-center gap-2 text-sm text-gray-400 mr-4">
                                    <Avatar className="h-6 w-6 cursor-pointer">
                                        <AvatarImage src={post.user.image} alt="Creator" />
                                        <AvatarFallback className="text-green-500">{post.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>Created by</span><span className="font-semibold text-white">{post.user.name}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>

                            {/* menu section  */}
                            <div className="flex flex-col justify-between">
                                <div className="flex justify-between items-center p-2 dark:bg-[#050c1c] bg-white rounded-lg border mb-2">
                                    <div className="xs:flex xs:items-center xs:justify-around xs:w-full">
                                        <LikeButton
                                            postId={post.id}
                                            initialLikes={post.likes.length}
                                            isInitiallyLiked={data?.user?.id && post?.likes ? post.likes.includes(data.user.id) : false}
                                            color={"bg-black"}
                                        />
                                        <Button variant="outline" className="rounded-full ml-2 cursor-pointer dark:bg-black bg-gray-300" onClick={() => setActiveTab("comments")}>
                                            <RiChat1Line />
                                            {post.comments?.length || 0}
                                        </Button>
                                        <Button variant="outline" className="rounded-full ml-2 cursor-pointer dark:bg-black bg-gray-300" >
                                            <RiBookmarkLine />
                                            {post.comments?.length || 0}
                                        </Button>
                                        <Button variant="outline" className="rounded-full ml-2 cursor-pointer dark:bg-black bg-gray-300" onClick={() => setActiveTab("ownership")}>
                                            <RiUserStarLine />
                                            <span>Owners</span>
                                        </Button>
                                    </div>
                                    <div className="hidden lg:inline-block">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mr-4">
                                            <Avatar className="h-6 w-6 cursor-pointer">
                                                <AvatarImage src={post.user.image} alt="Creator" />
                                                <AvatarFallback className="text-green-500">{post.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>Created by</span><span className="font-semibold dark:text-white text-black">{post.user.name}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>


                                {activeTab === "comments" ? (
                                    <CommentCard
                                        postId={postId || ""} // Use empty string as fallback
                                        postUserImage={post.user?.image || ""} // Use empty string as fallback
                                        postUserName={post.user?.name || "Anonymous"} // Use "Anonymous" as fallback
                                    />
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
            )}

            <div>
                <div className="mt-10">
                    <div className="relative mb-8 flex flex-col items-center text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Related Posts
                        </h2>
                        <div className="mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
                    </div>

                    <div className="mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {loading ? (
                            <>
                                <PostCardSkeleton />
                                <PostCardSkeleton />
                                <PostCardSkeleton />
                                <PostCardSkeleton />
                            </>
                        ) : (
                            <>
                                {posts
                                    .filter(post => post.isLive)
                                    .map((post, index) => (
                                        <PostCard key={index} post={post} />
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import Hero from "@/components/Hero"
import '../index.css'
import PostCard from "@/components/PostCard"
import { getAllPosts } from "../Store/Post"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PostCardSkeleton } from "@/components/Skeleton/PostCard"

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



function Home() {
    const [posts, setPosts] = useState<Post[]>([]); // State for storing posts
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        fetchPosts();
    }, []);

    if (error) return toast(`${error}`);

    return (
        <div className="mb-10">
            <div className="relative w-full top-0 left-0 right-0 bottom-0">
                <Hero />
            </div>
            <div className="relative -mt-[50vh] sm:-mt-[30vh] md:-mt-[5vh] lg:-mt-[8vh] xl:mt-[15vh] 2xl:-mt-[20vh] z-10">
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
    )
}

export default Home

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import { getAllPosts } from "@/APIs/Post";
import PostCard from "@/Components/Post/PostCard";
import { PostCards } from "@/Components/Other/Skeleton/PostCards";
import { Post } from "@/Types/Post";
import Hero from "@/Components/Home/Hero";

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPosts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const data = await getAllPosts(page);

            if (data.posts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prevPosts => [...prevPosts, ...data.posts]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (err) {
            setError("Failed to fetch posts");
            toast("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (error) return toast(`${error}`);

    return (
        <div className="mb-10">
            <div className="relative w-full top-0 left-0 right-0 bottom-0">
                <Hero />
            </div>
            <div className="relative -mt-[50vh] sm:-mt-[30vh] md:-mt-[5vh] lg:-mt-[8vh] xl:mt-[15vh] 2xl:-mt-[20vh] z-10">
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={<PostCards />}
                    endMessage={
                        <div className="flex flex-col items-center justify-center mt-6 text-gray-500 dark:text-gray-400">
                            <p className="mt-3 text-lg font-medium">No more posts to show</p>
                            <p className="mt-1 text-sm ">You’ve reached the end. Stay tuned for more!</p>
                        </div>
                    }
                >
                    <div className="mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {posts
                            .filter(post => post.isLive)
                            .map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default Home;

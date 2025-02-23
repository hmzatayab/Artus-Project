import Hero from "@/components/Home/Hero"
import '../../index.css'
import PostCard from "@/components/PostCard"

const posts = [
    {
        _id: "1",
        imageURL: "/01.jpg",
        userData: {
            name: "Hamza Rajput",
            username: "hamza",
            image: "https://source.unsplash.com/random/100x100?profile",
            followers: [1, 2, 3],
        },
        likes: [1, 2, 3, 4],
        comments: [{}, {}, {}],
    },
    {
        _id: "2",
        imageURL: "/02.jpg",
        userData: {
            name: "Ali Khan",
            username: "ali",
            image: "https://source.unsplash.com/random/100x100?man",
            followers: [1, 2],
        },
        likes: [1, 2, 3],
        comments: [{}, {}],
    },
    {
        _id: "3",
        imageURL: "/03.jpeg",
        userData: {
            name: "Ali Khan",
            username: "ali",
            image: "https://source.unsplash.com/random/100x100?man",
            followers: [1, 2],
        },
        likes: [1, 2, 3],
        comments: [{}, {}],
    },
    {
        _id: "4",
        imageURL: "/04.jpeg",
        userData: {
            name: "Ali Khan",
            username: "ali",
            image: "https://source.unsplash.com/random/100x100?man",
            followers: [1, 2],
        },
        likes: [1, 2, 3],
        comments: [{}, {}],
    },
]

function Home() {
    return (
        <>
            <div className="absolute w-full top-0 left-0 right-0 bottom-0 -z-10">
                <Hero />
            </div>
            <div className="relative mt-[85vh] z-10">
                <div className="mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>

        </>
    )
}

export default Home

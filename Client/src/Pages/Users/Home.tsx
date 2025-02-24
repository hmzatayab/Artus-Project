import Hero from "@/components/Home/Hero"
import '../../index.css'
import PostCard from "@/components/PostCard"

const posts = [
    {
        _id: "1",
        imageURL: "/01.jpg",
        userData: {
            name: "Hamzaaa Rajput",
            username: "hamza",
            image: "https://e1.pxfuel.com/desktop-wallpaper/309/9/desktop-wallpaper-69318-anime-forum-avatars-cool-profile-anime.jpg",
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
            image: "https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/product/914f3782cdb5d17a3a6a0b24d2cf0b97.jpeg",
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
            image: "https://cdn.pixabay.com/photo/2024/03/21/15/20/anime-8647945_1280.jpg",
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
        <div className="mb-10">
            <div className="relative w-full top-0 left-0 right-0 bottom-0">
                <Hero />
            </div>
            <div className="relative -mt-[50vh] sm:-mt-[30vh] md:-mt-[5vh] lg:-mt-[8vh] xl:mt-[15vh] 2xl:-mt-[20vh] z-10">
                <div className="mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home

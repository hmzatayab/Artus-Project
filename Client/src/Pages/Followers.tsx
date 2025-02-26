import UserCard from "@/components/UserCard"

function Followers() {
    return (
        <div>
            <UserCard
                user={{
                    username: "hamza_rajput",
                    name: "Hamza Rajput",
                    avatar: "https://example.com/avatar.jpg",
                    bio: "Full Stack Developer | Designer",
                    posts: 45,
                    followers: 1200,
                    likes: 890,
                    earnings: "$2.3k",
                }}
            />
        </div>
    )
}

export default Followers
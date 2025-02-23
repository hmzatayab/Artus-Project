import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        <Card className=" shadow-lg rounded-lg overflow-hidden h-fit p-4 transition duration-500">
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
            <div className="flex flex-col sm:flex-row sm:justify-between mt-4">
                {/* User Profile */}
                <Link to={`/profile/${post.userData.username}`} className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={post.userData.image} alt="User Profile" />
                        <AvatarFallback>{post.userData.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                            {post.userData.name.split(" ").map((word, index) =>
                                index === 0 ? word : index === 1 ? `${word[0]}.` : ""
                            ).join(" ").trim()}
                        </h3>
                        <span className="text-sm text-gray-400">{post.userData.followers.length || 0} followers</span>
                    </div>
                </Link>

                {/* Actions (Like & Comment) */}
                <div className="flex items-center justify-between mt-4 sm:mt-0 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="bg-gray-800 px-4 py-2 rounded-full">
                        <i className="ri-heart-line text-gray-400 mr-2"></i>
                        {post.likes.length}
                    </Button>

                    <Link to={`/post/${post._id}`}>
                        <Button variant="outline" size="sm" className="bg-gray-800 px-4 py-2 rounded-full ml-2">
                            <i className="ri-chat-1-line text-gray-400 mr-2"></i>
                            {post.comments.length}
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default PostCard;

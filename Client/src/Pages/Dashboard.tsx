import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { RiBookmarkFill, RiCameraLine, RiLayoutGridFill, RiLineChartLine, RiTrophyFill, RiVerifiedBadgeFill } from "@remixicon/react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { toast } from "sonner"
import { getUserPosts } from "@/Store/Post";
import { getUser } from "@/utils/storage";
import { PostCardSkeleton } from "@/components/Skeleton/PostCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";
import { ChartComponent } from "@/components/Analytics/ChartForViews"

const menuOptions = [
  { name: "All Posts", icon: <RiLayoutGridFill size={20} /> },
  { name: "Auctions", icon: <RiTrophyFill size={20} /> },
  { name: "Wishlist", icon: <RiBookmarkFill size={20} /> },
  { name: "Analytics", icon: <RiLineChartLine size={20} /> },
];


function Profile() {
  const [selectedTab, setSelectedTab] = useState("All Posts");
  const [posts, setPosts] = useState([]); // State for storing posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const data = getUser();
  const userId = data.user.id


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(userId);
        setPosts(data);
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
    <>
      <Card className="mt-24 mx-5 lg:mx-8 relative overflow-hidden dark:shadow-2xl shadow-xl rounded-2xl dark:border border-2 p-8 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 dark:bg-black bg-gray-300">
        {/* Glowing Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>

        {/* User Info */}
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 w-full lg:w-1/2">
          {/* Profile Picture with Gradient Border */}
          <div className="relative w-32 h-32">
            <div>
              <Avatar className="w-32 h-32 outline-3 border-4 dark:border-gray-950 border-white outline-green-500">
                <AvatarImage src={data.user.image} alt="User Profile" />
                <AvatarFallback className="text-3xl text-green-500">AB</AvatarFallback>
              </Avatar>
            </div>
            {/* Hover Effect for Profile Picture */}
            <Link to={"/update"}>
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-full opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                <RiCameraLine size={24} />
              </div>
            </Link>
          </div>

          {/* User Details */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="flex items-center space-x-1">
                <h1 className="text-3xl md:text-4xl font-bold ">{data.user.name || "Anonymous"}</h1>
                {data.user.identityVerified && (
                  <div>
                    <HoverCard>
                      <HoverCardTrigger>
                        <RiVerifiedBadgeFill size={20} color="#089dea" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">@{data.user.username}</h4>
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
              <Link
                to={"/update"}
                state={{ from: "dashboard" }}
                title="Edit Profile"
                className="ml-3 hover:scale-110 transition-transform duration-300"
              >
                {/* <i className="ri-edit-2-fill text-white text-2xl"></i> */}
              </Link>
            </div>
            <p className="text-xs md:text-sm  italic mt-2">{data.user.email || "example@gmail.com"}</p>

            {/* Bio Section */}
            <div className="mt-4 max-w-md">
              <p className="text-sm">
                {data.user.bio || "No Bio Available"}
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator orientation="horizontal" className="w-full lg:hidden" />
        <Separator orientation="vertical" className="hidden lg:inline-block py-16" />

        {/* Stats Section */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          <div className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
            <span className="text-3xl md:text-4xl font-bold ">23.1k</span>
            <span className="text-xs md:text-sm dark:text-gray-400">Followers</span>
          </div>
          <div className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
            <span className="text-3xl md:text-4xl font-bold ">23.1k</span>
            <span className="text-xs md:text-sm dark:text-gray-400">Followings</span>
          </div>
          <div className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
            <span className="text-3xl md:text-4xl font-bold ">23.1k</span>
            <span className="text-xs md:text-sm dark:text-gray-400">Auctions</span>
          </div>
          <div className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
            <span className="text-3xl md:text-4xl font-bold ">23.1k</span>
            <span className="text-xs md:text-sm dark:text-gray-400">Likes</span>
          </div>
          <Link to={"/wallet"}>
            <div className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
              <span className="text-3xl md:text-4xl font-bold ">Wallet</span>
              <span className="text-xs md:text-sm dark:text-gray-400">Balance <span className="font-bold text-blue-500">23.1k</span></span>
            </div>
          </Link>
        </div>
      </Card>

      {/* Menu Card */}

      <div>
        <div>
          <Card className="mt-4 mx-5 lg:mx-8 p-2 rounded-2xl dark:bg-black bg-gray-200">
            <div className="flex justify-between gap-3">
              {menuOptions.map((option, index) => (
                <div
                  key={index}
                  className={`cursor-pointer h-10 flex justify-center items-center rounded-xl px-6 transition-all duration-300 ${selectedTab === option.name ? "dark:bg-white/10 w-full bg-gray-300" : ":dark:hover:bg-white/20 w-full hover:bg-white dark:hover:text-black"
                    }`}
                  onClick={() => setSelectedTab(option.name)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{option.icon}</span>
                    <span className="font-medium hidden lg:inline-block"> {option.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {selectedTab === "All Posts" ? (
          <div className=" lg:mx-8 lg:mt-4 mb-8 p-5 lg:p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading ? (
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              ) : (
                <>
                  {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                  ))}
                </>
              )}
            </div>
          </div>
        ) : selectedTab === "Auctions" ? (
          <div>
            <div className="lg:mx-8 mt-4 mb-8">Auctions Posts</div>
          </div>
        ) : selectedTab === "Wishlist" ? (
          <div>
            <div className="lg:mx-8 mt-4 mb-8">Like Posts</div>
          </div>
        ) : selectedTab === "Analytics" ? (
          <div>
            {/* <div className="lg:mx-8 mt-4 mb-8">Lost Auction Posts</div> */}
            <div className="lg:mx-8 mt-4 mb-8 p-5 lg:p-0">
              <ChartComponent />
            </div>
          </div>
        ) : null}

      </div>

    </>
  )
}

export default Profile

import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { RiCameraLine } from "@remixicon/react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import PostCard from "@/components/PostCard";


function Profile() {
  const [selectedTab, setSelectedTab] = useState("All Posts");
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //     let filteredPosts = [];

  //     if (selectedTab === "All Posts") {
  //       filteredPosts = allPosts;
  //     } else if (selectedTab === "Win Auctions") {
  //       filteredPosts = allPosts.filter((post) => post.status === "win");
  //     } else if (selectedTab === "Lost Auctions") {
  //       filteredPosts = allPosts.filter((post) => post.status === "lost");
  //     } else if (selectedTab === "Liked Posts") {
  //       filteredPosts = allPosts.filter((post) => post.isLiked === true);
  //     }

  //     setPosts(filteredPosts);
  //   }, [selectedTab, allPosts]);

  const menuOptions = [
    "All Posts",
    "Win Auctions",
    "Lost Auctions",
    "Liked Posts",
  ];

  // const postsData = {
  //   "All Posts": ["Post 1", "Post 2", "Post 3", "Post 4", "Post 5", "Post 6"],
  //   "Win Auctions": ["Win Auction Post 1", "Win Auction Post 2"],
  //   "Lost Auctions": ["Lost Auction Post 1", "Lost Auction Post 2"],
  //   "Liked Posts": ["Liked Post 1", "Liked Post 2"],
  // };

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
  return (
    <>
      <Card className="mt-24 mx-5 lg:mx-8 relative overflow-hidden dark:shadow-2xl shadow-xl rounded-2xl dark:border border-2 p-8 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 dark:bg-black bg-gray-300">
        {/* Glowing Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>

        {/* User Info */}
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 w-full lg:w-1/2">
          {/* Profile Picture with Gradient Border */}
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <div>
              <Avatar className="w-full h-full outline-3 border-4 dark:border-gray-950 border-white outline-green-500">
                <AvatarImage src="https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/product/914f3782cdb5d17a3a6a0b24d2cf0b97.jpeg" alt="User Profile" />
                <AvatarFallback>AB</AvatarFallback>
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
              <h1 className="text-3xl md:text-4xl font-bold ">Hamza Tayyab</h1>
              <Link
                to={"/update"}
                state={{ from: "dashboard" }}
                title="Edit Profile"
                className="ml-3 hover:scale-110 transition-transform duration-300"
              >
                {/* <i className="ri-edit-2-fill text-white text-2xl"></i> */}
              </Link>
            </div>
            <p className="text-xs md:text-sm  italic mt-2">Hamza@gmail.com</p>

            {/* Bio Section */}
            <div className="mt-4 max-w-md">
              <p className="text-sm">
                Add a bio to tell people more about yourself.
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator orientation="horizontal" className="w-full lg:hidden" />
        <Separator orientation="vertical" className="hidden lg:inline-block py-16" />

        {/* Stats Section */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {[
            { count: "23.3k", label: "Followers" },
            { count: "15.8k", label: "Following" },
            { count: "120", label: "Posts" },
            { count: "5", label: "Auctions" },
            { count: "5", label: "Balance" },
          ].map((item, index) => (
            <div key={index} className="cursor-pointer w-36 md:w-48 h-24 md:h-32 flex flex-col justify-center items-center dark:bg-white/5 bg-gray-200 backdrop-blur-xl rounded-xl shadow-lg p-4 hover:bg-white/20 transition-all duration-300">
              <span className="text-3xl md:text-4xl font-bold ">{item.count}</span>
              <span className="text-xs md:text-sm dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Menu Card */}
      <Card className="mt-4 mx-5 lg:mx-8 p-2 rounded-2xl">
        <div className="flex justify-between gap-3">
          {menuOptions.map((option) => (
            <div
              key={option}
              className={`cursor-pointer h-10 flex justify-center items-center rounded-xl px-6 transition-all duration-300 ${selectedTab === option ? "bg-white/10 w-full" : "hover:bg-white/20 w-full"
                }`}
              onClick={() => setSelectedTab(option)}
            >
              <span className="font-medium">{option}</span>
            </div>
          ))}
        </div>
      </Card>


      <div className=" lg:mx-8 mt-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Profile





// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import PostCard from "./PostCard"; // Ensure correct import

// function Profile({ allPosts }) {
//   const [selectedTab, setSelectedTab] = useState("All Posts");
//   const [posts, setPosts] = useState([]); // Initially empty

//   const menuOptions = [
//     "All Posts",
//     "Win Auctions",
//     "Lost Auctions",
//     "Liked Posts",
//   ];

//   // Function to filter posts based on selected tab
//   useEffect(() => {
//     let filteredPosts = [];

//     if (selectedTab === "All Posts") {
//       filteredPosts = allPosts;
//     } else if (selectedTab === "Win Auctions") {
//       filteredPosts = allPosts.filter((post) => post.status === "win");
//     } else if (selectedTab === "Lost Auctions") {
//       filteredPosts = allPosts.filter((post) => post.status === "lost");
//     } else if (selectedTab === "Liked Posts") {
//       filteredPosts = allPosts.filter((post) => post.isLiked === true);
//     }

//     setPosts(filteredPosts);
//   }, [selectedTab, allPosts]);

//   return (
//     <>
//       {/* Menu Section */}
//       <Card className="mt-4 mx-5 lg:mx-8 p-2 rounded-2xl">
//         <div className="flex justify-between gap-3">
//           {menuOptions.map((option) => (
//             <div
//               key={option}
//               className={`cursor-pointer h-10 flex justify-center items-center rounded-xl px-6 transition-all duration-300 ${
//                 selectedTab === option ? "bg-white/10 w-full" : "hover:bg-white/20 w-full"
//               }`}
//               onClick={() => setSelectedTab(option)}
//             >
//               <span className="font-medium">{option}</span>
//             </div>
//           ))}
//         </div>
//       </Card>

//       {/* Posts Section */}
//       <div className="lg:mx-8 mt-4 mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//           {posts.length > 0 ? (
//             posts.map((post) => <PostCard key={post._id} post={post} />)
//           ) : (
//             <p className="text-center col-span-full text-gray-500">No posts found.</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Profile;

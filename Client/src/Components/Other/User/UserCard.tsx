"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCardProps } from "@/Types/User"

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="w-full max-w-sm p-4 shadow-lg border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardHeader className="flex flex-col items-center">
        <Link to={`/profile/${user.username}`} className="relative group">
          <Avatar className="w-24 h-24 border-4 border-indigo-500 shadow-md group-hover:scale-105 transition-transform">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <CardTitle className="text-xl mt-3">{user.name}</CardTitle>
        <p className="text-gray-400">@{user.username}</p>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-gray-300">{user.bio || "No bio available."}</p>
        <div className="flex justify-around mt-4">
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-400">{user.posts}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-green-400">{user.followers}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-pink-400">{user.likes}</p>
            <p className="text-sm text-gray-500">Likes</p>
          </div>
        </div>
        {user.earnings && (
          <div className="bg-gray-800 p-4 rounded-xl mt-6 shadow-inner">
            <h4 className="text-lg font-semibold text-yellow-400">Earnings</h4>
            <p className="text-2xl font-bold text-green-500 mt-1">{user.earnings}</p>
          </div>
        )}
        <Button className="mt-4 w-full" asChild>
          <Link to={`/profile/${user.username}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;

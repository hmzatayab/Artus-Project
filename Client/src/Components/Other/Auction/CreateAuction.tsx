import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Progress } from "@/Components/ui/progress";
import { useState, useEffect } from "react";

interface Post {
    id: string;
    likes: number;
    comments: number;
    eligibleForAuction: boolean;
}

export default function AuctionEligibilityUI({ post }: { post: Post }) {
    const [likesCount, setLikesCount] = useState(post.likes);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    const [isEligible, setIsEligible] = useState(post.eligibleForAuction);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Simulate real-time updates for likes and comments
    useEffect(() => {
        const interval = setInterval(() => {
            setLikesCount((prev) => (prev < 5 ? prev + 1 : prev)); // Simulate likes increase
            setCommentsCount((prev) => (prev < 1 ? prev + 1 : prev)); // Simulate comments increase
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Check eligibility
    useEffect(() => {
        if (likesCount >= 5 && commentsCount >= 1) {
            setIsEligible(true);
        }
    }, [likesCount, commentsCount]);

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Auction Eligibility</h2>
                    <p className="text-gray-400">Check if your post is eligible for auction</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{likesCount}/5</h3>
                        <p className="text-gray-400">Likes</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">{commentsCount}/1</h3>
                        <p className="text-gray-400">Comments</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <Progress
                    value={(likesCount / 5) * 100}
                    className="h-3 bg-gray-700"
                    indicatorColor="bg-green-500"
                />
                <p className="text-sm text-gray-400 mt-2">
                    {likesCount >= 5 && commentsCount >= 1
                        ? "Your post is eligible for auction!"
                        : "Your post needs 5 likes and 1 comment to be eligible."}
                </p>
            </div>

            {/* Auction Details */}
            {isEligible && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold">Auction Details</h3>
                            <p className="text-gray-400">Set the auction duration and create your auction</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">12</h3>
                            <p className="text-gray-400">Auctions created so far</p>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">Select Auction End Date</h3>
                            <p className="text-gray-400">Choose how long the auction will run</p>
                        </div>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border bg-gray-800 text-white"
                        />
                    </div>

                    {/* Create Auction Button */}
                    <div className="flex justify-end">
                        <Button
                            disabled={!selectedDate}
                            className="px-8 py-6 bg-green-600 hover:bg-green-700 text-white font-bold transition-transform transform hover:scale-105"
                            onClick={() => {
                                console.log("Auction created with end date:", selectedDate);
                            }}
                        >
                            Create Auction
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
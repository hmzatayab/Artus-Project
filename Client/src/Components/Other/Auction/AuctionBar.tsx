import { useEffect, useState } from "react";
import { getAuctionDetails } from "@/APIs/Auction";
import { AuctionResponse } from "@/Types/Auction";
import { Post } from "@/Types/Post";
import { Card } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
<<<<<<< HEAD
import { AuctionCardSkeleton } from "../Skeleton/Auction";
import { PlaceBidDrawer } from "./PlaceBid";
import AuctionCountdown from "./Countdown";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/Components/ui/button";
import AuctionEligibilityUI from "./CreateAuction";

interface AuctionBarProps {
    post?: Post | null;
    token: string;
}

function AuctionBar({ post = {} as Post, token }: AuctionBarProps) {
    const [auction, setAuction] = useState<AuctionResponse["auction"] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const auctionId = post?.auctionId ?? "";
=======
// import { Button } from "@/Components/ui/button";
import { AuctionCardSkeleton } from "../Skeleton/Auction";
import { PlaceBidDrawer } from "./PlaceBid";

interface AuctionBarProps {
    post?: Post;
    token: string;
}
function AuctionBar({ post, token }: AuctionBarProps) {
    const [auction, setAuction] = useState<AuctionResponse["auction"] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const auctionId = post?.auctionId;
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)

    useEffect(() => {
        const fetchAuction = async () => {
            if (!auctionId) return;
            try {
                const data = await getAuctionDetails(auctionId);
                setAuction(data.auction);
            } catch (err) {
                setError("Failed to fetch auction details. Please try again later.");
            }
        };

        fetchAuction();
    }, [auctionId, token]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!auction) {
        return <div className="mt-5 flex justify-center"><AuctionCardSkeleton></AuctionCardSkeleton></div>;
    }

    return (
        <>
            <div className="mt-5 flex justify-center">
                <Card className="bg-gray-950 w-[82%] px-10 py-5">
<<<<<<< HEAD
                    {post?.isAuctioned ? (
                        <div className="flex items-center justify-between">
                            <div className="text-center lg:text-left">
                                <h2 className="text-2xl font-bold tracking-wide">
                                    <AuctionCountdown endTime={auction.endTime} />
                                </h2>
                                <div className="flex space-x-4 text-gray-300 mt-1">
                                    <p className="text-sm">
                                        Starting Bid: <span className="text-green-400">${auction.startingPrice}</span>
                                    </p>
                                    <p className="text-sm">
                                        Highest Bid: <span className="text-yellow-400">${auction.highestBid}</span>
                                    </p>
                                </div>
                            </div>
                            {auction.highestBidder ? (
                                <>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="flex items-center space-x-2 cursor-pointer">
                                                <div className="flex -space-x-3">
                                                    {auction.bids.slice(0, 5).map((bid, index) => (
                                                        <Avatar key={index} className="w-12 h-12 border-2 border-white">
                                                            <AvatarImage src={bid.user?.image || "/placeholder.jpg"} alt={`Bidder ${index + 1}`} />
                                                            <AvatarFallback>B{index + 1}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                <div>
                                                    <div className="text-2xl text-gray-400 font-bold">{auction.bids.length}</div>
                                                    <span className="text-sm text-gray-400">Total Bids</span>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Bids Detail</DialogTitle>
                                                <DialogDescription>List of all bidders and their bid amounts</DialogDescription>
                                            </DialogHeader>
                                            {/* Bids Table */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full rounded-lg">
                                                    <thead>
                                                        <tr className="">
                                                            <th className="py-2 px-4 text-left">Bidder</th>
                                                            <th className="py-2 px-4 text-left">Amount</th>
                                                            <th className="py-2 px-4 text-left">Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {auction.bids.map((bid: any, index) => (
                                                            <tr key={index} className="border-t">
                                                                <td className="py-2 px-4 flex items-center space-x-2">
                                                                    <Avatar className="w-8 h-8 border">
                                                                        <AvatarImage src={bid.user?.image || "/placeholder.jpg"} />
                                                                        <AvatarFallback>{bid.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex gap-1 items-center">
                                                                        <span>
                                                                            {(() => {
                                                                                const words = bid.user.name.split(" ");
                                                                                const firstWord = words[0] || "";
                                                                                const secondWord = words[1] || "";

                                                                                if (firstWord.length > 5) {
                                                                                    return `${firstWord.slice(0, 5)}...`;
                                                                                } else if (secondWord) {
                                                                                    return `${firstWord} ${secondWord[0]}.`;
                                                                                } else {
                                                                                    return firstWord;
                                                                                }
                                                                            })() || "Unknown"}
                                                                        </span>
                                                                        {bid.user.identityVerified && (
                                                                            <RiVerifiedBadgeFill size={12} color="#089dea" />
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-4 text-green-600 font-semibold">${bid.amount}</td>
                                                                <td className="py-2 px-4 text-gray-500">{formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <div className="flex items-center space-x-3">
                                        {auction.highestBidder?.image && (
                                            <Avatar className="w-14 h-14 border-2 border-yellow-400">
                                                <AvatarImage src={auction.highestBidder.image} alt="Winner" />
                                                <AvatarFallback className="text-yellow-400">{auction.highestBidder.name[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="text-white">
                                            <h4 className="font-bold text-xl text-yellow-300">${auction.highestBid}</h4>
                                            <span className="text-sm text-gray-400">Current Winner</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-400 text-lg font-semibold">No bids placed yet</div>
                            )}
                            <PlaceBidDrawer auction={auction} token={token} />
                        </div>
                    ) : (
                        // Show "Create Auction" button if post is not auctioned
                        <div className="flex justify-between">
                            <AuctionEligibilityUI post={post}/>
                        </div>
                    )}
=======
                    <div className="flex items-center justify-between">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl font-bold tracking-wide">
                                ⏳ {new Date(auction.createdAt).toLocaleString()}
                            </h2>
                            <div className="flex space-x-4 text-gray-300 mt-1">
                                <p className="text-sm">
                                    Starting Bid: <span className="text-green-400">${auction.startingPrice}</span>
                                </p>
                                <p className="text-sm">
                                    Highest Bid: <span className="text-yellow-400">${auction.highestBid}</span>
                                </p>
                            </div>
                        </div>
                        {auction.highestBidder ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-3">
                                        {auction.bids.slice(0, 5).map((bid, index) => (
                                            <Avatar key={index} className="w-12 h-12 border-2 border-white">
                                                <AvatarImage src={bid.user?.image || "/placeholder.jpg"} alt={`Bidder ${index + 1}`} />
                                                <AvatarFallback>B{index + 1}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="text-2xl text-gray-400 font-bold">{auction.bids.length}</div>
                                        <span className="text-sm text-gray-400">Total Bids</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {auction.highestBidder?.image && (
                                        <Avatar className="w-14 h-14 border-2 border-yellow-400">
                                            <AvatarImage src={auction.highestBidder.image} alt="Winner" />
                                            <AvatarFallback>W</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="text-white">
                                        <h4 className="font-bold text-xl text-yellow-300">${auction.highestBid}</h4>
                                        <span className="text-sm text-gray-400">Current Winner</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-400 text-lg font-semibold">No bids placed yet</div>
                        )}
                        <PlaceBidDrawer auction={auction} token={token} />
                    </div>
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
                </Card>
            </div>
        </>
    );
}

<<<<<<< HEAD
export default AuctionBar;
=======
export default AuctionBar;
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)

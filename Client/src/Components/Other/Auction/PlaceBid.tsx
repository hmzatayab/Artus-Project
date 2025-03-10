import * as React from "react";
import { CheckCircle, CalendarIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/Components/ui/drawer";
import { toast } from "sonner";
import LoadingIcon from "@/utils/Loading";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { placeBid } from "@/APIs/Auction"; // Assuming you have an API to place bids
import { AuctionResponse } from "@/Types/Auction";
import { Link, useNavigate } from "react-router-dom";
import { RiQuestionFill } from "@remixicon/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/Components/ui/hover-card";

interface PlaceBidDrawerProps {
    auction: AuctionResponse["auction"];
    token: string;
}

export function PlaceBidDrawer({ auction, token }: PlaceBidDrawerProps) {
    const [amount, setAmount] = React.useState(auction.highestBid || auction.startingPrice);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const Navigate = useNavigate();
    const minBidAmount = auction.highestBid ? auction.highestBid + 1 : auction.startingPrice;

    function onClick(adjustment: number) {
        setAmount(Math.max(minBidAmount, amount + adjustment));
    }

    const handlePlaceBid = async () => {
        setLoading(true);
        try {
            console.log(`Auction Id: ${auction.id}, Bid Amount: ${amount},`);
            await placeBid(auction.id, token, amount);
            setIsConfirmDialogOpen(false);
            setIsSuccessDialogOpen(true);
            toast.success("Bid placed successfully!");
        } catch (err) {
            toast.error(`Failed to place bid: ${err || "Something went wrong!"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBid = () => {
        if (amount < minBidAmount) {
            toast.error(`Bid amount must be at least $${minBidAmount}`);
            return;
        }
        if (!token) {
            toast("You need to login first", {
                action: {
                    label: "Login",
                    onClick: () => Navigate("/login"),
                },
            });
            return;
        }
        setIsConfirmDialogOpen(true);
    };

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    {auction.status === "active" ? (
                        <Button
                            variant={"outline"}
                            className="px-7 py-6 cursor-pointer bg-black transition-transform transform hover:scale-105"
                        >
                            Place Bid
                        </Button>
                    ) : (
                        <div className="text-gray-500 text-lg font-semibold">
                            Auction Ended
                        </div>
                    )}
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm text-center">
                        <DrawerHeader>
                            <DrawerTitle>Place a Bid</DrawerTitle>
                            <DrawerDescription>Set the amount you want to bid.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 flex flex-col items-center">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(-10)}
                                    disabled={amount <= minBidAmount}
                                >
                                    {/* <Minus /> */}
                                    <span>-10</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(-1)}
                                    disabled={amount <= minBidAmount}
                                >
                                    {/* <Minus /> */}
                                    <span>-1</span>
                                </Button>
                                <div className="text-6xl font-bold tracking-tighter">${amount}</div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(1)}
                                >
                                    {/* <Plus /> */}
                                    <span>+1</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(10)}
                                >
                                    {/* <Plus /> */}
                                    <span>+10</span>
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Minimum bid: ${minBidAmount}
                            </p>
                        </div>
                        <DrawerFooter className="flex flex-col gap-2 mt-6">
                            <Button className="w-full" onClick={handleConfirmBid}>Place Bid</Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Bid</DialogTitle>
                        <DialogDescription>
                            Please review the details before confirming your bid.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm font-medium text-gray-500">Current Highest Bid</div>
                            <div className="text-sm font-semibold">${auction.highestBid}</div>

                            <div className="text-sm font-medium text-gray-500">Your Bid Amount</div>
                            <div className="text-sm font-semibold">${amount}</div>

                            <div className="text-sm font-medium text-gray-500 flex gap-2 items-center">
                                Bid Fee
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-blue-600"><Link to={"/"}><RiQuestionFill size={17} /></Link></span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="shadow-lg">
                                        <div className="flex justify-between space-x-4">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">@hamza</h4>
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
                            <div className="text-sm font-semibold">$1</div>
                            <div className="text-sm font-medium text-gray-500">Net Transfer Amount</div>
                            <div className="text-sm font-semibold text-green-600">${(amount + 1).toFixed(2)}</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePlaceBid} disabled={loading}>
                            {loading ? (
                                <div role="status" className="flex items-center gap-2">
                                    <LoadingIcon />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Confirm Bid"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            Bid Placed Successfully
                        </DialogTitle>
                        <DialogDescription>
                            Your bid of <strong>${amount}</strong> has been successfully placed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setIsSuccessDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
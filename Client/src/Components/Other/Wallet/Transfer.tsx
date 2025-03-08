import * as React from "react";
import { Minus, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/Components/ui/drawer";
import { Card } from "../../ui/card";
import { getWallet, transferAmount } from "@/APIs/Wallet";
import { getUser } from "@/utils/Storage";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import LoadingIcon from "@/utils/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUSers } from "@/APIs/User";
import { User } from "@/Types/User";
import { AppError } from "@/Types/error";
import { Wallet } from "@/Types/Wallet";

export function TransferDrawer() {
    const [amount, setAmount] = React.useState(50);
    const [recipient, setRecipient] = React.useState("");
    const [recipientUser, setRecipientUser] = React.useState<User | null>(null);
    const [userList, setUserList] = React.useState<User[]>([]);
    const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);
    const [wallet, setWallet] = React.useState<Wallet | null>(null);
    const [loading, setLoading] = React.useState(false);

    const data = getUser();
    const user = data.user
    const token = data.token;

    React.useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await getUSers(token);
                if (Array.isArray(response)) {
                    setUserList(response);
                } else {
                    toast.error("Failed to fetch users: Invalid response format");
                }
            } catch (error) {
                toast.error(`${error} "Failed to fetch users"`);
            }
        };
        fetchUserList();
    }, [token]);

    React.useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await getWallet(token);
                setWallet(data);
            } catch (err) {
                console.error(err);
                const error = err as AppError;
                console.log(error.message);
            }
        };
        fetchWallet();
    }, [])

    const handleRecipientSearch = (username: string) => {
        const selectedUser = userList.find(
            (user: any) => user.username.toLowerCase() === username.toLowerCase()
        );
        setRecipientUser(selectedUser || null);
    };

    function onClick(adjustment: number) {
        setAmount(Math.max(10, Math.min(1000, amount + adjustment)));
    }

    const handleTransfer = async () => {
        if (!user) {
            toast.error("User not found");
            return;
        }

        if (!user.isEmailVerified) {
            toast.error("Email not verified. Please verify your email first.");
            return;
        }

        if (!recipientUser) {
            toast.error("Please select a valid recipient.");
            return;
        }

        if (!recipientUser.isEmailVerified) {
            toast.error("Receiver email not verified.");
            return;
        }

        if (!wallet?.wallet.isActive) {
            toast.error("Transaction failed because your wallet is not active.");
            return;
        }

        if (user.isBlocked) {
            toast.error("Your account is blocked. Please contact support.");
            return;
        }

        if (recipientUser.isBlocked) {
            toast.error("Receiver account is blocked.");
            return;
        }

        if (user.id === recipientUser.id) {
            toast.error("Cannot transfer funds to yourself.");
            return;
        }

        if (!wallet?.wallet) {
            toast.error("Wallet not found.");
            return;
        }

        setLoading(true);
        try {
            await transferAmount(amount, recipientUser.id, token);
            setIsConfirmDialogOpen(false);
            setIsSuccessDialogOpen(true);
            toast.success("Transfer Successful");
        } catch (err) {
            toast.error(`Failed to transfer ${err || "Something went wrong!"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmTransfer = () => {
        if (!recipientUser) {
            toast.error("Please select a valid recipient.");
            return;
        }
        setIsConfirmDialogOpen(true);
    };

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Card className="cursor-pointer relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform h-36">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-bold relative">Transfer Funds</h2>
                        <p className="text-gray-400 mt-2 relative">Minimum $1</p>
                    </Card>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm text-center">
                        <DrawerHeader>
                            <DrawerTitle>Transfer Funds</DrawerTitle>
                            <DrawerDescription>Set the amount you want to transfer.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 flex flex-col items-center">
                            {/* Amount Selection */}
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(-10)}
                                    disabled={amount <= 10}
                                >
                                    <Minus />
                                </Button>
                                <div className="text-6xl font-bold tracking-tighter">${amount}</div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() => onClick(10)}
                                    disabled={amount >= 1000}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>
                        <DrawerFooter className="flex flex-col gap-2 mt-6">
                            <Button
                                className="w-full"
                                onClick={() => setIsSearchDialogOpen(true)}
                            >
                                Select Recipient
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="w-full">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Search Dialog */}
            <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select Recipient</DialogTitle>
                        <DialogDescription>
                            Enter the username of the recipient you want to transfer funds to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full mb-4">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => {
                                setRecipient(e.target.value);
                                handleRecipientSearch(e.target.value);
                            }}
                            placeholder="Enter recipient's username"
                            className="w-full px-4 py-2 border-2 outline-1 rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
                        />
                        {recipientUser ? (
                            <div className="mt-4 flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={recipientUser.image || ""} alt="Recipient Avatar" />
                                    <AvatarFallback>{recipientUser.username?.[0] || "A"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{recipientUser.username}</p>
                                    <p className="text-sm text-gray-400">Followers: {recipientUser.followers.length || 0}</p>
                                </div>
                            </div>
                        ) : (
                            recipient && <p className="mt-4 text-sm text-gray-400">No user found.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            className="w-full"
                            onClick={() => {
                                setIsSearchDialogOpen(false);
                                handleConfirmTransfer();
                            }}
                            disabled={!recipientUser}
                        >
                            Next
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Transfer</DialogTitle>
                        <DialogDescription>
                            Please review the details before confirming your transfer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Sender and Recipient Avatars */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={data.user.image} alt="Sender Avatar" />
                                    <AvatarFallback>{data.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-white font-bold">Sender</span>
                            </div>
                            <div className="text-2xl">➔</div>
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={recipientUser?.image || ""} alt="Recipient Avatar" />
                                    <AvatarFallback>{recipientUser?.username?.[0] || "A"}</AvatarFallback>
                                </Avatar>
                                <span className="text-white font-bold">{recipientUser?.username}</span>
                            </div>
                        </div>

                        {/* Transfer Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm font-medium text-gray-500">Current Balance</div>
                            <div className="text-sm font-semibold">$500.00</div>

                            <div className="text-sm font-medium text-gray-500">Transfer Amount</div>
                            <div className="text-sm font-semibold">${amount}</div>

                            <div className="text-sm font-medium text-gray-500">Fee (2%)</div>
                            <div className="text-sm font-semibold">${(amount * 0.02).toFixed(2)}</div>

                            <div className="text-sm font-medium text-gray-500">Net Transfer Amount</div>
                            <div className="text-sm font-semibold text-green-600">${(amount * 0.98).toFixed(2)}</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleTransfer} disabled={loading}>
                            {loading ? (
                                <div role="status" className="flex items-center gap-2">
                                    <LoadingIcon />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Confirm Transfer"
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
                            Transfer Successful
                        </DialogTitle>
                        <DialogDescription>
                            Your transfer of <strong>${amount}</strong> has been successfully processed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setIsSuccessDialogOpen(false)}>View Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
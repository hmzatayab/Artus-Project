"use client";

import * as React from "react";
import { Minus, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Card } from "../ui/card";
import { withdrawAmount } from "@/APIs/Wallet"; // Import withdraw API
import { getUser } from "@/utils/storage";
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import LoadingIcon from "@/utils/Loading";

export function WithdrawDrawer() {
    const [amount, setAmount] = React.useState(50);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const data = getUser();
    const token = data.token;

    function onClick(adjustment: any) {
        setAmount(Math.max(10, Math.min(1000, amount + adjustment)));
    }

    const handleWithdraw = async () => {
        setLoading(true); // Start loading
        try {
            await withdrawAmount(amount, token); // Call withdraw API
            setIsConfirmDialogOpen(false); // Close confirmation dialog
            setIsSuccessDialogOpen(true); // Open success dialog
            toast.success("Withdrawal Successful");
        } catch (err) {
            toast.error(`Failed to withdraw ${err || "Something went wrong!"}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleConfirmWithdraw = () => {
        setIsConfirmDialogOpen(true); // Open confirmation dialog
    };

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Card className="cursor-pointer relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform h-36">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-green-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-bold relative">Withdraw</h2>
                        <p className="text-gray-400 mt-2 relative">Minimum $1</p>
                    </Card>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm text-center">
                        <DrawerHeader>
                            <DrawerTitle>Withdraw Funds</DrawerTitle>
                            <DrawerDescription>Set the amount you want to withdraw.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 flex flex-col items-center">
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
                            <Button className="w-full" onClick={handleConfirmWithdraw}>Withdraw</Button>
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
                        <DialogTitle>Confirm Withdrawal</DialogTitle>
                        <DialogDescription>
                            Please review the details before confirming your withdrawal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm font-medium text-gray-500">Current Balance</div>
                            <div className="text-sm font-semibold">$500.00</div>

                            <div className="text-sm font-medium text-gray-500">Withdraw Amount</div>
                            <div className="text-sm font-semibold">${amount}</div>

                            <div className="text-sm font-medium text-gray-500">Fee (2%)</div>
                            <div className="text-sm font-semibold">${(amount * 0.02).toFixed(2)}</div>

                            <div className="text-sm font-medium text-gray-500">Net Transfer Amount</div>
                            <div className="text-sm font-semibold text-green-600">${(amount * 0.98).toFixed(2)}</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleWithdraw} disabled={loading}>
                            {loading ? (
                                <div role="status" className="flex items-center gap-2">
                                    <LoadingIcon /> 
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Confirm Withdrawal"
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
                            Withdrawal Successful
                        </DialogTitle>
                        <DialogDescription>
                            Your withdrawal of <strong>${amount}</strong> has been successfully processed.
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
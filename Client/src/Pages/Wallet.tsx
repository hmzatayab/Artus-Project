import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ChartComponent } from "@/components/Other/Analytics/ChartForViews";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DepositDrawer } from "@/components/Other/Wallet/Deposit";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/Storage";
import { getTransactions, getWallet } from "@/APIs/Wallet";
import { Switch } from "@/components/ui/switch";
import { TransactionHistorySkeleton } from "@/components/Other/Skeleton/Transactions";
import type { Wallet, TransactionsResponse } from "@/Types/Wallet";
import { WithdrawDrawer } from "@/components/Other/Wallet/Withdraw";
import { TransferDrawer } from "@/components/Other/Wallet/Transfer";
import { toast } from "sonner";
import { AppError } from "@/Types/error"
import { RiArrowGoBackLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

function Wallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<TransactionsResponse[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const User = getUser().user;
    const token = getUser().token;

    const walletId = wallet?.wallet.id;
    console.log(transactions);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await getWallet(token);
                setWallet(data);
            } catch (err) {
                console.error(err);
                const error = err as AppError;
                setError(error.message);
            }
        };
        fetchWallet();
    }, [])

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                if (!walletId) {
                    console.error("walletId is undefined");
                    return;
                }
                const res = await getTransactions(token, walletId);
                setTransactions(res.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [walletId]);

    
    const transactionData = transactions.reduce((acc, transaction: any) => {
        const date = transaction.createdAt.split("T")[0]; 
        if (!acc[date]) {
            acc[date] = {
                date,
                totalAmount: 0,
                totalTransactions: 0,
                totalWithdrawals: 0,
                totalDeposits: 0,
                totalTransfers: 0,
                totalWithdrawalsAmount: 0,
                totalDepositsAmount: 0,
                totalTransfersAmount: 0,
            };
        }
        
        acc[date].totalAmount += transaction.amount;
        
        acc[date].totalTransactions += 1;
        
        if (transaction.type === "withdraw") {
            acc[date].totalWithdrawals += 1;
            acc[date].totalWithdrawalsAmount += transaction.amount;
        } else if (transaction.type === "deposit") {
            acc[date].totalDeposits += 1;
            acc[date].totalDepositsAmount += transaction.amount;
        } else if (transaction.type === "transfer") {
            acc[date].totalTransfers += 1;
            acc[date].totalTransfersAmount += transaction.amount;
        }

        return acc;
    }, {} as Record<string, {
        date: string;
        totalAmount: number;
        totalTransactions: number;
        totalWithdrawals: number;
        totalDeposits: number;
        totalTransfers: number;
        totalWithdrawalsAmount: number;
        totalDepositsAmount: number;
        totalTransfersAmount: number;
    }>);

    const transformedData = Object.values(transactionData);

    if (error) return toast(`${error}`);

    return (
        <div className="mt-20 text-white flex flex-col  py-5 px-4">
            <Card className="relative w-full p-6 text-white shadow-lg rounded-2xl overflow-hidden mb-4">
                {/* Glowing Effect */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 rounded-full blur-3xl"></div>

                {/* Card Content with High z-index */}
                <div className="relative z-10 flex justify-between items-center">
                    {/* Left: Toggle Button */}
                    <div className="flex items-center gap-4">
                        <Link to={"/dashboard"}>
                            <Button variant={"outline"} className="cursor-pointer bg-transparent">
                                <RiArrowGoBackLine />
                            </Button>
                        </Link>
                        <div>
                            <p className="text-4xl font-light">
                                Hi<span className="font-bold ml-2">{User.name}</span>
                            </p>
                            <p className="text-sm text-gray-400 italic">
                                <span className="font-bold">Wallet ID</span> #
                                {wallet?.wallet ? wallet.wallet.walletId : "Loading..."}
                            </p>
                        </div>
                    </div>

                    {/* Right: User Info */}
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
                        />
                        <span className="text-sm text-gray-400">{isActive ? "Active" : "Inactive"}</span>
                    </div>
                </div>
            </Card>

            {/* Main Grid */}
            <div className="w-full max-w-full p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-950 rounded-xl outline">
                {/* Left Section: Wallet Actions */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Balance Card */}
                    <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition transform h-36">
                        {/* Glowing Effect */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-4xl font-bold relative">${wallet?.wallet.balance}</h2>
                        <p className="text-gray-400 mt-2 relative">Total Balance</p>
                    </Card>

                    {/* Total Transactions Card */}
                    <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition transform h-36">
                        {/* Glowing Effect */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-4xl font-bold relative">
                            {transactions.length}
                        </h2>
                        <p className="text-gray-400 mt-2 relative">Total Transactions</p>
                    </Card>

                    {/* Total Spent Amount Card */}
                    <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition transform h-36">
                        {/* Glowing Effect */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-red-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-500 to-red-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-4xl font-bold relative">
                            $
                            {transactions.reduce(
                                (total, transaction: any) =>
                                    transaction.type === "withdraw" ||
                                        transaction.type === "transfer"
                                        ? total + transaction.amount
                                        : total,
                                0
                            )}
                        </h2>
                        <p className="text-gray-400 mt-2 relative">Total Spent</p>
                    </Card>

                    {/* Withdraw Card */}
                    <WithdrawDrawer />

                    {/* Deposit Card */}
                    <DepositDrawer />

                    {/* Transfer Funds Card */}
                    <TransferDrawer />
                </div>

                {/* Right Section: Transactions */}
                <Card className="relative p-6 rounded-xl shadow-lg outline dark:bg-[#050c1c]">
                    {/* Glowing Effect */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>

                    {/* Transaction History Content */}
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <div className="space-y-2 overflow-y-auto max-h-[360px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                        {isLoading ? (
                            <TransactionHistorySkeleton />
                        ) : transactions.length > 0 ? (
                            // Render actual transactions
                            transactions.map((transaction: any) => (
                                <Link to={`/invoice/${transaction.transactionId}`} key={transaction.transactionId}>
                                    <Card className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-950 p-4 rounded-lg hover:bg-gray-600 transition mt-2">
                                        {/* Left Section - User Details */}
                                        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                                            {transaction.type === 'transfer' ? (
                                                <div className="flex items-center space-x-2 sm:space-x-4 w-full">
                                                    {/* Sender */}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={transaction.fromUser?.image}
                                                                alt="Sender Profile"
                                                            />
                                                            <AvatarFallback>
                                                                {transaction.fromUser?.name?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                                                            {transaction.fromUser?.name || 'Unknown'}
                                                        </p>
                                                    </div>

                                                    <span className="text-gray-400 text-sm">➜</span>

                                                    {/* Recipient */}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={transaction.toUser?.image || '/default-avatar.png'}
                                                                alt="Recipient Profile"
                                                            />
                                                            <AvatarFallback>
                                                                {transaction.toUser?.name?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                                                            {transaction.toUser?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={User?.image || ''}
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback>
                                                            {User?.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm sm:text-base font-semibold">
                                                            {User?.name || 'Unknown User'}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-400">
                                                            {transaction.type.charAt(0).toUpperCase() +
                                                                transaction.type.slice(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Section - Amount & Time */}
                                        <div className="flex flex-col items-end text-right w-full sm:w-auto mt-2 sm:mt-0">
                                            <div
                                                className={`font-bold ${transaction.type === 'deposit'
                                                    ? 'text-green-400'
                                                    : transaction.type === 'transfer'
                                                        ? 'text-yellow-400'
                                                        : 'text-red-400'
                                                    }`}
                                            >
                                                {transaction.type === 'deposit'
                                                    ? '+ '
                                                    : transaction.type === 'transfer'
                                                        ? '⇄ '
                                                        : '- '}
                                                ${transaction.amount}
                                            </div>
                                            <p className="text-xs font-normal text-gray-400">
                                                {formatDistanceToNow(new Date(transaction.createdAt), {
                                                    addSuffix: false,
                                                })}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No transactions found.</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* New Section: Recent Purchases / Finance Graph */}
            <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-gray-950 p-10 rounded-xl outline">
                {/* Last Purchased Item */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Last Purchased Item",
                            img: "http://localhost:3000/Images/6f99b692df9837ef20e721a6.jpg",
                            description: "Bought: Premium Membership",
                            amount: "$50",
                            link: "/post/67c19a49ce84943616d9c8a1",
                        },
                        {
                            title: "Most Expensive Purchase",
                            img: "http://localhost:3000/Images/8624b38b3ec1c02f194bd928.jpg",
                            description: "Bought: VIP Access",
                            amount: "$100",
                            link: "/post/67c05c2bd9817e146bba9ea7",
                        },
                    ].map((item, index) => (
                        <Link to={item.link || "/"}>
                            <Card
                                key={index}
                                className="relative p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                                {/* Glowing Effect */}
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>

                                {/* Card Content */}
                                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                                <div className="relative w-full h-60 overflow-hidden rounded-lg">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                </div>
                                <p className="text-gray-400 mt-3">{item.description}</p>
                                <p className="text-lg font-semibold text-yellow-400">
                                    {item.amount}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Financial Graph */}
                <Card className="relative p-4 rounded-xl shadow-lg border border-gray-700">
                    {/* Glowing Effect */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-green-500 opacity-20 rounded-full blur-3xl"></div>

                    {/* Chart Component */}
                    <ChartComponent
                        data={transformedData}
                        title="Transaction Chart"
                        description="Showing total transactions, amount, withdrawals, deposits, and transfers per day"
                        dataKeys={[
                            "totalAmount",
                            "totalTransactions",
                            "totalWithdrawals",
                            "totalDeposits",
                            "totalTransfers",
                            "totalWithdrawalsAmount",
                            "totalDepositsAmount",
                            "totalTransfersAmount",
                        ]} 
                        colors={[
                            "#4287f5", // Total Amount
                            "#34d399", // Total Transactions
                            "#ef4444", // Total Withdrawals
                            "#f59e0b", // Total Deposits
                            "#8b5cf6", // Total Transfers
                            "#dc2626", // Total Withdrawals Amount
                            "#d97706", // Total Deposits Amount
                            "#7c3aed", // Total Transfers Amount
                        ]} 
                    />
                </Card>
            </div>
        </div>
    );
}

export default Wallet;
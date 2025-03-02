"use client"; // Add this if you're using Next.js

import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ChartComponent } from "@/components/Analytics/ChartForViews";
import { Card } from "@/components/ui/card"; // Shadcn Card
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Shadcn Avatar
import { TransactionHistorySkeleton } from "@/components/Skeleton/Transactions";

function Wallet() {
    // Dummy Data
    const balance = 1500; // Total Balance
    const transactionHistory = [
        {
            _id: "1",
            type: "deposit",
            amount: 500,
            createdAt: "2024-05-01T10:00:00Z",
            wallet: {
                user: {
                    name: "John Doe",
                    image: "https://via.placeholder.com/150",
                },
            },
        },
        {
            _id: "2",
            type: "withdraw",
            amount: 200,
            createdAt: "2024-05-02T12:00:00Z",
            wallet: {
                user: {
                    name: "Jane Smith",
                    image: "https://via.placeholder.com/150",
                },
            },
        },
        {
            _id: "3",
            type: "transfer",
            amount: 100,
            createdAt: "2024-05-03T14:00:00Z",
            wallet: {
                user: {
                    name: "Alice Johnson",
                    image: "https://via.placeholder.com/150",
                },
            },
            recipientWallet: {
                user: {
                    name: "Bob Brown",
                    image: "https://via.placeholder.com/150",
                },
            },
        },
    ];

    return (
        <div className="mt-20 text-white flex flex-col items-center py-5 px-4">
            {/* Main Grid */}
            <div className="w-full max-w-full p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-950 rounded-xl outline">
                {/* Left Section: Wallet Actions */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Balance Card */}
                    <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition transform h-36">
                        {/* Glowing Effect */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-4xl font-bold relative">${balance}</h2>
                        <p className="text-gray-400 mt-2 relative">Total Balance</p>
                    </Card>

                    {/* Total Transactions Card */}
                    <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition transform h-36">
                        {/* Glowing Effect */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                        <h2 className="text-4xl font-bold relative">
                            {transactionHistory.length}
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
                            {transactionHistory.reduce(
                                (total, transaction) =>
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
                    <Link to="/withdraw">
                        <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform h-36">
                            {/* Glowing Effect */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-red-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-500 to-red-500 opacity-20 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-bold relative">Withdraw</h2>
                            <p className="text-gray-400 mt-2 relative">Minimum $50</p>
                        </Card>
                    </Link>

                    {/* Deposit Card */}
                    <Link to="/deposit">
                        <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform h-36">
                            {/* Glowing Effect */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-green-500 opacity-20 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-bold relative">Deposit</h2>
                            <p className="text-gray-400 mt-2 relative">Minimum $1</p>
                        </Card>
                    </Link>

                    {/* Transfer Funds Card */}
                    <Link to="/transfer">
                        <Card className="relative p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform h-36">
                            {/* Glowing Effect */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-bold relative">Transfer Funds</h2>
                            <p className="text-gray-400 mt-2 relative">Minimum $1</p>
                        </Card>
                    </Link>
                </div>

                {/* Right Section: Transactions */}
                <Card className="relative p-6 rounded-xl shadow-lg outline dark:bg-[#050c1c]">
                    {/* Glowing Effect */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>

                    {/* Transaction History Content */}
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                        {transactionHistory.length > 0 ? (
                            transactionHistory.map((transaction) => (
                                <Link to={`/invoice/${transaction._id}`} key={transaction._id}>
                                    <Card className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-950 p-4 rounded-lg hover:bg-gray-600 transition mt-2">
                                        {/* Left Section - User Details */}
                                        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                                            {transaction.type === "transfer" ? (
                                                <div className="flex items-center space-x-2 sm:space-x-4 w-full">
                                                    {/* Sender */}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={transaction.wallet.user.image}
                                                                alt="Sender Profile"
                                                            />
                                                            <AvatarFallback>
                                                                {transaction.wallet.user?.name?.charAt(0) || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                                                            {transaction.wallet.user?.name || "Unknown"}
                                                        </p>
                                                    </div>

                                                    <span className="text-gray-400 text-sm">➜</span>

                                                    {/* Recipient */}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={
                                                                    transaction.recipientWallet?.user?.image ||
                                                                    "/default-avatar.png"
                                                                }
                                                                alt="Recipient Profile"
                                                            />
                                                            <AvatarFallback>
                                                                {transaction.recipientWallet?.user?.name?.charAt(0) || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                                                            {transaction.recipientWallet?.user?.name ||
                                                                "Unknown"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={transaction.wallet.user.image}
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback>
                                                            {transaction.wallet.user?.name?.charAt(0) || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm sm:text-base font-semibold">
                                                            {transaction.wallet.user?.name || "Unknown User"}
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
                                                className={`font-bold ${transaction.type === "deposit"
                                                    ? "text-green-400"
                                                    : transaction.type === "transfer"
                                                        ? "text-yellow-400"
                                                        : "text-red-400"
                                                    }`}
                                            >
                                                {transaction.type === "deposit"
                                                    ? "+ "
                                                    : transaction.type === "transfer"
                                                        ? "⇄ "
                                                        : "- "}
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
                        <Link to={item.link || "/" }>
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
                    <ChartComponent />
                </Card>
            </div>
        </div>
    );
}

export default Wallet;
import React from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu"; // Adjust the import path
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

interface Notification {
    id: string;
    message: string;
    sender: {
        image: string;
    };
    isRead: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    notifications: Notification[];
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications }) => {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative cursor-pointer">
                    <Bell className="w-6 h-6" />

                    {/* Red Notification Badge */}
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-3 flex items-center justify-center bg-red-500 w-5 h-4 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {notifications.filter((notification) => !notification.isRead).length}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-96 max-h-[500px] overflow-hidden overflow-y-auto no-scrollbar mt-2 dark:shadow-lg dark:shadow-gray-700/50 shadow-lg shadow-gray-700/50">
                {notifications.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center px-2 py-1">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuLabel>
                                <Button className="text-xs font-medium cursor-pointer">View All</Button>
                            </DropdownMenuLabel>
                        </div>
                        <DropdownMenuSeparator />
                    </div>
                )}

                {notifications.length > 0 ? (
                    notifications
                        .slice() // Original array ko mutate na karne ke liye copy bana rahe hain
                        .slice(0, 12)
                        .map((notification) => (
                            <div key={notification.id}>
                                <DropdownMenuItem className="cursor-pointer mb-2">
                                    <div>
                                        <Link to="/some-page" className="flex px-4 py-3 transition">
                                            <div className="shrink-0 relative">
                                                <Link to="/profile/username">
                                                    <img
                                                        className="rounded-full w-11 h-11"
                                                        src={notification.sender.image}
                                                        alt="Notification"
                                                    />
                                                </Link>
                                                {!notification.isRead && (
                                                    <div className="absolute flex items-center justify-center w-3 h-3 ms-7 -mt-3 rounded-full bg-red-500 outline-3 outline-white"></div>
                                                )}
                                            </div>

                                            <div className="w-full ps-3">
                                                <div className="text-sm mb-1.5 flex">
                                                    <div className="flex items-center text-sm mb-1.5">
                                                        <span>{notification.message}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="w-80 mx-auto opacity-50" />
                            </div>
                        ))
                ) : (
                    <DropdownMenuItem className="cursor-pointer">No notifications</DropdownMenuItem>
                )}
            </DropdownMenuContent>

        </DropdownMenu>


    );
};

export default NotificationDropdown;













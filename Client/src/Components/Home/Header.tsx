import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/DarkMode/mode-toggle";
import { getUser, removeUser } from "@/utils/storage";
import { getUserNotifications } from "@/Store/User";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
    sender: {
        id: string;
        username: string;
        image: string;
      };
}

function Header() {
    const Navigator = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    // console.log(notifications[0].sender.image);
    
    const data = getUser();
    const token = data?.token;

    const LogOut = (() => {
        removeUser();
        localStorage.removeItem("userToken");
        Navigator("/");
        toast("Signout successful")
    })

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) return;
            try {
                const data = await getUserNotifications(token);
                setNotifications(data.notifications || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </Link>

                {/* Right Side Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to="/explore" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>
                            Explore
                        </Link>
                        <Link to="/advertise" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>
                            Advertise
                        </Link>
                        <Link to="/get-unsplash" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>
                            Get Artus+
                        </Link>
                    </div>
                    <div className="hidden md:block w-px h-6 bg-gray-300" />
                    {token ? (
                        <div className="flex items-center gap-4 justify-center">

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
                                <DropdownMenuContent className="w-96 max-h-[500px] overflow-hidden overflow-y-auto no-scrollbar mt-2">
                                    {notifications.length > 0 && (
                                        <div>
                                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </div>
                                    )}
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <DropdownMenuItem className="cursor-pointer">
                                                <div className="">
                                                    <div>
                                                        <Link
                                                            to="/some-page"
                                                            className="flex px-4 py-3 transition"
                                                        >
                                                            <div className="shrink-0 relative">
                                                                <Link to="/profile/username">
                                                                    <img
                                                                        className="rounded-full w-11 h-11"
                                                                        src={notification.sender.image}
                                                                        alt="Notification"
                                                                    />
                                                                </Link>
                                                                {!notification.isRead && (
                                                                    <div className="absolute flex items-center justify-center w-3 h-3 ms-7 -mt-3 rounded-full bg-red-500 outline-3 outline-white ">
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <div className="w-full ps-3">
                                                                <div className="text-sm mb-1.5 flex">
                                                                    <div className="flex items-center text-sm mb-1.5">
                                                                        <span>{notification.message}</span>
                                                                    </div>

                                                                </div>
                                                                <div className="text-xs ">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem className="cursor-pointer">
                                            No notifications
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={data.user.image} />
                                        <AvatarFallback>
                                            {data.user.name.split(" ")[0].slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer"><Link to={'/dashboard'}>Dashboard</Link></DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Subscription</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={LogOut}>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button variant="outline" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                    )}

                    <Button asChild>
                        <Link to="/submit">Submit an image</Link>
                    </Button>
                    <ModeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="items-center gap-4 flex md:hidden">
                    {token ? (
                        <div className="flex gap-4 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="relative cursor-pointer">
                                        <Bell className="w-6 h-6" />

                                        {/* Red Notification Badge */}
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-1 -right-3 flex items-center justify-center bg-red-500 w-5 h-4 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-96 max-h-[500px] mt-2 mr-4 overflow-hidden overflow-y-auto no-scrollbar">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem className="cursor-pointer">
                                            <div className="flex">
                                                <div>
                                                    <Link
                                                        to="/some-page"
                                                        className="flex px-4 py-3 transition"
                                                    >
                                                        <div className="shrink-0 relative">
                                                            <Link to="/profile/username">
                                                                <img
                                                                    className="rounded-full w-11 h-11"
                                                                    src="https://github.com/shadcn.png"
                                                                    alt="Notification"
                                                                />
                                                            </Link>
                                                            {!notification.isRead && (
                                                                <div className="absolute flex items-center justify-center w-3 h-3 ms-7 -mt-3 rounded-full bg-red-600 border outline-3 outline-white">
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-full ps-3">
                                                            <div className="text-sm mb-1.5">
                                                                {notification.message}
                                                            </div>
                                                            <div className="text-xs ">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src={data.user.image} className="cursor-pointer" />
                                        <AvatarFallback>
                                            {data.user.name.split(" ")[0].slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer"><Link to={'/dashboard'}>Dashboard</Link></DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">Subscription</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={LogOut}>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button variant="outline" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                    )}
                    <Sheet>
                        <SheetTrigger><Menu size={24} /></SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle>Are you absolutely sure?</SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}

export default Header;
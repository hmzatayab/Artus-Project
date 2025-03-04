import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/DarkMode/mode-toggle";
import { getUser, removeUser } from "@/utils/storage";
import { getUserNotifications } from "@/APIs/User";
import { toast } from "sonner"
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import CreatePostDrawer from "./CreatePostDrawer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import NotificationDropdown from "./Notification";
import { MenuComponent } from "./Menu";
import { Notification } from "@/Types/Notification"

// interface Notification {
//     id: string;
//     message: string;
//     link?: string;
//     isRead: boolean;
//     createdAt: string;
//     sender: {
//         id: string;
//         username: string;
//         image: string;
//     };
// }

function Header() {
    // const Navigator = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [openDailog, setOpenDailog] = useState(false);

    const data = getUser();
    const token = data?.token;

    const LogOut = (() => {
        removeUser();
        localStorage.removeItem("userToken");
        toast("Signout successful")
    })

    const handleOpen = () => {
        if (!token) {
            toast("Login First! Image cannot be submitted");
            return;
        }
        setOpenDailog(true);
    };

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
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </Link>
                {/* Right Side Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <MenuComponent></MenuComponent>
                    <div className="hidden md:block w-px h-6 bg-gray-300" />
                    {token ? (
                        <div className="flex items-center gap-4 justify-center">
                            <NotificationDropdown notifications={notifications} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={data.user.image} />
                                        <AvatarFallback className="text-green-500">
                                            {data.user.name.split(" ")[0].slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link to={'/dashboard'}>Dashboard</Link>
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Billing
                                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Keyboard shortcuts
                                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem>Email</DropdownMenuItem>
                                                    <DropdownMenuItem>Message</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>More...</DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem>
                                            New Team
                                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuItem disabled>API</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setOpen(true)}>
                                        Log out
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent className=" rounded-lg shadow-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl font-bold">
                                            Are you sure you want to sign out?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-600">
                                            This will log you out of your account. You’ll need to sign back in to access your account.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            onClick={() => setOpen(false)}
                                            className=" "
                                        >
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={LogOut}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Sign Out
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : (
                        <Button variant="outline" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                    )}
                    <Dialog open={openDailog} onOpenChange={setOpenDailog}>

                        <Button className="cursor-pointer" onClick={handleOpen}>
                            Submit an image
                        </Button>
                        <DialogContent>
                            <CreatePostDrawer />
                        </DialogContent>
                    </Dialog>
                    <ModeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="items-center gap-4 flex md:hidden">
                    {token ? (
                        <div className="flex gap-4 items-center justify-center">
                            <NotificationDropdown notifications={notifications} />
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
                                <Dialog>
                                    <DialogTrigger>
                                        <Button className="cursor-pointer">Submit an image</Button>
                                    </DialogTrigger>
                                    <CreatePostDrawer />
                                </Dialog>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}

export default Header;
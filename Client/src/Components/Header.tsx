import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/DarkMode/mode-toggle";
import { getUser, removeUser } from "@/utils/storage";
import { getUserNotifications } from "@/Store/User";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, } from "@/components/ui/navigation-menu"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import CreatePostDrawer from "./CreatePostDrawer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import NotificationDropdown from "./Notification";

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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

function Header() {
    const Navigator = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [openDailog, setOpenDailog] = useState(false);
    // console.log(notifications[0].sender.image);

    const data = getUser();
    const token = data?.token;

    const LogOut = (() => {
        removeUser();
        localStorage.removeItem("userToken");
        Navigator("/");
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
                {/* Logo */}
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </Link>

                {/* Right Side Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden md:flex gap-6 items-center">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                        href="/"
                                                    >
                                                        {/* <Icons.logo className="h-6 w-6" /> */}
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            shadcn/ui
                                                        </div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Beautifully designed components built with Radix UI and
                                                            Tailwind CSS.
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <ListItem href="/docs" title="Introduction">
                                                Re-usable components built using Radix UI and Tailwind CSS.
                                            </ListItem>
                                            <ListItem href="/docs/installation" title="Installation">
                                                How to install dependencies and structure your app.
                                            </ListItem>
                                            <ListItem href="/docs/primitives/typography" title="Typography">
                                                Styles for headings, paragraphs, lists...etc
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            {components.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to={"/docs"}>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Documentation
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="hidden md:block w-px h-6 bg-gray-300" />
                    {token ? (
                        <div className="flex items-center gap-4 justify-center">

                            <NotificationDropdown notifications={notifications} />

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
                                    <DropdownMenuItem
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => setOpen(true)}
                                    >
                                        Sign Out
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
import { ModeToggle } from "@/components/DarkMode/mode-toggle"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

function Header() {
    return (

        <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo on the left */}
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </Link>

                {/* Enhanced Menu Next to Logo */}
                <div className="hidden md:flex gap-6 items-center ml-6">
                    <Link to="/features" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>Features</Link>
                    <Link to="/pricing" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>Pricing</Link>
                    <Link to="/about" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>About Us</Link>
                    <Link to="/contact" className={cn("text-sm font-medium hover:text-primary transition-all duration-300")}>Contact</Link>
                </div>

                {/* Right Side Buttons */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/register">Sign up</Link>
                    </Button>
                    <ModeToggle />
                </div>
            </nav>
        </header>

    )
}

export default Header
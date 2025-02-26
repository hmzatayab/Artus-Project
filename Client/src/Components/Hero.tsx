import { Link } from "react-router-dom"
import "../index.css"
import { Button } from "./ui/button"
import { useTheme } from "@/components/DarkMode/theme-provider"

function Hero() {
    const { theme } = useTheme()
    return (
        <>
            <div className="relative h-screen w-full">
                {/* Background Grid (Behind Content) */}
                <div className={`${theme === "dark" ? "grid-background-dark" : "grid-background"} absolute inset-0 h-full w-full`} />

                {/* Foreground Content */}
                <section className="relative z-10 w-full pt-36 md:pt-48 pb-10">
                    <div className="space-y-2 sm:space-y-6 mx-auto">

                        <div className="flex items-center justify-center space-x-2 p-2 sm:p-4 rounded-lg text-xs sm:text-sm">
                            <span className="bg-blue-500 text-white font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                                New
                            </span>
                            <p className="text-xs sm:text-sm">
                                Image Auction Feature is Live!{" "}
                                <a href="#" className="text-blue-400 hover:underline">
                                    See what's new
                                </a>
                            </p>
                        </div>
                        <div className="space-y-3 sm:space-y-6 mx-auto">
                            <h1 className="text-[27px] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold gradient-title text-center">
                                Artus Exclusive Auctions,
                                <br />
                                Timeless Masterpieces Await
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl text-center">
                                Artus is your premier destination for exclusive art auctions. Discover rare masterpieces, place bids, and own extraordinary pieces. Join our elite community of collectors today!
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Link to={'/'}><Button className="px-8 shadow-lg cursor-pointer" size="lg" variant="outline">Watch Video</Button></Link>
                            <Link to={'/'}><Button className="px-8 shadow-lg cursor-pointer" size="lg">Book Now</Button></Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Hero
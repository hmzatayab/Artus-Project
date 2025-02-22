import { Link } from "react-router-dom"
import "../../index.css"
import { Button } from "../ui/button"
import { useTheme } from "@/components/DarkMode/theme-provider"

function Hero() {
    const { theme } = useTheme()
    return (
        <>
            <div className="h-screen">
                <div className={`${theme === "dark" ? "grid-background-dark" : "grid-background"}`}>
                    <section className="w-full pt-36 md:pt-48 pb-10">
                        <div className="space-y-6 mx-auto">
                            <div className="space-y-6 mx-auto">
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
                                <Link to={'/'}><Button className="px-8 shadow-xl cursor-pointer" size="lg" variant="outline">Watch Video</Button></Link>
                                <Link to={'/'}><Button className="px-8 shadow-xl cursor-pointer" size="lg">Book Now</Button></Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default Hero
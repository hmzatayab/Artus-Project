import Hero from "@/components/Home/Hero"
import '../../index.css'
// import { useTheme } from "@/components/DarkMode/theme-provider"


function Home() {
    // const { theme } = useTheme()
    return (
        <>
        {/* <div className={`${theme === "dark" ? "grid-background-dark" : "grid-background"}`}>
            </div> */}
            <Hero />
        </>
    )
}

export default Home

import FeaturedCategories from "@/components/homepage/FeaturedCategories";
import HeroBanner from "@/components/homepage/HeroBanner";
import StatsBar from "@/components/homepage/StatsBar";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className="flex-1">
                <HeroBanner />
                <StatsBar />
                <FeaturedCategories />
                <WhyChooseUs />
            </main>
            <Footer />
        </div>
    );
}

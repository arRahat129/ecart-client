import FeaturedCategories from "@/components/homepage/FeaturedCategories";
import HeroBanner from "@/components/homepage/HeroBanner";
import StatsBar from "@/components/homepage/StatsBar";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";

export default function Home() {
    return (
        <>
            <HeroBanner />
            <StatsBar />
            <FeaturedCategories />
            <WhyChooseUs />
        </>
    );
}

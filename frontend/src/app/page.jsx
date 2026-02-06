import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import CTACards from "@/components/sections/cta-cards";
import AppPromotion from "@/components/sections/app-promotion";
import Footer from "@/components/sections/footer";
import dynamic from 'next/dynamic';

const FeaturedServices = dynamic(() => import("@/components/sections/featured-services"), {
    loading: () => <div className="h-96" />
});
const Highlights = dynamic(() => import("@/components/sections/highlights"));
const HumansOfBroomees = dynamic(() => import("@/components/sections/humans-of-broomees"));
const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us"));
const FAQs = dynamic(() => import("@/components/sections/faqs"));
const CustomerTestimonial = dynamic(() => import("@/components/sections/customer-testimonial"));

export default function Home() {
    return (
        <main className="min-h-screen relative">
            <Header />
            <HeroSection />
            <FeaturedServices />
            <Highlights />
            <HumansOfBroomees />
            <WhyChooseUs />
            <CustomerTestimonial />
            <CTACards />
            <FAQs />
            <AppPromotion />
            <Footer />
        </main>
    );
}

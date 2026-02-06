import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import FeaturedServices from "@/components/sections/featured-services";
import Highlights from "@/components/sections/highlights";
import HumansOfBroomees from "@/components/sections/humans-of-broomees";
import WhyChooseUs from "@/components/sections/why-choose-us";
import FAQs from "@/components/sections/faqs";
import CTACards from "@/components/sections/cta-cards";
import CustomerTestimonial from "@/components/sections/customer-testimonial";
import AppPromotion from "@/components/sections/app-promotion";
import Footer from "@/components/sections/footer";

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

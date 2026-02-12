import Header from "@/components/sections/header";
import AboutHero from "@/components/sections/about-hero";
import CompanyCarousel from "@/components/sections/company-carousel";
import MissionSection from "@/components/sections/mission";
import AboutTeamGrid from "@/components/sections/about-team-grid";
import Footer from "@/components/sections/footer";
import ChatWidget from "@/components/sections/chat-widget";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-[80px] bg-transparent">
            <Header />
            <AboutHero />
            <CompanyCarousel />
            <MissionSection />
            <AboutTeamGrid />
            <Footer />
            <ChatWidget />
        </main>
    );
}

import Header from "@/components/sections/header";
import BookingWizard from "@/components/sections/booking-wizard";
import Footer from "@/components/sections/footer";
import ChatWidget from "@/components/sections/chat-widget";

export const metadata = {
    title: "Book a Service - Safely Hands",
    description: "Book a verified professional for your home needs.",
};

export default function BroomitPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-[100px] pb-12 relative min-h-[calc(100vh-80px)] bg-slate-50/50">
                <BookingWizard />
            </div>
            <Footer />
            <ChatWidget />
        </main>
    );
}

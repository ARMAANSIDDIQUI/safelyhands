import Header from "@/components/sections/header";
import ContactForm from "@/components/sections/contact-form";
import SupportChannels from "@/components/sections/support-channels";
import Footer from "@/components/sections/footer";
import ChatWidget from "@/components/sections/chat-widget";

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-[80px]">
            <Header />
            <div className="py-12">
                <h1 className="text-center text-4xl font-bold font-display text-slate-800 mb-4">Contact Us</h1>
                <p className="text-center text-slate-600 max-w-2xl mx-auto px-4">
                    We&apos;re here to help you with any queries or concerns. Fill out the form below or reach out to us directly.
                </p>
            </div>
            <ContactForm />
            <SupportChannels />
            <Footer />
            <ChatWidget />
        </main>
    );
}

import Header from "@/components/sections/header";
import ServiceDetail from "@/components/sections/service-detail";
import Footer from "@/components/sections/footer";
import ChatWidget from "@/components/sections/chat-widget";

async function getService(slug) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export const metadata = {
    title: "Online Maid Service - Safely Hands",
    description: "Book maid services online quickly and easily.",
};

export default async function OnlineMaidServicePage() {
    const slug = "online-maid-service";
    const initialData = await getService(slug);

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-[80px]">
                <ServiceDetail slug={slug} initialData={initialData} />
            </div>
            <Footer />
            <ChatWidget />
        </main>
    );
}

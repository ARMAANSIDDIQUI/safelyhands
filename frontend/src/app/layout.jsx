import "./globals.css";

import { Toaster } from "sonner";

export const metadata = {
    title: "Safely Hands - Trusted Home Makers in Moradabad",
    description: "Find trusted help in Moradabad. Hire a babysitter, chef, or maid service near you.",
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
    }
};

import { Providers } from "@/providers";
import GlobalBackground from "@/components/global-background";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <Providers>
                    <ScrollToTop />
                    <GlobalBackground />
                    {children}
                </Providers>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: 'rounded-full border-2 border-blue-100 shadow-xl !bg-white !text-slate-800',
                        style: {
                            borderRadius: '50px',
                            padding: '12px 24px',
                            boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.3)'
                        }
                    }}
                />
            </body>
        </html>
    );
}

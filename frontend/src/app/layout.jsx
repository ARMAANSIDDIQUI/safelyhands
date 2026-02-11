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
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <Providers>
                    <ReduxProvider>
                        <ScrollToTop />
                        <GlobalBackground />
                        {children}
                    </ReduxProvider>
                </Providers>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: 'rounded-[20px] border-2 border-blue-100 shadow-2xl !bg-white !text-slate-900 text-lg font-medium',
                        style: {
                            padding: '16px 32px',
                            minWidth: '350px',
                            fontSize: '18px',
                            boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.4)'
                        }
                    }}
                />
            </body>
        </html>
    );
}

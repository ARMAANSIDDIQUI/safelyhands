"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';

const AppPromotion = () => {
    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [isInstalled, setIsInstalled] = React.useState(false);

    React.useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isInstalled) return null; // Remove section if on PWA

    return (
        <section className="bg-primary pt-24 pb-0 overflow-hidden relative">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Content */}
                    <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 leading-tight">
                            Manage your home <br /> from your phone.
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto md:mx-0">
                            Download the Safely Hands app to book verified professionals, track attendance, and manage payments effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {deferredPrompt && (
                                <button
                                    onClick={handleInstallClick}
                                    className="transform hover:-translate-y-1 transition-transform duration-300"
                                >
                                    <div className="px-8 h-[54px] bg-white text-primary rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                                        <div className="font-bold text-lg flex items-center gap-2">
                                            <Download size={20} className="text-blue-600" />
                                            Install App
                                        </div>
                                    </div>
                                </button>
                            )}
                            {!deferredPrompt && (
                                <div className="text-white/80 italic">
                                    Open in Chrome/Edge to install app
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">4.8</div>
                                <div className="text-sky-200 text-sm">Rating</div>
                            </div>
                            <div className="w-px h-10 bg-sky-300/50"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">100K+</div>
                                <div className="text-sky-200 text-sm">Users</div>
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
                        <div className="relative w-[300px] md:w-[350px] aspect-[9/19] bg-black rounded-[50px] border-[8px] border-slate-900 shadow-2xl z-20 overflow-hidden transform lg:translate-y-20">
                            {/* Screen Content Mockup */}
                            <div className="bg-white w-full h-full relative">
                                <div className="absolute top-0 left-0 right-0 h-24 bg-primary rounded-b-3xl"></div>
                                <div className="absolute top-12 left-6 right-6">
                                    <div className="h-4 w-24 bg-white/30 rounded-full mb-4"></div>
                                    <div className="h-8 w-40 bg-white rounded-lg"></div>
                                </div>
                                <div className="absolute top-36 left-6 right-6 space-y-4">
                                    <div className="h-32 bg-slate-100 rounded-2xl shadow-sm"></div>
                                    <div className="h-32 bg-slate-100 rounded-2xl shadow-sm"></div>
                                    <div className="h-32 bg-slate-100 rounded-2xl shadow-sm"></div>
                                </div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50"></div>
                            </div>
                        </div>
                        {/* Decorative Element Behind Phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white opacity-10 rounded-full blur-[60px] animate-pulse"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AppPromotion;

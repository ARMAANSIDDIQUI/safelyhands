"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Check, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ChatWidget from '@/components/sections/chat-widget';

// Real service data from broomees.com
export default function ServicePage() {
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                // Fetch from backend API using slug endpoint
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/slug/${params.slug}`);

                if (res.ok) {
                    const data = await res.json();
                    setService(data);
                } else {
                    toast.error('Service not found');
                    router.push('/services');
                }
            } catch (error) {
                console.error('Error fetching service:', error);
                toast.error('Failed to load service details');
                router.push('/services');
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchService();
        }
    }, [params.slug, router]);

    const handleBookNow = () => {
        router.push(`/booking?service=${service.slug}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!service) {
        return null;
    }

    return (
        <main className="min-h-screen">
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 -z-10" />

                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div>
                                {service.badge && (
                                    <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
                                        {service.badge}
                                    </span>
                                )}

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                                    {service.title}
                                </h1>

                                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold text-slate-900">{service.rating}</span>
                                        <span className="text-slate-600">({service.reviewCount}+ reviews)</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                                >
                                    Book Now <ArrowRight size={20} />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={service.imageUrl || "/placeholder.jpg"}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white/40 backdrop-blur-sm">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
                            What's Included
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {service.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Book {service.title} today and experience professional, verified service at your doorstep.
                        </p>
                        <button
                            onClick={handleBookNow}
                            className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Book This Service
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
            <ChatWidget />
        </main>
    );
}

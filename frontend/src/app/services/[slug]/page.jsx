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
const fallbackServices = [
    {
        slug: "cooks",
        title: "Cooks & Chefs",
        description: "Professional cooks and chefs to prepare delicious, nutritious home-cooked meals for your family. Our verified cooks are experienced in multiple cuisines and maintain the highest standards of hygiene.",
        badge: "Trending",
        rating: 4.8,
        reviewCount: 350,
        basePrice: 10000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/130359605e8fb04bd76de91901a716bb-5.jpg",
        features: [
            "Expert in multiple cuisines (Indian, Continental, Chinese)",
            "Hygiene and food safety certified",
            "Custom meal planning based on dietary needs",
            "Dietary restrictions accommodated (vegan, gluten-free, etc.)",
            "Uses fresh ingredients",
            "Professional cooking equipment handling",
            "Menu planning assistance",
            "Grocery list preparation"
        ]
    },
    {
        slug: "domestic-help",
        title: "Domestic Help",
        description: "Reliable and trustworthy domestic help for all your household cleaning and maintenance needs. Our maids are trained professionals who ensure your home stays spotless.",
        rating: 4.3,
        reviewCount: 520,
        basePrice: 7000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/edec0091f4348c22a0b08c5a10cef4d5-7.jpg",
        features: [
            "Thorough sweeping and mopping",
            "Dusting of all surfaces",
            "Bathroom deep cleaning",
            "Kitchen maintenance and cleaning",
            "Laundry and ironing services",
            "Dishwashing",
            "Utensil cleaning",
            "Balcony and window cleaning"
        ]
    },
    {
        slug: "babysitter",
        title: "Babysitter",
        description: "Professional and caring babysitters to look after your little ones with love, attention, and safety. Our babysitters are trained in child care and first aid.",
        badge: "Most Popular",
        rating: 4.9,
        reviewCount: 420,
        basePrice: 8000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-3.jpg",
        features: [
            "Background verified and police verified",
            "Experienced with children of all ages",
            "First aid and CPR trained",
            "Flexible scheduling options",
            "Regular updates to parents",
            "Safe and engaging activities",
            "Homework assistance for older kids",
            "Meal preparation for children"
        ]
    },
    {
        slug: "all-rounder",
        title: "All Rounder",
        description: "Versatile all-rounder staff capable of handling multiple household roles including cooking, cleaning, and general household management. Perfect for comprehensive home care.",
        rating: 4.7,
        reviewCount: 280,
        basePrice: 12000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/allrounderImag_08_11_24-4.png",
        features: [
            "Cooking and meal preparation",
            "Complete house cleaning",
            "Laundry and ironing",
            "Grocery shopping assistance",
            "Basic household maintenance",
            "Flexible task management",
            "Time-efficient multi-tasking",
            "Adaptable to household needs"
        ]
    },
    {
        slug: "elderly-care",
        title: "24 Hrs - Elderly Care",
        description: "Compassionate and trained caregivers providing dedicated 24-hour support and companionship for senior citizens. Our elderly care professionals ensure comfort, safety, and dignity.",
        badge: "Premium",
        rating: 4.8,
        reviewCount: 195,
        basePrice: 15000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/BroomeesElederlyCare1-2.jpg",
        features: [
            "Trained in elderly care and patient handling",
            "Medication reminders and management",
            "Mobility and walking assistance",
            "Companionship and emotional support",
            "Meal preparation and feeding assistance",
            "Health monitoring and vital checks",
            "Personal hygiene assistance",
            "24/7 availability and care"
        ]
    },
    {
        slug: "24-hour-live-in",
        title: "24 Hrs - Live In",
        description: "Round-the-clock live-in help for comprehensive household support and care. Our live-in staff provides continuous assistance for all your household needs.",
        rating: 4.4,
        reviewCount: 165,
        basePrice: 14000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/545646546513878-6.jpeg",
        features: [
            "24/7 availability at home",
            "Dedicated live-in staff",
            "All household tasks covered",
            "Cooking and cleaning services",
            "Emergency support anytime",
            "Flexible work arrangements",
            "Accommodation provided by employer",
            "Complete household management"
        ]
    },
    {
        slug: "japa-services",
        title: "24 Hrs - Japa Services",
        description: "Specialized newborn care and postpartum support services. Our experienced Japa caregivers provide expert care for both mother and baby during the crucial postpartum period.",
        rating: 4.3,
        reviewCount: 145,
        basePrice: 16000,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-3.jpg",
        features: [
            "Newborn baby care expertise",
            "Postpartum mother care and support",
            "Breastfeeding guidance and assistance",
            "Baby bathing and massage",
            "Diaper changing and hygiene",
            "Sleep schedule management",
            "Light cooking for mother",
            "24/7 availability during postpartum period"
        ]
    },
    {
        slug: "quick-book",
        title: "Quick Assist (15 min)",
        description: "Express on-demand service for quick household tasks. Get help within 15 minutes for urgent cleaning, cooking, or assistance needs.",
        badge: "Fastest",
        rating: 4.9,
        reviewCount: 2100,
        basePrice: 500,
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/545646546513878-8.jpeg",
        features: [
            "Arrives in 15-30 minutes",
            "Perfect for urgent tasks",
            "Verified professionals",
            "Fixed hourly rate",
            "No long-term commitment",
            "Cleaning, cooking, or help"
        ]
    }
];

export default function ServicePage() {
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                // Fetch from backend API using slug endpoint
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/slug/${params.slug}`);

                if (res.ok) {
                    const data = await res.json();
                    setService(data);
                    setLoading(false);
                    return;
                }

                // If API fails, use fallback data
                console.log('API not available, using fallback service data');
                const foundService = fallbackServices.find(s => s.slug === params.slug);

                if (foundService) {
                    setService(foundService);
                } else {
                    toast.error('Service not found');
                    router.push('/services');
                }
            } catch (error) {
                console.log('Error fetching service, using fallback data:', error);

                // Use fallback data on error
                const foundService = fallbackServices.find(s => s.slug === params.slug);

                if (foundService) {
                    setService(foundService);
                } else {
                    toast.error('Service not found');
                    router.push('/services');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [params.slug, router]);

    const handleBookNow = () => {
        router.push(`/booking?service=${service.slug}&title=${encodeURIComponent(service.title)}`);
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

                                    <div className="text-3xl font-bold text-blue-600">
                                        ₹{service.basePrice.toLocaleString()}/mo
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
                                    src={service.imageUrl}
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

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const staticTestimonials = [
    {
        name: "Shashi's Story",
        role: "Dedicated Helper",
        content: "Meet Shashi, a dedicated helper who truly embodies the spirit of hard work. Despite experiencing a devastating loss, Shashi didn't let grief hold her back. She started working the next day, showing unwavering commitment. Her dedication is an inspiration to all of us at Safely Hands.",
        image: "https://placehold.co/600x800/e0f2fe/0ea5e9?text=Shashi"
    },
    {
        name: "Neelam's Journey",
        role: "Experienced Caregiver",
        content: "Neelam, 49, struggled to find work due to age bias. Determined to be independent, she came to Safely Hands. We valued her wisdom and placed her with a family that appreciates her years of experience and provides fair pay.",
        image: "https://placehold.co/600x800/f0f9ff/0284c7?text=Neelam"
    },
    {
        name: "Harilaal's Success",
        role: "Family Provider",
        content: "Harilaal works hard to support his family. Thrilled by Safely Hands' mission, he registered his family for a secure future. Within a month, we placed his daughter in a full-time role, bringing immense joy and stability to their lives.",
        image: "https://placehold.co/600x800/e0f2fe/38bdf8?text=Harilaal"
    }
];

const HumansOfBroomees = () => {
    const [testimonials, setTestimonials] = useState(staticTestimonials);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Filter workers who have a bio
                    const storyWorkers = data.filter(w => w.bio && w.bio.length > 10);
                    if (storyWorkers.length > 0) {
                        setTestimonials(storyWorkers.map(w => ({
                            name: w.name,
                            role: w.profession,
                            content: w.bio,
                            image: w.imageUrl || staticTestimonials[0].image
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch humans of broomees", error);
            }
        };
        fetchWorkers();
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [testimonials.length]); // Added dependency to reset interval if length changes

    return (
        <section className="bg-transparent py-24 overflow-hidden relative">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-4">
                        Humans of <span className="text-primary">Safely Hands</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Real stories of empowerment, resilience, and change.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="flex flex-col">

                        {/* Content Section */}
                        <div className="w-full p-8 md:p-12 flex flex-col justify-center relative min-h-[300px]">
                            <Quote size={48} className="text-sky-100 absolute top-8 right-8" />

                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{testimonials[activeIndex].name}</h3>
                                <p className="text-primary font-medium mb-6">{testimonials[activeIndex].role}</p>
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed italic">
                                    &quot;{testimonials[activeIndex].content}&quot;
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-4 mt-auto">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-600"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg shadow-sky-200"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                            <div className="flex justify-center gap-2 mt-6">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HumansOfBroomees;

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function TestimonialCarousel() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`);
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section className="py-16 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="text-left mb-12">
                    <h2 className="text-amber-400 text-2xl font-medium mb-2">Testimonials</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-400 mb-2">Don't Believe Us?</h3>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-800">Check What Our Customers Say About Us</h3>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {testimonials.map((item) => (
                            <CarouselItem key={item._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="p-8 h-full flex flex-col items-center text-center relative mt-12 backdrop-blur-sm bg-white/5 rounded-3xl">
                                    <div className="absolute -top-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mt-10">{item.name}</h4>
                                    <div className="flex text-amber-400 my-2">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <h5 className="font-semibold text-slate-700 mb-4">{item.designation}</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {item.message}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-8">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}

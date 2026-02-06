"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const staticServices = [
  {
    title: "24/7 Live-in Help",
    slug: "24-hour-house-help",
    rating: "4.8",
    reviews: "1.2k+",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-6.jpg",
    badge: "Popular"
  },
  {
    title: "Domestic Help",
    slug: "online-maid-service",
    rating: "4.7",
    reviews: "850+",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/130359605e8fb04bd76de91901a716bb-7.jpg",
  },
  {
    title: "On-Demand (15 min)",
    slug: "quick-book",
    rating: "4.9",
    reviews: "2k+",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/545646546513878-8.jpeg",
    badge: "Fastest"
  },
  {
    title: "Elderly Care",
    slug: "elderly-care",
    rating: "4.9",
    reviews: "500+",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/edec0091f4348c22a0b08c5a10cef4d5-9.jpg",
  },
  {
    title: "Expert Babysitters",
    slug: "japa-maid-service",
    rating: "4.9",
    reviews: "3.5k+",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/broomit656464-10.jpg",
    badge: "Trusted"
  },
];

const FeaturedServices = () => {
  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Map services from database with all fields
          setServices(data.slice(0, 5).map(s => ({
            title: s.title,
            rating: s.rating ? s.rating.toFixed(1) : "4.8",
            reviews: s.reviewCount ? `${s.reviewCount >= 1000 ? (s.reviewCount / 1000).toFixed(1) + 'k' : s.reviewCount}+` : "500+",
            image: s.imageUrl || staticServices[0].image,
            badge: s.badge || undefined
          })));
        }
      } catch (error) {
        console.warn("Using fallback services (Backend unreachable)");
        // Keep static services as fallback
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="bg-white section-padding relative">
      {/* Decorative Blue Strip */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50/50 -z-10 skew-y-1"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-blue-900 mb-4">
              Our Featured <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Safely Hands offers completely verified workers with a replacement policy. Choose from our range of trusted domestic help services.
            </p>
          </div>
          <Link
            href="/services"
            className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors group bg-blue-50 px-6 py-3 rounded-full"
          >
            View all services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={`/services/${service.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 group cursor-pointer border border-slate-100 hover:border-blue-200"
            >
              <div className="relative w-full h-[240px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {service.badge && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {service.badge}
                  </div>
                )}
                {/* Blue Overlay on Hover */}
                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold mb-1 leading-tight group-hover:text-blue-100 transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white font-semibold">
                      <Star size={12} fill="currentColor" className="text-yellow-400" /> {service.rating}
                    </span>
                    <span className="opacity-80">{service.reviews} reviews</span>
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            View all services <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
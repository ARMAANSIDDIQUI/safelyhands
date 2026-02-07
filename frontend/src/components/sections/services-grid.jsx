"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (!res.ok) {
          console.warn("Failed to fetch services");
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data.map(s => ({
            id: s._id,
            title: s.title,
            rating: "4.8", // Mock rating
            imageUrl: s.imageUrl || 'https://placehold.co/800x450/e0f2fe/0ea5e9?text=Service',
            link: `/services/${s.slug}` // Dynamic link
          })));
        }
      } catch (error) {
        console.warn("Failed to fetch services grid", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No services available. Please seed the database from Admin Maintenance.</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-[40px] md:py-[80px]">
      <div className="container mx-auto px-[15px] max-w-[1140px]">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-[30px] gap-y-[30px] justify-items-center">
          {services.map((service) => (
            <a
              key={service.id}
              href={service.link}
              className="group relative w-full max-w-[540px] overflow-hidden rounded-[20px] transition-transform duration-200 hover:scale-[1.02] shadow-[0_4px_15px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <div className="relative aspect-[16/9] w-full">
                {/* Service Image */}
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-[5px] flex items-center shadow-sm z-10">
                  <Star size={14} fill="#fbbf24" className="text-[#fbbf24] mr-1" />
                  <span className="text-[14px] font-bold text-[#212529]">
                    {service.rating}
                  </span>
                </div>

                {/* Book Now Button Overlay */}
                <div className="absolute top-[50%] left-0 transform -translate-y-1/2 z-10">
                  <div className="bg-[#212529] text-white px-4 py-2 font-bold text-[14px] uppercase tracking-wide rounded-r-[5px] shadow-lg">
                    Book Now !
                  </div>
                </div>

                {/* Service Name Banner */}
                <div className="absolute bottom-0 left-0 w-full z-10 px-4 pb-4">
                  <div className="inline-block bg-[#72bcd4] text-[#212529] px-6 py-2 rounded-lg font-bold text-[18px] shadow-md">
                    {service.title}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
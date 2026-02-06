"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const staticServices = [
  {
    id: 'elderly-care',
    title: '24 Hrs - Elderly Care',
    rating: '4.8',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/BroomeesElederlyCare1-2.jpg',
    link: '/services/elderly-care',
  },
  {
    id: 'babysitters',
    title: 'Babysitters',
    rating: '4.9',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-3.jpg',
    link: '/services/japa-maid-service',
  },
  {
    id: 'all-rounders',
    title: 'All-rounders',
    rating: '4.7',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/allrounderImag_08_11_24-4.png',
    link: '/services/all-rounders',
  },
  {
    id: 'japas',
    title: '24 Hrs - Japas',
    rating: '4.4',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-3.jpg',
    link: '/services/japa-maid-service',
  },
  {
    id: 'cooks',
    title: 'Cooks',
    rating: '4.8',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/130359605e8fb04bd76de91901a716bb-5.jpg',
    link: '/services/home-cooking-maid-service',
  },
  {
    id: 'full-time',
    title: '24 hrs - Full Time',
    rating: '4.4',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/545646546513878-6.jpeg',
    link: '/services/24-hour-house-help',
  },
  {
    id: 'domestic-help',
    title: 'Domestic help',
    rating: '4.3',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/edec0091f4348c22a0b08c5a10cef4d5-7.jpg',
    link: '/services/online-maid-service',
  },
  {
    id: 'on-demand',
    title: 'On-Demand',
    rating: '4.7',
    imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/broomit656464-8.jpg',
    link: '/services/broomit',
  },
];

const ServicesGrid = () => {
  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (!res.ok) {
          console.warn("Failed to fetch services, using static data");
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data.map(s => ({
            id: s._id,
            title: s.title,
            rating: "4.8", // Mock rating
            imageUrl: s.imageUrl || staticServices[0].imageUrl,
            link: `/services/${s.slug}` // Dynamic link
          })));
        }
      } catch (error) {
        console.warn("Failed to fetch services grid, using static data", error);
        // Keep using staticServices as fallback
      }
    };
    fetchServices();
  }, []);

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
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Mystar-2.svg"
                    alt="Star"
                    width={14}
                    height={14}
                    className="mr-1"
                  />
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
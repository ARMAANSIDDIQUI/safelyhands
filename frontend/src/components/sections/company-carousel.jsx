"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Fallback carousel images
const fallbackImages = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop"
];

const CompanyCarousel = () => {
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carousel`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const imageUrls = data.map(item => item.imageUrl);
            setImages(imageUrls);
          }
        }
      } catch (error) {
        // Silently use fallback images
        console.log("Using fallback carousel images");
      }
    };
    fetchCarousel();
  }, []);

  if (images.length === 0) return null;

  // Split images into two rows
  const midPoint = Math.ceil(images.length / 2);
  const row1Images = images.slice(0, midPoint);
  const row2Images = images.slice(midPoint);

  // Triplicating lists to ensure a seamless infinite scroll even on large monitors
  const tripleRow1 = [...row1Images, ...row1Images, ...row1Images];
  const tripleRow2 = [...row2Images, ...row2Images, ...row2Images];

  return (
    <section className="bg-transparent overflow-hidden py-12">
      <style jsx global>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }
        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
      `}</style>



      {/* Dual Row Slider Container */}
      <div className="relative w-full">
        {/* Row 1: Scrolling Right to Left */}
        <div className="flex w-fit animate-scroll-right">
          {tripleRow1.map((src, index) => (
            <div
              key={`row1-${index}`}
              className="relative flex-shrink-0 px-2 w-[280px] md:w-[350px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
                <Image
                  src={src}
                  alt={`Team photo ${index + 1}`}
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 280px, 350px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Padding between rows */}
        <div className="h-4 md:h-6" />

        {/* Row 2: Scrolling Left to Right */}
        <div className="flex w-fit animate-scroll-left">
          {tripleRow2.map((src, index) => (
            <div
              key={`row2-${index}`}
              className="relative flex-shrink-0 px-2 w-[280px] md:w-[350px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px]">
                <Image
                  src={src}
                  alt={`Office culture ${index + 1}`}
                  fill
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 280px, 350px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three-dot pagination indicator */}
      <div className="flex justify-center items-center gap-2 mt-12 pb-8">
        <div className="w-[10px] h-[10px] rounded-full bg-[#72bcd4] opacity-30"></div>
        <div className="w-[10px] h-[10px] rounded-full bg-[#72bcd4]"></div>
        <div className="w-[10px] h-[10px] rounded-full bg-[#72bcd4] opacity-30"></div>
      </div>


    </section>
  );
};

export default CompanyCarousel;
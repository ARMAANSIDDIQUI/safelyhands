"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock, Heart } from 'lucide-react';
import HeroRevolver from './hero-revolver';

const HeroSection = () => {
  return (
    <section className="relative pt-40 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-transparent">
      {/* Dynamic Background Elements - Handled by GlobalBackground */}

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Content */}
          <div className="flex-1 text-center lg:text-left z-10">

            <h1 id="hero-title" className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-slate-900 mb-6 leading-[1.05]">
              India&apos;s trusted care and <br />
              <span className="text-gradient">safe-living hands</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Experience the premium standard in household management. From professional chefs to compassionate elderly care, we provide the bharosemand hath your family deserves.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                id="book-now-btn"
                href="/services"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-primary text-white rounded-full font-bold text-lg hover:shadow-glow-blue hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sky-200"
              >
                Book Now <ArrowRight size={20} />
              </Link>

            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-blue-500" /> Verified Pros
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-500" /> Fast Booking
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-blue-500" /> Top Rated
              </div>
            </div>
          </div>

          {/* Visuals - Hero Revolver Implementation - Hidden on Mobile */}
          <div className="hidden lg:block flex-1 w-full relative h-[600px]">
            <HeroRevolver />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-zoom {
          animation: zoom 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

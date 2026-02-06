"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock, Heart } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-surface">
      {/* Dynamic Background Elements - More visible blue */}

      <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-[100px] -z-10 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[80px] -z-10 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-8 animate-fade-in-up shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              India's Trusted Home Makers
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Maid for House at <br />
              <span className="text-gradient">your Doorsteps</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Find trusted help in your city. Hire a babysitter for your child, hire a chef for delicious meals and reliable household services.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
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

          {/* Visuals - Enhanced Blue Styling */}
          <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative perspective-1000">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square group">
              {/* Main Image Container */}
              <div className="absolute inset-0 bg-gradient-brand rounded-[40px] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-transparent rounded-[40px] overflow-hidden shadow-2xl rotate-0 transition-transform duration-500 z-10 flex items-center justify-center">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-6.jpg"
                  alt="Happy family with domestic help"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>

              {/* Floating Cards - Blue Themed */}
              <div className="absolute -top-6 -right-6 md:right-[-20px] bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-float z-20 hover:animate-zoom border border-blue-50/80 transition-all duration-300">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Shield className="text-blue-600" size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">100% Safe</div>
                    <div className="text-xs text-slate-500">Background Verified</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-6 bg-white p-4 pr-8 rounded-2xl shadow-float z-20 hover:animate-float border border-blue-50 flex items-center gap-3 transition-all duration-300">
                <div className="bg-green-100 p-2 rounded-full">
                  <Star className="text-green-600 fill-green-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 leading-none">4.8/5</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Average Rating</div>
                </div>
              </div>

            </div>
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

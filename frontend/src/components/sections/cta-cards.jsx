import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus, FileText } from 'lucide-react';

const CTACards = () => {
  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Card 1: Join as Helper - Darker Deep Blue */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-900 to-slate-900 text-white p-10 md:p-14 group shadow-xl shadow-blue-900/20">
            {/* Abstract Background - Enhanced */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600 rounded-full blur-[80px] opacity-40 transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600 rounded-full blur-[60px] opacity-20 transform -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                <UserPlus size={32} className="text-blue-300" />
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display">Are you a Helper?</h3>
              <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed font-medium">
                Join Moradabad&apos;s most trusted platform. Get verified, get trained, and find the best employers earning up to ₹25,000/month.
              </p>

              <Link
                href="/register/helper"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50 transform hover:-translate-y-1"
              >
                Register Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Card 2: Book a Service - Bright Sky Blue */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 to-blue-50 text-slate-900 p-10 md:p-14 group border border-sky-100 shadow-xl shadow-sky-100">
            {/* Abstract Background - Enhanced */}
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-300 rounded-full blur-[100px] opacity-30 transform -translate-x-1/2 translate-y-1/2 group-hover:opacity-40 transition-opacity" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full blur-[60px] opacity-30 transform translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 border border-sky-100 shadow-md group-hover:scale-110 transition-transform">
                <FileText size={32} className="text-blue-600" />
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display text-slate-900">Need domestic help?</h3>
              <p className="text-slate-600 text-lg mb-10 max-w-md leading-relaxed font-medium">
                Looking for reliable, verified, and trained professionals? We have the perfect match for your household needs.
              </p>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book a Professional <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTACards;

import React from 'react';
import Image from 'next/image';
import { Clock, Users, Award, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const Highlights = () => {
  return (
    <section className="py-24 bg-transparent relative">
      <div className="container mx-auto px-6">

        {/* Intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-display">
            The Safely Hands <span className="text-blue-600">Advantage</span>
          </h2>
          <p className="mt-4 text-slate-600 text-lg">Why thousands of families trust us for their home needs.</p>
        </div>

        {/* Centered Card */}
        <div className="max-w-4xl mx-auto">
          {/* Card: Quality Guarantee */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 shadow-xl group cursor-pointer border-4 border-white shadow-blue-100 h-auto p-6 md:p-10">
            <div className="flex flex-col justify-center items-center text-center relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-yellow-400/20 shrink-0">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Trusted Service Guarantee</h3>
              <p className="text-blue-100 text-sm md:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                Every professional is background checked and trained to ensure the highest standards of safety and quality for your home.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Highlights;

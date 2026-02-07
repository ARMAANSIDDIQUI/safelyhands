import React from 'react';
import Image from 'next/image';
import { Clock, Users, Award, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const Highlights = () => {
  return (
    <section className="py-24 bg-slate-50">
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
          {/* Card: 15 Mins Promise */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 shadow-xl group cursor-pointer border-4 border-white shadow-blue-100 h-64">
            <div className="absolute inset-0 p-10 flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/20">
                <Clock size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Instant Help in 15 Mins</h3>
              <p className="text-blue-100 text-base md:text-lg max-w-2xl font-medium">No more waiting. Get reliable help at your doorstep faster than pizza delivery.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Highlights;

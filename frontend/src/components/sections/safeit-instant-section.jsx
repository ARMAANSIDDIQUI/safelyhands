"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, ShieldCheck, ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";

export default function SafeITInstantSection() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl md:rounded-[36px] p-6 sm:p-10 md:p-14 border border-blue-500/20 shadow-2xl shadow-blue-950/50 relative overflow-hidden">
                    
                    {/* Background Decorative Glow Effects */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        
                        {/* Left Side Info */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            
                            {/* Feature Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-sky-500/30 border border-sky-400/30 backdrop-blur-md text-sky-300 text-xs md:text-sm font-bold tracking-wide shadow-inner">
                                <Zap size={16} className="text-sky-400 fill-sky-400 animate-pulse" />
                                <span>NEW FEATURE • SAFEIT INSTANT DISPATCH</span>
                            </div>

                            {/* Section Title */}
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                                Need Household Help <br className="hidden sm:block" />
                                <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                                    In Just 15 Minutes?
                                </span>
                            </h2>

                            <p className="text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
                                Emergency cleaning before guests arrive? Need quick help with brooming, mopping, dish washing, or kitchen prep? Safely Hands dispatches a background-verified helper directly to your doorstep in <strong>~15 minutes</strong>.
                            </p>

                            {/* Feature Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 space-y-1">
                                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                                        <Clock size={18} />
                                        <span>15-Min Arrival</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">Rapid dispatch to your location</p>
                                </div>

                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 space-y-1">
                                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                                        <ShieldCheck size={18} />
                                        <span>100% Verified</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">Police & ID background checked</p>
                                </div>

                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 space-y-1">
                                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                                        <Sparkles size={18} />
                                        <span>Pay By Hour</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">Flexible 1h to 8h sessions</p>
                                </div>
                            </div>

                            {/* Included Quick Tasks Pills */}
                            <div className="pt-2">
                                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-3">Popular Instant Tasks</span>
                                <div className="flex flex-wrap gap-2">
                                    {["Brooming + Mopping", "Dusting", "Dish Washing", "Kitchen Help", "Serving Food"].map((task, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/40 border border-blue-400/20 text-blue-200 text-xs font-semibold">
                                            <CheckCircle2 size={12} className="text-sky-400" />
                                            {task}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <Link
                                    href="/safeit"
                                    id="home-safeit-cta-btn"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-full font-black text-base md:text-lg shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group"
                                >
                                    <Zap size={20} className="fill-current text-white group-hover:animate-bounce" />
                                    <span>Book Help in 15 Mins</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="text-slate-400 text-xs font-mono flex items-center justify-center gap-2">
                                    <MapPin size={14} className="text-sky-400" />
                                    <span>Active in Moradabad & NCR</span>
                                </div>
                            </div>

                        </div>

                        {/* Right Side Visual Cards Collage */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                
                                {/* Top Image Card */}
                                <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl h-[280px] sm:h-[320px] group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800"
                                        alt="SafeIt Instant Domestic Support"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-slate-950 font-black text-[10px] uppercase tracking-wider self-start mb-1">
                                            Instant ETA ~15m
                                        </div>
                                        <h3 className="text-white font-extrabold text-xl">Verified Helpers On Demand</h3>
                                        <p className="text-slate-300 text-xs mt-1">Professional brooming, mopping, and home support</p>
                                    </div>
                                </div>

                                {/* Floating Live Badge Overlay */}
                                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-slate-900/90 border border-sky-400/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[240px]">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-sky-400 shrink-0">
                                        <Zap size={22} className="fill-current animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-xs">SafeIt Live Queue</p>
                                        <p className="text-sky-300 text-[11px] font-semibold">Helpers ready in Moradabad</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

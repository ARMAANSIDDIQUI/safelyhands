"use client";

import React, { useState, useEffect } from "react";
import { Check, Calendar, MapPin, User, ChevronRight, ChevronLeft, Loader2, ChefHat, Sparkles, Baby, HeartPulse, Home, Car } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll handle standard class names

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function BookingWizard() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        serviceType: "",
        frequency: "",
        date: "",
        time: "",
        address: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const services = [
        {
            id: "cooking",
            icon: ChefHat,
            title: "Cook",
            desc: "Nutritious home-cooked meals"
        },
        {
            id: "cleaning",
            icon: Sparkles,
            title: "Housemaid",
            desc: "Sweeping, mopping, dusting"
        },
        {
            id: "babycare",
            icon: Baby,
            title: "Babysitter",
            desc: "Caring & safe supervision"
        },
        {
            id: "elderly",
            icon: HeartPulse,
            title: "Elderly Care",
            desc: "Compassionate assistance"
        },
        {
            id: "allrounder",
            icon: Home,
            title: "All Rounder",
            desc: "Cooking + Cleaning combined"
        },
        {
            id: "driver",
            icon: Car,
            title: "Driver",
            desc: "Safe & reliable driving"
        }
    ];

    // Fetch services from backend API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
                if (res.ok) {
                    const data = await res.json();
                    // Map backend services to wizard format with icons
                    const mappedServices = data.map(service => {
                        // Map service category to icon
                        let icon = Sparkles; // default
                        if (service.category === 'cooking') icon = ChefHat;
                        else if (service.category === 'cleaning') icon = Sparkles;
                        else if (service.category === 'childcare') icon = Baby;
                        else if (service.category === 'healthcare') icon = HeartPulse;
                        else if (service.category === 'live-in') icon = Home;
                        else if (service.category === 'multi-task') icon = Home;

                        return {
                            id: service.slug,
                            name: service.title,
                            icon: icon,
                            description: service.description.substring(0, 100) + '...'
                        };
                    });
                    setServices(mappedServices);
                }
            } catch (error) {
                console.log('Using fallback services in booking wizard');
                // Keep using static services as fallback
            }
        };

        fetchServices();
    }, []);

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleServiceSelect = (id) => {
        setFormData({ ...formData, serviceType: id });
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to complete your booking");
            router.push("/login");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Booking failed");

            toast.success("Booking Request Sent! We will contact you shortly.");
            // Reset or redirect
            setTimeout(() => {
                router.push("/broomit/success"); // Assuming checking success page or just home
            }, 1000);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            {/* Progress Bars */}
            <div className="mb-12">
                <div className="flex justify-between mb-2">
                    {["Service Selection", "Schedule & Details", "Review & Book"].map((label, idx) => (
                        <span
                            key={idx}
                            className={`text-sm font-semibold transition-colors duration-300 ${step > idx ? "text-blue-600" : step === idx + 1 ? "text-slate-900" : "text-slate-400"}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                </div>
            </div>

            <div className="glass-effect rounded-[32px] p-6 md:p-10 shadow-float border border-white/60 min-h-[500px] flex flex-col relative overflow-hidden">

                {/* Step 1: Service Selection */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">What help do you need?</h2>
                        <p className="text-slate-500 mb-8">Select a service to get started.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service.id)}
                                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${formData.serviceType === service.id
                                        ? "border-blue-500 bg-blue-50/50 shadow-md"
                                        : "border-slate-100 bg-white/50 hover:border-blue-200 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                                        <service.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">{service.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">When do you need us?</h2>
                        <p className="text-slate-500 mb-8">Tell us your preferred schedule.</p>

                        <div className="max-w-xl mx-auto space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        className="w-full bg-white/80 border border-slate-200 rounded-xl pl-12 pr-4 h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Type of Requirement</label>
                                <div className="flex gap-4">
                                    {["One-time", "Daily", "Live-in"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, frequency: type })}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${formData.frequency === type
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Location / Area</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Indiranagar, Bangalore"
                                        className="w-full bg-white/80 border border-slate-200 rounded-xl pl-12 pr-4 h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">Review Booking</h2>
                        <p className="text-slate-500 mb-8">We'll assign a top-rated professional for you.</p>

                        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 mb-8 max-w-xl mx-auto">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-slate-500 text-sm">Service</span>
                                    <span className="font-semibold text-slate-900 capitalize">{formData.serviceType || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-slate-500 text-sm">Frequency</span>
                                    <span className="font-semibold text-slate-900">{formData.frequency || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <span className="text-slate-500 text-sm">Date</span>
                                    <span className="font-semibold text-slate-900">{formData.date || "Not selected"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm">Location</span>
                                    <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{formData.address || "Not selected"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="text-center bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-sm">
                                <p className="text-sm text-blue-800">
                                    <span className="font-bold">Note:</span> A representative will call you to confirm details and pricing.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-auto pt-8 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={18} /> Back
                        </button>
                    ) : (
                        <div></div> // Spacer
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !formData.serviceType}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg hover:shadow-blue-200"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

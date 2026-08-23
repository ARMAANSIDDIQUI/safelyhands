"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import ChatWidget from "@/components/sections/chat-widget";
import { Check, Calendar, MapPin, ArrowLeft, Info, Zap, ChevronDown, CheckCircle2, Lock, UserCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ui/image-upload";

const AVAILABLE_TASKS = [
    "Brooming + Mopping",
    "Dusting",
    "Dish Washing",
    "Kitchen Help (No Cooking)",
    "Watering plants",
    "Packing help",
    "Serving Food",
    "Wardrobe Arrangement Help"
];

const HOUR_OPTIONS = [
    { label: "1 Hour", hours: 1, serviceFee: 200 },
    { label: "2 Hours", hours: 2, serviceFee: 350, bestseller: true },
    { label: "4 Hours", hours: 4, serviceFee: 650 },
    { label: "6 Hours", hours: 6, serviceFee: 950 },
    { label: "8 Hours", hours: 8, serviceFee: 1200 },
];

const PLATFORM_FEE = 20;
const GST_RATE = 0.18;

export default function SafeITPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Workflow state: 1 = Task & Region Selection, 2 = Booking Details & Payment
    const [step, setStep] = useState(1);
    const [bookingTab, setBookingTab] = useState("instant"); // "instant" (Book Now) or "schedule" (Schedule Booking)

    // Selection States
    const [selectedRegion, setSelectedRegion] = useState("Moradabad");
    const [cities, setCities] = useState(["Moradabad", "Delhi NCR", "Noida", "Gurgaon", "Ghaziabad", "Mumbai", "Bangalore"]);
    const [selectedTasks, setSelectedTasks] = useState(["Brooming + Mopping", "Dusting"]);
    const [selectedHours, setSelectedHours] = useState(2); // Default 2 Hours (Bestseller)

    // Form Details
    const [address, setAddress] = useState("");
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
    const [specialRequest, setSpecialRequest] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentProofUrl, setPaymentProofUrl] = useState("");
    const [preferences, setPreferences] = useState({
        petAtHome: false,
        avoidCalling: false,
        femaleWorkerPreferred: false
    });
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(null);

    // Fetch cities from backend API if available
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setCities(data.filter(c => c.isActive).map(c => c.name));
                    }
                }
            } catch (err) {
                console.log("Using default cities list");
            }
        };
        fetchCities();
    }, []);

    // Set phone number if user logged in
    useEffect(() => {
        if (user && user.phone) {
            setPhone(user.phone);
        }
    }, [user]);

    // Task Selection Toggle
    const toggleTask = (task) => {
        if (selectedTasks.includes(task)) {
            if (selectedTasks.length === 1) {
                toast.error("Please select at least one task requirement");
                return;
            }
            setSelectedTasks(selectedTasks.filter(t => t !== task));
        } else {
            setSelectedTasks([...selectedTasks, task]);
        }
    };

    // Pricing calculation
    const currentHourObj = HOUR_OPTIONS.find(h => h.hours === selectedHours) || HOUR_OPTIONS[1];
    const serviceFee = currentHourObj.serviceFee;
    
    const rawSubtotal = serviceFee + PLATFORM_FEE;
    const subtotalAfterDiscount = Math.max(0, rawSubtotal - appliedDiscount);
    const gstAmount = Number((subtotalAfterDiscount * GST_RATE).toFixed(2));
    const amountToBePaid = Number((subtotalAfterDiscount + gstAmount).toFixed(2));

    // Handle Coupon Code
    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a valid coupon code");
            return;
        }
        const code = couponCode.toUpperCase();
        if (code === "SAFEIT10" || code === "SAFELY10" || code === "BROOM10") {
            const discount = Math.round(serviceFee * 0.1);
            setAppliedDiscount(discount);
            toast.success(`Coupon applied! Saved ₹${discount}`);
        } else if (code === "FIRST50" || code === "OFF50") {
            setAppliedDiscount(50);
            toast.success("Coupon applied! Saved ₹50");
        } else {
            toast.error("Invalid coupon code");
        }
    };

    // Proceed to Step 2 with mandatory login enforcement
    const handleProceedToDetails = () => {
        if (!user) {
            toast.error("Please log in to proceed with your booking");
            router.push(`/login?redirect=/safeit`);
            return;
        }
        if (!selectedRegion) {
            toast.error("Please select your region");
            return;
        }
        if (selectedTasks.length === 0) {
            toast.error("Please select at least one task");
            return;
        }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Form Submission to Backend API
    const handleSubmitBooking = async () => {
        if (!user) {
            toast.error("Please log in to complete your booking");
            router.push(`/login?redirect=/safeit`);
            return;
        }

        if (!address.trim()) {
            toast.error("Please enter your complete address");
            return;
        }

        if (!phone.trim() || phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        if (!agreedTerms) {
            toast.error("Please agree to the duration & terms of booking");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            bookingType: bookingTab === 'instant' ? 'instant' : 'schedule',
            region: selectedRegion,
            address: address,
            phone: phone,
            tasks: selectedTasks,
            hours: selectedHours,
            bookingDate: bookingDate,
            specialRequest: specialRequest,
            preferences: preferences,
            pricingBreakdown: {
                serviceFee,
                platformFee: PLATFORM_FEE,
                discount: appliedDiscount,
                gst: gstAmount,
                amountToBePaid
            },
            paymentProofUrl
        };

        try {
            // Support both safeit and legacy broomit endpoint fallback
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safeit/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // Fallback to broomit endpoint if safeit endpoint not reachable
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broomit/bookings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit instant booking");

            setBookingSuccess(data.bookingNumber || data._id || `SFT15-${Math.floor(100000 + Math.random() * 900000)}`);
            toast.success("15-Min SafeIt Maid Request Dispatched!");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to place booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <Header />

            <div className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold mb-3 shadow-xs">
                            <Zap size={14} className="text-blue-600 fill-blue-500 animate-pulse" />
                            <span>SafeIt • Instant Help in 15 Minutes</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            Book Trusted Help in Minutes!
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium mt-1">
                            Fast, reliable, and trained household support at your doorstep with <span className="text-blue-600 font-bold">Safely Hands</span>.
                        </p>
                    </div>

                    {!user && (
                        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs md:text-sm text-blue-900 font-medium">
                            <Lock size={18} className="text-blue-600 shrink-0" />
                            <span>Login required to complete booking</span>
                            <button
                                onClick={() => router.push("/login?redirect=/safeit")}
                                className="ml-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xs shrink-0"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>

                {/* SUCCESS SCREEN */}
                {bookingSuccess ? (
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <CheckCircle2 size={44} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Help is on the way! ⚡</h2>
                        <p className="text-slate-500 mb-6">
                            Your <strong className="text-slate-800">SafeIt (15 Mins)</strong> request has been dispatched. Our team will assign the nearest verified worker immediately.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-8">
                            <p className="text-xs uppercase font-extrabold tracking-wider text-blue-800 mb-1">SafeIt Booking Reference</p>
                            <p className="text-2xl font-mono font-bold text-slate-900">#{bookingSuccess.toString().slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-blue-700 mt-2 font-medium">Estimated Worker ETA: ~15 Minutes</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push("/dashboard/safeit")}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md"
                            >
                                Track in SafeIt Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setBookingSuccess(null);
                                    setStep(1);
                                }}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md"
                            >
                                Book Another Service
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* PHASE 1: TASK & REGION SELECTION */}
                        {step === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Form Box */}
                                <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 relative">
                                    {/* Region Selector */}
                                    <div className="mb-6">
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                                                <MapPin size={20} />
                                            </div>
                                            <select
                                                value={selectedRegion}
                                                onChange={(e) => setSelectedRegion(e.target.value)}
                                                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-xs cursor-pointer"
                                            >
                                                <option value="" disabled>Select Your Region</option>
                                                {cities.map((city, idx) => (
                                                    <option key={idx} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tasks Checklist */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-slate-900 text-base md:text-lg">What can we do for you?</h3>
                                            <button
                                                title="Choose the specific tasks required during your booking session"
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <Info size={18} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4 font-medium">
                                            Please select the options that best describe your requirements.
                                        </p>

                                        {/* Task Pills - Blue Theme Matched */}
                                        <div className="flex flex-wrap gap-2.5">
                                            {AVAILABLE_TASKS.map((task, idx) => {
                                                const isSelected = selectedTasks.includes(task);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleTask(task)}
                                                        className={cn(
                                                            "px-3.5 py-2.5 rounded-xl border text-xs md:text-sm font-semibold transition-all flex items-center gap-2",
                                                            isSelected
                                                                ? "bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-xs ring-1 ring-blue-500/20"
                                                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "w-4 h-4 rounded border flex items-center justify-center text-xs transition-colors",
                                                            isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                                                        )}>
                                                            {isSelected && <Check size={12} strokeWidth={3} />}
                                                        </span>
                                                        <span>{task}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Footer area inside Left Box */}
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                        <div className="text-xs font-mono font-bold text-blue-700 flex items-center gap-1.5">
                                            <Zap size={14} className="text-blue-600 fill-sky-400 animate-pulse" />
                                            <span>~ETA: 15 minutes</span>
                                        </div>

                                        <button
                                            onClick={handleProceedToDetails}
                                            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-full font-bold text-sm md:text-base shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                                        >
                                            {!user && <Lock size={16} />}
                                            <span>Proceed</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side Visual Gallery Showcase - Blue Palette Matched */}
                                <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-1.5 rounded-3xl shadow-xl">
                                    <div className="bg-slate-900 rounded-[22px] overflow-hidden grid grid-cols-2 gap-1.5 p-1.5 min-h-[380px]">
                                        <div className="relative rounded-xl overflow-hidden group min-h-[180px]">
                                            <Image
                                                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600"
                                                alt="Dusting & Cleaning"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                                                <span className="text-white font-extrabold text-lg tracking-wider drop-shadow-md">DUSTING</span>
                                            </div>
                                        </div>

                                        <div className="relative rounded-xl overflow-hidden group min-h-[180px]">
                                            <Image
                                                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600"
                                                alt="Kitchen & Dish Washing"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                                                <span className="text-white font-extrabold text-lg tracking-wider drop-shadow-md">SERVING</span>
                                            </div>
                                        </div>

                                        <div className="relative rounded-xl overflow-hidden group min-h-[180px] col-span-2">
                                            <Image
                                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                                                alt="Brooming & Mopping"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                                                <span className="text-sky-400 text-xs font-mono uppercase font-bold tracking-widest">Instant 15-Min Arrival</span>
                                                <span className="text-white font-extrabold text-xl tracking-wider drop-shadow-md">BROOMING + MOPPING</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PHASE 2: BOOKING FORM & EXACT PRICING BREAKDOWN */}
                        {step === 2 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto">
                                {/* Header / Back Button Bar */}
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors"
                                    >
                                        <ArrowLeft size={18} />
                                        <span>Back to Task Selection</span>
                                    </button>

                                    <div className="text-xs text-slate-400 font-medium">
                                        Region: <strong className="text-slate-800 font-bold">{selectedRegion}</strong>
                                    </div>
                                </div>

                                {/* Booking Tab Switcher Header - Blue Theme */}
                                <div className="grid grid-cols-2 bg-slate-100 p-1">
                                    <button
                                        onClick={() => setBookingTab("instant")}
                                        className={cn(
                                            "py-3.5 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all rounded-xl",
                                            bookingTab === "instant"
                                                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        <Zap size={18} className="fill-current" />
                                        <span>Book Now</span>
                                    </button>

                                    <button
                                        onClick={() => setBookingTab("schedule")}
                                        className={cn(
                                            "py-3.5 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all rounded-xl",
                                            bookingTab === "schedule"
                                                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        <Calendar size={18} />
                                        <span>Schedule Booking</span>
                                    </button>
                                </div>

                                {/* Form Body */}
                                <div className="p-6 md:p-8 space-y-6">

                                    {/* Address Field */}
                                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 bg-white hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <MapPin size={22} className="text-blue-600 flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Enter your complete address..."
                                                className="w-full text-sm md:text-base font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!address) setAddress("House #12, Block B, Main Street");
                                            }}
                                            className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 flex-shrink-0"
                                        >
                                            + Add Address
                                        </button>
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Phone Number</label>
                                        <div className="flex h-12">
                                            <span className="inline-flex items-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm text-slate-500 font-bold">
                                                +91
                                            </span>
                                            <input
                                                type="text"
                                                maxLength={10}
                                                value={phone}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setPhone(digits);
                                                }}
                                                placeholder="10-digit mobile number"
                                                className="w-full px-4 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    {/* No. of Hours Selector - Blue Theme Matched */}
                                    <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                                        <label className="block font-extrabold text-slate-900 text-base md:text-lg mb-1">
                                            No. of Hours
                                        </label>
                                        <p className="text-xs text-slate-400 mb-4 font-medium">
                                            Please select the no. of hours for which you require the worker.
                                        </p>

                                        {/* Hours Selector Pills */}
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-2">
                                            {HOUR_OPTIONS.map((opt) => {
                                                const isSelected = selectedHours === opt.hours;
                                                return (
                                                    <div key={opt.hours} className="relative">
                                                        {opt.bestseller && (
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs z-10 whitespace-nowrap">
                                                                Bestseller
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => setSelectedHours(opt.hours)}
                                                            className={cn(
                                                                "w-full py-3 px-2 rounded-xl text-xs md:text-sm font-bold border transition-all text-center",
                                                                isSelected
                                                                    ? "bg-gradient-to-r from-blue-600 to-sky-500 border-blue-600 text-white shadow-xs"
                                                                    : "bg-blue-50/40 border-slate-200 text-slate-700 hover:bg-blue-50"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Booking Date */}
                                    <div className="border border-slate-200 rounded-2xl p-4 flex items-center gap-3 bg-white">
                                        <Calendar size={20} className="text-slate-400 flex-shrink-0" />
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full text-sm md:text-base font-semibold text-slate-800 focus:outline-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Special Request */}
                                    <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                                        <input
                                            type="text"
                                            value={specialRequest}
                                            onChange={(e) => setSpecialRequest(e.target.value)}
                                            placeholder="Any Special Request (e.g. Bring extra cleaning cloth)"
                                            className="w-full text-sm md:text-base font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Preferences Options Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPreferences(p => ({ ...p, petAtHome: !p.petAtHome }))}
                                            className={cn(
                                                "p-3.5 rounded-2xl border flex items-center justify-between text-xs md:text-sm font-bold transition-all",
                                                preferences.petAtHome ? "border-blue-500 bg-blue-50 text-blue-950" : "border-slate-200 bg-white text-slate-700"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>🐾</span>
                                                <span>Pet at Home</span>
                                            </span>
                                            <span className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                preferences.petAtHome ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                                            )}>
                                                {preferences.petAtHome && <Check size={12} strokeWidth={3} />}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPreferences(p => ({ ...p, avoidCalling: !p.avoidCalling }))}
                                            className={cn(
                                                "p-3.5 rounded-2xl border flex items-center justify-between text-xs md:text-sm font-bold transition-all",
                                                preferences.avoidCalling ? "border-blue-500 bg-blue-50 text-blue-950" : "border-slate-200 bg-white text-slate-700"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>🔕</span>
                                                <span>Avoid Calling</span>
                                            </span>
                                            <span className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                preferences.avoidCalling ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                                            )}>
                                                {preferences.avoidCalling && <Check size={12} strokeWidth={3} />}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPreferences(p => ({ ...p, femaleWorkerPreferred: !p.femaleWorkerPreferred }))}
                                            className={cn(
                                                "p-3.5 rounded-2xl border flex items-center justify-between text-xs md:text-sm font-bold transition-all",
                                                preferences.femaleWorkerPreferred ? "border-blue-500 bg-blue-50 text-blue-950" : "border-slate-200 bg-white text-slate-700"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>👩</span>
                                                <span>Female Worker Preferred</span>
                                            </span>
                                            <span className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                preferences.femaleWorkerPreferred ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                                            )}>
                                                {preferences.femaleWorkerPreferred && <Check size={12} strokeWidth={3} />}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Note Box */}
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 space-y-2 leading-relaxed">
                                        <p className="font-bold text-slate-800 text-sm mb-1">Note</p>
                                        <p>(a) You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality. The worker will only complete tasks possible in the booked time slot.</p>
                                        <p>(b) Both male and female helpers are available in our fleet. While we can take preferences for a specific gender for your work, we can not assure the same. We do guarantee that the helper assigned will complete the selected tasks efficiently, irrespective of the gender.</p>
                                        <p>(c) You may extend your service subject to availability of workers. For extensions, please contact your RM directly. The standard rate for extension is (₹212 per hour + GST)</p>
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="border border-slate-200 rounded-2xl p-4 bg-white flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms-check"
                                            checked={agreedTerms}
                                            onChange={(e) => setAgreedTerms(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="terms-check" className="text-xs text-slate-600 leading-normal cursor-pointer">
                                            I agree to adhere to the duration of my booking. I also agree to treat the staff with respect and report any issues directly to customer support. <span className="text-blue-600 font-bold underline">Terms & Conditions</span>
                                        </label>
                                    </div>

                                    {/* Coupon Code Input */}
                                    <div className="border border-slate-200 rounded-2xl p-2 bg-white flex items-center justify-between gap-3">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="COUPON CODE"
                                            className="w-full pl-3 text-xs md:text-sm font-bold uppercase text-slate-800 focus:outline-none placeholder:text-slate-300"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs md:text-sm rounded-xl transition-all flex-shrink-0 shadow-xs"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Payment Details Section */}
                                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                        <h3 className="text-base font-bold text-slate-800 mb-4">Payment Details</h3>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-600 mb-3">Please scan the QR code to make the payment. Bank details are also provided below.</p>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-4 flex justify-center">
                                                    <img src="/images/qr.jpeg" alt="Payment QR Code" className="rounded-lg object-contain w-[180px] h-[180px]" />
                                                </div>
                                                <div className="space-y-1 text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-slate-700">
                                                    <p><span className="font-semibold">Bank:</span> State Bank of India</p>
                                                    <p><span className="font-semibold">A/c Holder:</span> Nikhil Bansal</p>
                                                    <p><span className="font-semibold">A/c No:</span> 37830110244</p>
                                                    <p><span className="font-semibold">IFSC:</span> SBIN0050690</p>
                                                    <p><span className="font-semibold">Branch:</span> Lajpat Nagar Moradabad</p>
                                                    <div className="border-t my-2 pt-2">
                                                        <p><span className="font-semibold text-slate-900">UPI ID:</span> 6399980449@ybl</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-start">
                                                <label className="block text-xs font-bold text-slate-700 mb-2">Upload Payment Proof (Optional)</label>
                                                <ImageUpload
                                                    value={paymentProofUrl}
                                                    onChange={(url) => setPaymentProofUrl(url)}
                                                />
                                                <p className="text-[11px] text-slate-400 mt-2 text-center">Supported formats: Images/Videos</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Breakdown Card */}
                                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3 font-medium text-slate-600 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span>Service Fee</span>
                                            <span className="font-semibold text-slate-800">₹{serviceFee}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span>Platform Fee</span>
                                            <span className="font-semibold text-slate-800">₹{PLATFORM_FEE}</span>
                                        </div>

                                        {appliedDiscount > 0 && (
                                            <div className="flex items-center justify-between text-green-600 font-bold">
                                                <span>Discount</span>
                                                <span>-₹{appliedDiscount}</span>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-slate-500 text-xs font-semibold">
                                            <span>GST (18%)</span>
                                            <span>₹{gstAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="border-t border-slate-300 pt-3 flex items-center justify-between text-slate-900 font-extrabold text-base md:text-lg">
                                            <span>Amount to be Paid</span>
                                            <span className="text-xl md:text-2xl font-black text-blue-950">₹{amountToBePaid.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmitBooking}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold text-base md:text-lg rounded-2xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? "Processing Booking..." : `Confirm & Request Help (₹${amountToBePaid.toFixed(2)}) ⚡`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
            <ChatWidget />
        </main>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Check, Calendar, MapPin, User, ChevronRight, ChevronLeft, Loader2, Star, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DynamicServiceModal from "./DynamicServiceModal";

export default function BookingWizard() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [gender, setGender] = useState("Female");
    const [activeShift, setActiveShift] = useState("24 Hrs Live In");
    const [selectedService, setSelectedService] = useState(null);
    const [babyDOB, setBabyDOB] = useState("2025-12-01");
    const [showDOBPicker, setShowDOBPicker] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: "",
        genderPreference: "Female",
        shift: "24 Hrs Live In",
        frequency: "Live-in",
        date: "",
        time: "",
        address: "",
        notes: "",
        babyDOB: "2025-12-01",
        religiousPreference: false,
        babysitterHours: "6 hours",
        noOfKids: "Single",
        hasPets: "No",
        shiftStartTime: "",
        cookingWork: "Not required",
        foodType: "Not required",
        laundry: "Not required",
        houseSize: "2 BHK",
        noOfFloors: "1 floor only",
        bathroomCleaning: "1-2 bathrooms",
        noOfPeople: "2 people",
        servantQuarter: "No",
        babyAge: "0-2 months",
        mealsPerDay: "Breakfast & Lunch",
        vegNonVeg: "Veg food only",
        dustingDuration: "1 hour"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showDynamicModal, setShowDynamicModal] = useState(false);

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [regionInput, setRegionInput] = useState("");

    // Fetch services and cities
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [servicesRes, citiesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`)
                ]);

                if (servicesRes.ok) {
                    const data = await servicesRes.json();
                    setServices(data);

                    // Auto-select service from URL ONLY if it's a specific sub-service
                    const serviceSlug = searchParams.get('service');
                    if (serviceSlug) {
                        const preSelected = data.find(s => s.slug === serviceSlug);
                        if (preSelected) {
                            // Update active shift if needed
                            if (preSelected.slug === 'elderly-care') setActiveShift("Elderly Care");
                            else if (preSelected.slug === 'babysitter') setActiveShift("Babysitter");
                            else if (preSelected.shift) setActiveShift(preSelected.shift);

                            // Only set the shift context, NEVER auto-open modal
                            // User must select city first (Step 1), then click a service card (Step 2)
                        }
                    }
                }

                if (citiesRes.ok) {
                    const citiesData = await citiesRes.json();
                    setCities(citiesData.filter(c => c.isActive));
                }

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const handleNext = () => {
        if (step === 1 && !selectedCity) {
            toast.error("Please select your city");
            return;
        }
        if (step === 1 && selectedCity === 'near-moradabad' && !regionInput) {
            toast.error("Please specify your region");
            return;
        }
        if (step === 2 && !selectedService) {
            toast.error("Please select a service");
            return;
        }
        setStep((prev) => Math.min(prev + 1, 4));
    };

    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleServiceSelect = (service) => {
        setSelectedService(service);

        // If service has dynamic questions, show dynamic modal
        if (service.questions && service.questions.length > 0) {
            setShowDynamicModal(true);
        } else {
            // Fallback for services without dynamic questions
            setFormData({
                ...formData,
                serviceType: service.title,
                shift: service.shift || activeShift,
                genderPreference: gender
            });
        }
    };

    const handleDynamicConfirm = (answers, price) => {
        setFormData({
            ...formData,
            ...answers,
            serviceType: selectedService.title,
            shift: selectedService.shift || activeShift,
            genderPreference: gender,
            estimatedPrice: price
        });
        setShowDynamicModal(false);
        handleNext();
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to complete your booking");
            router.push("/login?redirect=/booking");
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
            setTimeout(() => {
                router.push("/dashboard/bookings");
            }, 1000);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter services based on shift only (gender is a preference, not a filter)
    const filteredServices = services.filter(s => s.shift === activeShift);

    // For 24 Hrs Live In, exclude all-rounder
    const liveInServices = activeShift === '24 Hrs Live In'
        ? filteredServices.filter(s => s.slug !== '24hr-allrounder')
        : filteredServices;

    // Dynamic shift tabs from services data (filter out null/undefined shifts)
    const shiftTabs = [...new Set(services.map(s => s.shift).filter(Boolean))].filter(s => s !== 'Day Shift');

    // Determine which services to display for current shift
    const displayServices = activeShift === '24 Hrs Live In' ? liveInServices : filteredServices;
    const selMode = displayServices[0]?.selectionMode || 'single';
    const countText = selMode === 'multiple'
        ? `Select one or more from ${displayServices.length} services`
        : `Select only 1 out of ${displayServices.length} services`;

    const renderServiceCard = (service) => (
        <div
            key={service._id}
            onClick={() => handleServiceSelect(service)}
            className={cn(
                "group relative bg-white rounded-2xl p-4 shadow-md border-2 transition-all cursor-pointer flex gap-4",
                selectedService?._id === service._id
                    ? "border-orange-400 bg-orange-50/10"
                    : "border-transparent hover:border-slate-200"
            )}
        >
            {/* Left: Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                <Image
                    src={service.imageUrl || "https://placehold.co/400x400?text=Service"}
                    alt={service.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Middle: Content */}
            <div className="flex-1 pr-8">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                    <div className="flex items-center gap-1 text-orange-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold text-sm">{service.rating?.toFixed(1) || "4.8"}</span>
                    </div>
                </div>
                <div className="text-orange-500 font-bold text-sm mb-2">
                    ₹{service.basePrice}/month <span className="text-[10px] text-slate-400 font-medium">starting.</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mb-2">
                    {service.description}
                </p>
                <div className="text-[10px] text-slate-400 font-medium italic">
                    +All services inclusive
                </div>
            </div>

            {/* Right: + Button */}
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    selectedService?._id === service._id
                        ? "bg-orange-500 text-white scale-110 shadow-lg"
                        : "bg-orange-400 text-white hover:bg-orange-500"
                )}>
                    {selectedService?._id === service._id ? (
                        <Check size={20} />
                    ) : (
                        <Plus size={20} />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 max-w-5xl">
            {/* Main Container */}
            <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden min-h-[600px] flex flex-col border border-slate-100">

                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-800" />
                        </button>
                        <h1 className="text-2xl font-display font-bold text-slate-800">{step === 1 ? 'Select City' : step === 2 ? 'Select a Service' : step === 3 ? 'Shift & Date' : 'Summary'}</h1>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 p-6 md:p-10">

                    {/* ========== STEP 1: CITY ========== */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-lg mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">Where are you located?</h2>
                                <p className="text-slate-500">Select your city to see available services</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <label className="block text-sm font-bold text-slate-700 mb-3">
                                    Select your City
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        id="city-select"
                                        value={selectedCity}
                                        onChange={(e) => {
                                            setSelectedCity(e.target.value);
                                            setFormData(prev => ({ ...prev, city: e.target.value }));
                                        }}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    >
                                        <option value="">Choose a city...</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city.slug}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamic Region Input for 'Other' Cities */}
                                {cities.find(c => c.slug === selectedCity)?.isOther && (
                                    <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            Specify Region
                                        </label>
                                        <input
                                            id="region-input"
                                            type="text"
                                            value={regionInput}
                                            onChange={(e) => {
                                                setRegionInput(e.target.value);
                                                setFormData(prev => ({ ...prev, region: e.target.value }));
                                            }}
                                            placeholder="e.g. Joya, Gajraula..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 2: SERVICE SELECTION ========== */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Gender Selection */}
                            <div className="flex items-center gap-6 mb-6">
                                <span className="font-bold text-slate-700">Gender</span>
                                <div className="flex gap-4">
                                    {["Male", "Female"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setGender(g)}
                                            className={cn(
                                                "px-8 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                gender === g
                                                    ? "border-slate-800 bg-white text-slate-900 shadow-sm"
                                                    : "border-slate-100 bg-white text-slate-400"
                                            )}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Shift/Category Tabs */}
                            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                                {shiftTabs.map((shift) => (
                                    <button
                                        key={shift}
                                        onClick={() => { setActiveShift(shift); setSelectedService(null); }}
                                        className={cn(
                                            "px-5 py-2.5 rounded-xl border-2 font-bold text-sm whitespace-nowrap transition-all",
                                            activeShift === shift
                                                ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        {shift}
                                    </button>
                                ))}
                            </div>

                            {/* Babysitter-specific: DOB picker */}
                            {activeShift === "Babysitter" && (
                                <div className="flex items-center gap-3 relative mb-8">
                                    <span className="text-slate-800 font-bold">Baby&apos;s date of birth</span>
                                    <span className="text-slate-800 font-medium bg-slate-100 px-3 py-1 rounded-lg">
                                        {new Date(babyDOB).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <button
                                        onClick={() => setShowDOBPicker(!showDOBPicker)}
                                        className="text-orange-500 font-bold text-sm hover:underline"
                                    >
                                        Change
                                    </button>
                                    {showDOBPicker && (
                                        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none"
                                                value={babyDOB}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    const today = new Date();
                                                    const diffTime = Math.abs(today - selectedDate);
                                                    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
                                                    if (diffMonths < 2) {
                                                        toast.error("Babysitters are available for babies older than 2 months. For newborns, please select our Japa Care service.", {
                                                            duration: 5000,
                                                            action: { label: "View Japa", onClick: () => setActiveShift("24 Hrs Live In Japa") }
                                                        });
                                                        return;
                                                    }
                                                    setBabyDOB(e.target.value);
                                                    setFormData(prev => ({ ...prev, babyDOB: e.target.value }));
                                                    setShowDOBPicker(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Universal Shift Header + Service Grid */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">{activeShift}</h2>
                                    <div className="text-sm text-orange-500 font-bold">{countText}</div>
                                </div>

                                {activeShift === "Domestic Help" ? (
                                    <div className="space-y-10">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-1">Cleaning</h3>
                                            <p className="text-orange-500 text-sm font-bold mb-6">Brooming, Mopping service is mandatory</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {displayServices.filter(s => s.category === 'Cleaning').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6">Add-ons</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {displayServices.filter(s => s.category === 'Add-ons').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {displayServices.map((service) => renderServiceCard(service))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 3: SHIFT & DATE ========== */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">Work Shifts & Date</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Left Column: Date & Notes */}
                                <div className="space-y-6">
                                    <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-slate-800">Start Date</h3>
                                                <p className="text-xs text-slate-400">Please select the date of starting the service</p>
                                            </div>
                                            <div className="relative">
                                                <div className="bg-orange-50/50 border-2 border-orange-100 rounded-xl px-4 py-2 font-bold text-slate-700 flex items-center gap-2 cursor-pointer relative">
                                                    <Calendar size={20} />
                                                    <input
                                                        type="date"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                        value={formData.date}
                                                    />
                                                    <span>{formData.date || "Date"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Notes</h3>
                                        <p className="text-xs text-slate-400 mb-4">Additional notes (if any)</p>
                                        <textarea
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 h-32 focus:outline-none focus:border-orange-200 resize-none font-medium"
                                            placeholder="Notes.."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Work Shifts */}
                                <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-6">Work Shifts</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-500 block mb-2">Daily Working Hours - {formData.babysitterHours ? formData.babysitterHours.split(' ')[0] + ':00' : "6:00"}</label>
                                            <div className="relative">
                                                <select
                                                    className={cn(
                                                        "w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 h-12 appearance-none font-bold focus:outline-none focus:border-orange-200 transition-all",
                                                        !formData.shiftStartTime && "text-red-500"
                                                    )}
                                                    value={formData.shiftStartTime}
                                                    onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                                                >
                                                    <option value="" disabled>Select shift start time</option>
                                                    {["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"].map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight size={20} className="rotate-90 text-red-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preference Toggle */}
                            <div className="bg-white border-2 border-slate-100 rounded-[20px] p-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, religiousPreference: !prev.religiousPreference }))}
                                        className={cn(
                                            "w-14 h-8 rounded-full transition-all relative flex-shrink-0",
                                            formData.religiousPreference ? "bg-orange-500" : "bg-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all",
                                            formData.religiousPreference ? "left-7" : "left-1"
                                        )} />
                                    </button>
                                    <p className="text-sm text-slate-400">If you HAVE a religious preference, the salary of the worker would be slightly more than the shown salary</p>
                                </div>
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="flex gap-4 p-2 items-start">
                                <div
                                    onClick={() => setFormData(prev => ({ ...prev, agree: !prev.agree }))}
                                    className={cn(
                                        "w-6 h-6 rounded flex-shrink-0 border-2 cursor-pointer flex items-center justify-center transition-all mt-1",
                                        formData.agree ? "bg-orange-500 border-orange-500" : "border-slate-300"
                                    )}
                                >
                                    {formData.agree && <Check size={14} className="text-white" />}
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                    *I agree to pay (i) [Monthly salary of the worker] & (ii) [Broomees subscription charges] through Broomees&apos; online platform(s) only. The salary will be as shown here (approx.) and this includes 3 paid leaves per month which can be encashed if not taken by the worker. {selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('baby') ? "I am also aware that the babysitter will be responsible for ONLY ONE kid (unless booking is for twins) and will not do domestic chores other than the ones selected above." : "I also agree to give my worker 30-45 minutes of rest time if needed, for their health and safety. I agree to provide food and water to them during their stay at my home."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 4: SUMMARY ========== */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Summary</h2>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-white pb-3">
                                        <span className="text-slate-500 font-medium">Selected Service</span>
                                        <span className="font-bold text-slate-900">{formData.serviceType}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white pb-3">
                                        <span className="text-slate-500 font-medium">Shift Type</span>
                                        <span className="font-bold text-slate-900">{formData.shift}</span>
                                    </div>
                                    {selectedService?.slug?.includes('elderly') && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Elderly&apos;s Age</span>
                                                <span className="font-bold text-slate-900">{formData.elderlyAge}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Diaper Required</span>
                                                <span className="font-bold text-slate-900">{formData.diaperRequired}</span>
                                            </div>
                                        </>
                                    )}
                                    {(selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('baby')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Daily Hours</span>
                                                <span className="font-bold text-slate-900">{formData.babysitterHours}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">No of Kids</span>
                                                <span className="font-bold text-slate-900">{formData.noOfKids}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between items-center border-b border-white pb-3">
                                        <span className="text-slate-500 font-medium">Start Date</span>
                                        <span className="font-bold text-slate-900">{formData.date || "Not set"}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white pb-3">
                                        <span className="text-slate-500 font-medium">Shift Start Time</span>
                                        <span className="font-bold text-slate-900">{formData.shiftStartTime || "Not set"}</span>
                                    </div>
                                    {formData.religiousPreference && (
                                        <div className="flex justify-between items-center border-b border-white pb-3">
                                            <span className="text-slate-500 font-medium">Religious Preference</span>
                                            <span className="font-bold text-orange-500">Yes (+Extra)</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-slate-200">
                                        <span className="text-slate-700 font-bold text-lg">Total Monthly Salary</span>
                                        <div className="text-right">
                                            <span className="font-bold text-orange-500 text-2xl">
                                                ₹{(() => {
                                                    let total = selectedService?.basePrice || 0;
                                                    if (formData.religiousPreference) total += 2000;
                                                    return total;
                                                })()}
                                            </span>
                                            <p className="text-[10px] text-slate-400">approx. estimate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto w-full">
                        {/* Info text left */}
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                            <div>
                                <p className="text-[13px] text-slate-500 font-medium mb-1">
                                    {activeShift === "Domestic Help" ? "Monthly charge" : "Monthly Salary"}{" "}
                                    <span className="text-orange-400 font-bold">
                                        ~₹{(() => {
                                            if (!selectedService) return "0";
                                            let price = selectedService.basePrice;
                                            if (formData.religiousPreference) price += 2000;
                                            return price;
                                        })()}.00
                                    </span> approx.
                                </p>
                                <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[13px] text-slate-500 font-medium mb-1">Daily Working Hours <span className="text-orange-400 font-bold">~{(() => {
                                    if (!selectedService) return "1:00";
                                    if (selectedService.title?.toLowerCase().includes('hour')) {
                                        return selectedService.title.split(' ')[0] + ':00';
                                    }
                                    if (selectedService.slug?.includes('japa') || selectedService.slug?.includes('elderly')) {
                                        return "12:00";
                                    }
                                    if (selectedService.slug?.includes('24hr')) return "24:00";
                                    return "12:00";
                                })()}</span> approx.</p>
                            </div>
                        </div>

                        {/* Buttons right */}
                        <div className="flex gap-4 w-full md:w-auto">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 md:flex-none px-10 h-14 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={step === 4 ? handleSubmit : handleNext}
                                disabled={(step === 1 && !selectedCity) || (step === 2 && !selectedService) || isSubmitting}
                                className={cn(
                                    "flex-1 md:min-w-[280px] h-14 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] flex items-center justify-center gap-2",
                                    step <= 2 ? "bg-orange-400 hover:bg-orange-500" : "bg-orange-500"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        {step === 4 ? "Confirm Booking" : "Next"}
                                        {step < 4 && <ChevronRight size={20} />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Service Modal */}
            <DynamicServiceModal
                isOpen={showDynamicModal}
                onClose={() => setShowDynamicModal(false)}
                service={selectedService}
                onConfirm={handleDynamicConfirm}
                initialData={formData}
                activeShift={activeShift}
            />
        </div>
    );
}

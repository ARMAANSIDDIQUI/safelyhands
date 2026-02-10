"use client";

import React, { useState, useEffect } from "react";
import { Check, Calendar, MapPin, User, ChevronRight, ChevronLeft, Loader2, Star, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const [showElderlyModal, setShowElderlyModal] = useState(false);
    const [showBabysitterModal, setShowBabysitterModal] = useState(false);
    const [showAllRounderModal, setShowAllRounderModal] = useState(false);
    const [showJapaModal, setShowJapaModal] = useState(false);
    const [showCookingModal, setShowCookingModal] = useState(false);
    const [showBroomingModal, setShowBroomingModal] = useState(false);
    const [showDustingModal, setShowDustingModal] = useState(false);
    const [showBathroomModal, setShowBathroomModal] = useState(false);
    const [showDishwashingModal, setShowDishwashingModal] = useState(false);
    const [showPatientCareModal, setShowPatientCareModal] = useState(false);
    const [showPeonModal, setShowPeonModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch services and auto-select if slug in URL
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);

                    // Auto-select service from URL
                    const serviceSlug = searchParams.get('service');
                    if (serviceSlug) {
                        const preSelected = data.find(s => s.slug === serviceSlug);
                        if (preSelected) {
                            handleServiceSelect(preSelected);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [searchParams]);

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleServiceSelect = (service) => {
        if (service.slug?.includes('elderly')) {
            setShowElderlyModal(true);
        }
        if (service.slug?.includes('2-12-months') || service.title?.includes('months')) {
            setShowBabysitterModal(true);
        }
        if (service.slug?.includes('japa') || service.title?.toLowerCase().includes('japa')) {
            setShowJapaModal(true);
        }
        if (service.slug?.includes('all-rounder') || service.title?.toLowerCase().includes('all rounder') || activeShift === "Hourly") {
            setShowAllRounderModal(true);
        }
        if (activeShift === "Cooking" || service.title?.toLowerCase().includes('food') || service.title?.toLowerCase().includes('cook')) {
            setShowCookingModal(true);
        }
        if (service.title?.toLowerCase().includes('brooming')) {
            setShowBroomingModal(true);
        }
        if (service.title?.toLowerCase().includes('dusting')) {
            setShowDustingModal(true);
        }
        if (service.title?.toLowerCase().includes('bathroom')) {
            setShowBathroomModal(true);
        }
        if (service.title?.toLowerCase().includes('dish-washing')) {
            setShowDishwashingModal(true);
        }
        if (service.slug?.includes('patient-care') || service.title?.toLowerCase().includes('patient care')) {
            setShowPatientCareModal(true);
        }
        if (service.slug?.includes('peon') || service.title?.toLowerCase().includes('peon')) {
            setShowPeonModal(true);
        }
        setSelectedService(service);
        setFormData({
            ...formData,
            serviceType: service.title,
            shift: service.shift || activeShift,
            genderPreference: gender
        });
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

    // Filter services based on shift and gender
    const filteredServices = services.filter(s =>
        (s.shift === activeShift) &&
        (s.gender === gender || s.gender === 'Both')
    );

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
                        service.slug?.includes('elderly') ? <div className="text-red-500 font-bold text-2xl">−</div> : <Check size={20} />
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

                {/* Header matching screenshot */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-800" />
                        </button>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Select a Service</h1>
                    </div>
                    {/* Progress Bar (Orange) */}
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 p-6 md:p-10">

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Gender Selection */}
                            <div className="flex items-center gap-6 mb-10">
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

                            {/* Shift Title or Babysitter DOB or Working Hours */}
                            <div className="mb-6">
                                {activeShift === "Babysitter" ? (
                                    <div className="flex items-center gap-3 mb-6 relative">
                                        <span className="text-slate-800 font-bold">Baby's date of birth</span>
                                        <span className="text-slate-800 font-medium">
                                            {new Date(babyDOB).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={() => setShowDOBPicker(!showDOBPicker)}
                                            className="text-orange-500 font-bold text-sm hover:underline"
                                        >
                                            Change
                                        </button>
                                        {showDOBPicker && (
                                            <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl p-4 shadow-2xl">
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
                                                                action: {
                                                                    label: "View Japa",
                                                                    onClick: () => setActiveShift("24 Hrs Live In Japa")
                                                                }
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
                                ) : activeShift === "24 Hrs Live In Japa" ? (
                                    <>
                                        <h2 className="text-xl font-bold text-slate-800 mb-1">24 Hrs Live In Japa</h2>
                                        <p className="text-orange-500 text-sm font-bold">Japa service is mandatory</p>
                                    </>
                                ) : activeShift === "Cooking" ? (
                                    <div className="space-y-10">
                                        <div className="section-cooking">
                                            <h2 className="text-xl font-bold text-slate-800 mb-1">Cooking</h2>
                                            <p className="text-orange-500 text-sm font-bold mb-6">Home-style food service is mandatory</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Cooking').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                        <div className="section-dishwashing">
                                            <h2 className="text-xl font-bold text-slate-800 mb-6">Dish-washing</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Dish-washing').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeShift === "Domestic Help" ? (
                                    <div className="space-y-10">
                                        <div className="section-cleaning">
                                            <h2 className="text-xl font-bold text-slate-800 mb-1">Cleaning</h2>
                                            <p className="text-orange-500 text-sm font-bold mb-6">Brooming, Mopping service is mandatory</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Cleaning').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                        <div className="section-addons">
                                            <h2 className="text-xl font-bold text-slate-800 mb-6">Add-ons</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Add-ons').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeShift === "Elderly Care" ? (
                                    <div className="space-y-10">
                                        <div className="section-elderly">
                                            <h2 className="text-xl font-bold text-slate-800 mb-1">Elderly Care</h2>
                                            <p className="text-orange-500 text-sm font-bold mb-6">Basic care service is mandatory</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Elderly Support').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeShift === "Peon" ? (
                                    <div className="space-y-10">
                                        <div className="section-peon">
                                            <h2 className="text-xl font-bold text-slate-800 mb-1">Peon / Office Help</h2>
                                            <p className="text-orange-500 text-sm font-bold mb-6">Office Help service is mandatory</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {filteredServices.filter(s => s.category === 'Office Support').map(service => renderServiceCard(service))}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeShift === "Hourly" ? (
                                    <>
                                        <h2 className="text-xl font-bold text-slate-800 mb-1">Working hours</h2>
                                        <p className="text-orange-500 text-sm font-bold">Select only 1 out of 4 services</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-slate-800 mb-1">{activeShift}</h2>
                                        {activeShift === "24 Hrs Live In" && filteredServices.some(s => s.category === 'Elderly Care') && (
                                            <p className="text-orange-500 text-sm font-bold">Elderly Care service is mandatory</p>
                                        )}
                                        {activeShift === "24 Hrs Live In" && !filteredServices.some(s => s.category === 'Elderly Care') && (
                                            <p className="text-orange-500 text-sm font-bold">Select only 1 out of {filteredServices.length || 4} services</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Generic Services Grid (for non-partitioned shifts) */}
                            {!loading && !['Cooking', 'Domestic Help', 'Elderly Care', 'Peon', '24 Hrs Live In Japa'].includes(activeShift) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredServices.map((service) => renderServiceCard(service))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
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
                                    *I agree to pay (i) [Monthly salary of the worker] & (ii) [Broomees subscription charges] through Broomees' online platform(s) only. The salary will be as shown here (approx.) and this includes 3 paid leaves per month which can be encashed if not taken by the worker. {selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('baby') ? "I am also aware that the babysitter will be responsible for ONLY ONE kid (unless booking is for twins) and will not do domestic chores other than the ones selected above." : "I also agree to give my worker 30-45 minutes of rest time if needed, for their health and safety. I agree to provide food and water to them during their stay at my home."}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
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
                                                <span className="text-slate-500 font-medium">Elderly's Age</span>
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
                                    {(selectedService?.slug?.includes('japa') || selectedService?.title?.toLowerCase().includes('japa')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Baby's Age</span>
                                                <span className="font-bold text-slate-900">{formData.babyAge}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">No of Kids</span>
                                                <span className="font-bold text-slate-900">{formData.noOfKids}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Servant Quarter</span>
                                                <span className="font-bold text-slate-900">{formData.servantQuarter}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}
                                    {(selectedService?.slug?.includes('all-rounder') || selectedService?.title?.toLowerCase().includes('all rounder')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Cooking</span>
                                                <span className="font-bold text-slate-900">{formData.cookingWork} ({formData.foodType})</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">House Size</span>
                                                <span className="font-bold text-slate-900">{formData.houseSize} ({formData.noOfFloors})</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">People at home</span>
                                                <span className="font-bold text-slate-900">{formData.noOfPeople}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}
                                    {(selectedService?.slug?.includes('patient-care') || selectedService?.title?.toLowerCase().includes('patient care')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Patient Condition</span>
                                                <span className="font-bold text-slate-900">{formData.patientCondition}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}
                                    {(selectedService?.slug?.includes('peon') || selectedService?.title?.toLowerCase().includes('peon')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Office Type</span>
                                                <span className="font-bold text-slate-900">{formData.officeType}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Primary Tasks</span>
                                                <span className="font-bold text-slate-900">{(formData.officeTasks || []).join(', ')}</span>
                                            </div>
                                        </>
                                    )}
                                    {/* Service Specific Details */}
                                    {(selectedService?.slug?.includes('elderly') || selectedService?.title?.toLowerCase().includes('elderly')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Age group</span>
                                                <span className="font-bold text-slate-900">{formData.age} yrs</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Diaper assistance</span>
                                                <span className="font-bold text-slate-900">{formData.diaperHelp}</span>
                                            </div>
                                        </>
                                    )}

                                    {(selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('babysitter')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Daily hours</span>
                                                <span className="font-bold text-slate-900">{formData.babysitterHours}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Number of kids</span>
                                                <span className="font-bold text-slate-900">{formData.noOfKids}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}

                                    {(selectedService?.slug?.includes('japa') || selectedService?.title?.toLowerCase().includes('japa')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Baby's Age</span>
                                                <span className="font-bold text-slate-900">{formData.babyAge}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Number of kids</span>
                                                <span className="font-bold text-slate-900">{formData.noOfKids}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Servant Room</span>
                                                <span className="font-bold text-slate-900">{formData.servantQuarter}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}

                                    {(selectedService?.slug?.includes('all-rounder') || selectedService?.title?.toLowerCase().includes('all rounder')) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Cooking</span>
                                                <span className="font-bold text-slate-900">{formData.cookingWork} ({formData.foodType})</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">House Size</span>
                                                <span className="font-bold text-slate-900">{formData.houseSize} ({formData.noOfFloors})</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">People at home</span>
                                                <span className="font-bold text-slate-900">{formData.noOfPeople}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}

                                    {(selectedService?.category === 'Cooking' || selectedService?.title?.toLowerCase().includes('cook') || (activeShift === "Cooking" && !selectedService?.category?.includes('Dish-washing'))) && (
                                        <>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Meals per day</span>
                                                <span className="font-bold text-slate-900">{formData.mealsPerDay}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Food type</span>
                                                <span className="font-bold text-slate-900">{formData.vegNonVeg}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">People at home</span>
                                                <span className="font-bold text-slate-900">{formData.noOfPeople}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-white pb-3">
                                                <span className="text-slate-500 font-medium">Pets at home</span>
                                                <span className="font-bold text-slate-900">{formData.hasPets}</span>
                                            </div>
                                        </>
                                    )}

                                    {(activeShift === "Domestic Help" || selectedService?.category === 'Cleaning' || (activeShift === "Cooking" && selectedService?.category === 'Dish-washing')) && (
                                        <>
                                            {formData.houseSize && selectedService?.category === 'Cleaning' && (
                                                <div className="flex justify-between items-center border-b border-white pb-3">
                                                    <span className="text-slate-500 font-medium">House size</span>
                                                    <span className="font-bold text-slate-900">{formData.houseSize} ({formData.noOfFloors})</span>
                                                </div>
                                            )}
                                            {formData.bathroomCleaning && selectedService?.title?.toLowerCase().includes('bathroom') && (
                                                <div className="flex justify-between items-center border-b border-white pb-3">
                                                    <span className="text-slate-500 font-medium">Bathrooms</span>
                                                    <span className="font-bold text-slate-900">{formData.bathroomCleaning}</span>
                                                </div>
                                            )}
                                            {formData.dustingDuration && selectedService?.title?.toLowerCase().includes('dusting') && (
                                                <div className="flex justify-between items-center border-b border-white pb-3">
                                                    <span className="text-slate-500 font-medium">Dusting duration</span>
                                                    <span className="font-bold text-slate-900">{formData.dustingDuration}</span>
                                                </div>
                                            )}
                                            {formData.noOfPeople && (selectedService?.title?.toLowerCase().includes('dish') || selectedService?.category === 'Dish-washing') && (
                                                <div className="flex justify-between items-center border-b border-white pb-3">
                                                    <span className="text-slate-500 font-medium">People</span>
                                                    <span className="font-bold text-slate-900">{formData.noOfPeople}</span>
                                                </div>
                                            )}
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
                                                    if ((selectedService?.slug?.includes('elderly') || selectedService?.title?.toLowerCase().includes('elderly')) && formData.diaperHelp === 'Yes') total += 3000;
                                                    if (selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('baby')) {
                                                        if (formData.noOfKids === 'Twins') total += 3000;
                                                    }
                                                    if (selectedService?.slug?.includes('japa') || selectedService?.title?.toLowerCase().includes('japa')) {
                                                        if (formData.noOfKids === 'Twins') total += 5000;
                                                    }
                                                    if (selectedService?.slug?.includes('patient-care') || selectedService?.title?.toLowerCase().includes('patient care')) {
                                                        if (formData.patientCondition === 'Critical') total += 5000;
                                                        if (formData.patientCondition === 'Bedridden') total += 3000;
                                                    }
                                                    if (selectedService?.slug?.includes('all-rounder') || selectedService?.title?.toLowerCase().includes('all rounder')) {
                                                        if (formData.houseSize === '4 BHK' || formData.houseSize === '5 BHK') total += 2000;
                                                        if (formData.noOfFloors !== '1 floor only') total += 3000;
                                                    }
                                                    if (activeShift === "Cooking" || selectedService?.title?.toLowerCase().includes('food') || selectedService?.title?.toLowerCase().includes('cook')) {
                                                        if (formData.mealsPerDay?.includes('3 meals')) total += 3000;
                                                        if (formData.vegNonVeg === 'Veg + Non Veg') total += 2000;
                                                    }
                                                    if (activeShift === "Domestic Help" || selectedService?.category === 'Cleaning' || selectedService?.category === 'Add-ons') {
                                                        if (formData.houseSize === '4 BHK' || formData.houseSize === '5 BHK') total += 2000;
                                                        if (formData.houseSize === '6 BHK') total += 4000;
                                                        if (formData.noOfFloors?.includes('2 floors')) total += 2000;
                                                        if (formData.noOfFloors?.includes('3 floors')) total += 4000;
                                                        if (formData.noOfFloors?.includes('4 floors')) total += 6000;
                                                        if (formData.noOfFloors?.includes('5 floors')) total += 8000;
                                                        if (formData.bathroomCleaning === '3-4 bathrooms') total += 1000;
                                                        if (formData.bathroomCleaning === '5-6 bathrooms') total += 2000;
                                                        if (formData.noOfPeople?.includes('5') || formData.noOfPeople?.includes('6') || formData.noOfPeople?.includes('7')) total += 1000;
                                                    }
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

                {/* Footer matching screenshot */}
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
                                            if (selectedService.slug?.includes('elderly') && formData.diaperRequired === 'Yes') {
                                                price += 3000;
                                            }
                                            if (selectedService?.slug?.includes('babysitter') || selectedService?.title?.toLowerCase().includes('baby')) {
                                                if (formData.noOfKids === 'Twins') price += 3000;
                                            }
                                            if (selectedService?.slug?.includes('japa') || selectedService?.title?.toLowerCase().includes('japa')) {
                                                if (formData.noOfKids === 'Twins') price += 5000;
                                            }
                                            if (selectedService?.slug?.includes('all-rounder') || selectedService?.title?.toLowerCase().includes('all rounder')) {
                                                if (formData.houseSize === '4 BHK' || formData.houseSize === '5 BHK') price += 2000;
                                                if (formData.noOfFloors !== '1 floor only') price += 3000;
                                            }
                                            if (activeShift === "Cooking" || selectedService?.title?.toLowerCase().includes('food') || selectedService?.title?.toLowerCase().includes('cook')) {
                                                if (formData.mealsPerDay?.includes('3 meals')) price += 3000;
                                                if (formData.vegNonVeg === 'Veg + Non Veg') price += 2000;
                                            }
                                            if (activeShift === "Domestic Help" || selectedService?.category === 'Cleaning' || selectedService?.category === 'Add-ons') {
                                                if (formData.houseSize === '4 BHK' || formData.houseSize === '5 BHK') price += 2000;
                                                if (formData.houseSize === '6 BHK') price += 4000;
                                                if (formData.noOfFloors?.includes('2 floors')) price += 2000;
                                                if (formData.noOfFloors?.includes('3 floors')) price += 4000;
                                                if (formData.noOfFloors?.includes('4 floors')) price += 6000;
                                                if (formData.noOfFloors?.includes('5 floors')) price += 8000;
                                                if (formData.bathroomCleaning === '3-4 bathrooms') price += 1000;
                                                if (formData.bathroomCleaning === '5-6 bathrooms') price += 2000;
                                                if (formData.noOfPeople?.includes('5') || formData.noOfPeople?.includes('6') || formData.noOfPeople?.includes('7')) price += 1000;
                                            }
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

                        {/* Button right */}
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
                                onClick={step === 3 ? handleSubmit : handleNext}
                                disabled={step === 1 && !selectedService || isSubmitting}
                                className={cn(
                                    "flex-1 md:min-w-[280px] h-14 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] flex items-center justify-center gap-2",
                                    step === 1 ? "bg-orange-400 hover:bg-orange-500" : "bg-orange-500"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        {step === 3 ? "Confirm Booking" : "Next"}
                                        {step < 3 && <ChevronRight size={20} />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Elderly Care Modal */}
            {showElderlyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowElderlyModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowElderlyModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="p-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-10">Elderly Care</h2>

                            <div className="space-y-10">
                                {/* Age Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Elderly's Age</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 5 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['50-59', '60-69', '70-74', '75-79', '80+'].map(age => (
                                            <button
                                                key={age}
                                                onClick={() => setFormData({ ...formData, elderlyAge: age })}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl border-2 font-bold transition-all",
                                                    formData.elderlyAge === age
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {age}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Diaper Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Diaper changing required?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 2 options</p>
                                    <div className="flex gap-4">
                                        {['Yes', 'No'].map(choice => (
                                            <button
                                                key={choice}
                                                onClick={() => setFormData({ ...formData, diaperRequired: choice })}
                                                className={cn(
                                                    "px-10 py-3 rounded-xl border-2 font-bold transition-all",
                                                    formData.diaperRequired === choice
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                                    <div>
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">
                                            Monthly Salary <span className="text-orange-400 font-bold">~₹{formData.diaperRequired === 'Yes' ? '28000.00' : '25000.00'}</span> approx.
                                        </p>
                                        <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">Daily Working Hours <span className="text-orange-400 font-bold">~12:00</span> approx.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowElderlyModal(false)}
                                    className="w-full md:w-auto px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Babysitter Modal */}
            {showBabysitterModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBabysitterModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowBabysitterModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="flex flex-col h-full max-h-[90vh]">
                            <div className="p-10 overflow-y-auto custom-scrollbar">
                                <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">2-12 months</h2>

                                <div className="space-y-10">
                                    {/* Hours Selection */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">How many hours per day?</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 7 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['4 hours', '5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours'].map(hours => (
                                                <button
                                                    key={hours}
                                                    onClick={() => setFormData({ ...formData, babysitterHours: hours })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.babysitterHours === hours
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {hours}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Kids Selection */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">No of kids</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 2 options</p>
                                        <div className="flex gap-4">
                                            {['Single', 'Twins'].map(kids => (
                                                <button
                                                    key={kids}
                                                    onClick={() => setFormData({ ...formData, noOfKids: kids })}
                                                    className={cn(
                                                        "px-10 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.noOfKids === kids
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {kids}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pets Selection */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home ?</h3>
                                        <p className="text-sm text-slate-400 mb-2">Select 1 out of 3 options</p>
                                        <p className="text-xs text-slate-400 mb-6">This would help us search for a pet friendly worker (if needed)</p>
                                        <div className="flex gap-4">
                                            {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                                <button
                                                    key={pet}
                                                    onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                    className={cn(
                                                        "px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2",
                                                        formData.hasPets === pet
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {pet}
                                                    {formData.hasPets === pet && <Check size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inclusions Box */}
                                    <div className="bg-slate-50 border-2 border-slate-100 rounded-[20px] p-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Inclusions</h3>
                                        <p className="text-sm font-bold text-slate-600 mb-2">This service includes</p>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Our babysitters in this category have expertise in all things related to diapers, formula milk, massaging, sterilising, bathing, burping, washing of clothes, taking care of hygiene, nail cutting, basic food for baby like daliyaa, khichdi, playing with babies and making them sleep, packing baby travel bag, etc.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                                    <div className="text-center md:text-left">
                                        <p className="text-[14px] text-slate-500 font-medium mb-1">
                                            Monthly Salary <span className="text-orange-400 font-bold">~₹{formData.noOfKids === 'Twins' ? '14500.00' : '11500.00'}</span> approx.
                                        </p>
                                        <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                                    </div>
                                    <div className="hidden lg:block text-slate-500 text-[14px] font-medium">
                                        Daily Working Hours <span className="text-orange-400 font-bold">~{formData.babysitterHours.split(' ')[0]}:00</span> approx.
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBabysitterModal(false)}
                                    className="w-full md:w-auto px-16 py-3.5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Rounder Modal */}
            {showAllRounderModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAllRounderModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowAllRounderModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="flex flex-col h-full max-h-[90vh]">
                            <div className="p-10 overflow-y-auto custom-scrollbar">
                                <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Specialization - All Rounder</h2>

                                <div className="space-y-10">
                                    {/* Cooking Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Cooking work</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 4 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['1 meal only', '2 meals', 'All 3 meals', 'Not required'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, cookingWork: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.cookingWork === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Food Type Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Food type (if cooking selected)</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 4 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['Veg', 'Non-veg', 'Both Veg & Non-veg', 'Not required'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, foodType: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.foodType === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Laundry Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Laundry</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 2 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['Laundry using washing machine', 'Not required'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, laundry: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.laundry === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* House Size Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Select house size</h3>
                                        <p className="text-sm text-slate-400 mb-6">Please describe the area of ONLY 1 floor</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, houseSize: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.houseSize === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Floors Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">How many such floors?</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 5 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['1 floor only', '2 floors', '3 floors', '4 floors', '5 floors'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, noOfFloors: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.noOfFloors === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bathroom Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Bathroom cleaning</h3>
                                        <p className="text-xs text-slate-400 mb-6">(Pots will NOT be cleaned by Broomees)</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['1-2 bathrooms', '3-4 bathrooms', '5-6 bathrooms', 'Not required'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, bathroomCleaning: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.bathroomCleaning === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* People Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">How many people are there at home?</h3>
                                        <p className="text-sm text-slate-400 mb-6">Select 1 out of 6 options</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['1 person', '2 people', '3 people', '4 people', '5-6 people', '7-8 people'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => setFormData({ ...formData, noOfPeople: option })}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                        formData.noOfPeople === option
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pets Section (Reused hasPets) */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home?</h3>
                                        <div className="flex gap-4 mb-4">
                                            {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                                <button
                                                    key={pet}
                                                    onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                    className={cn(
                                                        "px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2",
                                                        formData.hasPets === pet
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {pet}
                                                    {formData.hasPets === pet && <Check size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inclusions Box */}
                                    <div className="bg-slate-50 border-2 border-slate-100 rounded-[20px] p-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Inclusions</h3>
                                        <ul className="text-sm text-slate-500 space-y-2 list-disc pl-5">
                                            <li>Floor, slab and basin cleaning only</li>
                                            <li>Pots will NOT be cleaned by Broomees. Cleaning chemicals, agents etc have to be provided by client</li>
                                        </ul>
                                    </div>

                                    {/* Footer Note */}
                                    <div className="bg-orange-50/30 border border-orange-100 rounded-xl p-4">
                                        <p className="text-xs text-slate-600 font-medium italic">
                                            Please note: You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                                    <div className="text-center md:text-left">
                                        <p className="text-[14px] text-slate-500 font-medium mb-1">
                                            Monthly Salary <span className="text-orange-400 font-bold">~₹{(() => {
                                                let base = selectedService?.basePrice || 12000;
                                                if (formData.houseSize === '4 BHK' || formData.houseSize === '5 BHK') base += 2000;
                                                if (formData.noOfFloors !== '1 floor only') base += 3000;
                                                return base;
                                            })()}.00</span> approx.
                                        </p>
                                        <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                                    </div>
                                    <div className="hidden lg:block text-slate-500 text-[14px] font-medium">
                                        Daily Working Hours <span className="text-orange-400 font-bold">~{activeShift === "Hourly" ? selectedService?.title?.split(' ')[0] : "12"}:00</span> approx.
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAllRounderModal(false)}
                                    className="w-full md:w-auto px-16 py-3.5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Japa Modal */}
            {showJapaModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowJapaModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowJapaModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Japa</h2>

                            <div className="space-y-10">
                                {/* Baby Age Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Please select your baby's age</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 1 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setFormData({ ...formData, babyAge: "0-2 months" })}
                                            className={cn(
                                                "px-6 py-2.5 rounded-xl border-2 font-bold transition-all border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                            )}
                                        >
                                            0-2 months
                                        </button>
                                    </div>
                                </div>

                                {/* No of Kids Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">No of kids</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 2 options</p>
                                    <div className="flex gap-4">
                                        {['Single', 'Twins'].map(kids => (
                                            <button
                                                key={kids}
                                                onClick={() => setFormData({ ...formData, noOfKids: kids })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.noOfKids === kids
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {kids}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Servant Quarter Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Servant quarter available ?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 2 options</p>
                                    <div className="flex gap-4">
                                        {['Yes', 'No'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, servantQuarter: option })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.servantQuarter === option
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pets Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home ?</h3>
                                    <p className="text-sm text-slate-400 mb-2">Select 1 out of 3 options</p>
                                    <p className="text-xs text-slate-400 mb-6">This would help us search for a pet friendly worker (if needed)</p>
                                    <div className="flex gap-4">
                                        {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                            <button
                                                key={pet}
                                                onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2",
                                                    formData.hasPets === pet
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {pet}
                                                {formData.hasPets === pet && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                                    <div>
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">
                                            Monthly Salary <span className="text-orange-400 font-bold">~₹{(() => {
                                                let base = selectedService?.basePrice || 22000;
                                                if (formData.noOfKids === 'Twins') base += 5000;
                                                return base;
                                            })()}.00</span> approx.
                                        </p>
                                        <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">Daily Working Hours <span className="text-orange-400 font-bold">~12:00</span> approx.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowJapaModal(false)}
                                    className="w-full md:w-auto px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Patient Care Modal */}
            {showPatientCareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPatientCareModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPatientCareModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Patient Care</h2>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Patient's condition</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 4 options</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Stable', 'Recovery', 'Critical', 'Bedridden'].map(condition => (
                                            <button
                                                key={condition}
                                                onClick={() => setFormData({ ...formData, patientCondition: condition })}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.patientCondition === condition
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {condition}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home ?</h3>
                                    <div className="flex gap-4">
                                        {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                            <button
                                                key={pet}
                                                onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2",
                                                    formData.hasPets === pet
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {pet}
                                                {formData.hasPets === pet && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                                <div className="text-center md:text-left">
                                    <p className="text-[14px] text-slate-500 font-medium mb-1">
                                        Monthly Salary <span className="text-orange-400 font-bold">~₹{(() => {
                                            let base = selectedService?.basePrice || 16000;
                                            if (formData.patientCondition === 'Critical') base += 5000;
                                            if (formData.patientCondition === 'Bedridden') base += 3000;
                                            return base;
                                        })()}.00</span> approx.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPatientCareModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Peon Modal */}
            {showPeonModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPeonModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPeonModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Peon / Office Help</h2>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Office type</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['Small', 'Medium', 'Large'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({ ...formData, officeType: type })}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.officeType === type
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Primary tasks</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['Pantry', 'Filing', 'Outdoor', 'Cleaning'].map(task => (
                                            <button
                                                key={task}
                                                onClick={() => {
                                                    const tasks = formData.officeTasks || [];
                                                    const updated = tasks.includes(task) ? tasks.filter(t => t !== task) : [...tasks, task];
                                                    setFormData({ ...formData, officeTasks: updated });
                                                }}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    (formData.officeTasks || []).includes(task)
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {task}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                                <div className="text-center md:text-left">
                                    <p className="text-[14px] text-slate-500 font-medium mb-1">
                                        Monthly Salary <span className="text-orange-400 font-bold">~₹{selectedService?.basePrice || 12000}.00</span> approx.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPeonModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cooking Modal */}
            {showCookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCookingModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowCookingModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>

                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Home-style food</h2>

                            <div className="space-y-10">
                                {/* People Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">How many people are there at home?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 6 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['1 person', '2 people', '3 people', '4 people', '5-6 people', '7-8 people'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, noOfPeople: option })}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.noOfPeople === option
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Meals Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">How many meals per day?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 3 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Breakfast & Lunch', 'Dinner', 'All 3 meals (breakfast+lunch+dinner)'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, mealsPerDay: option })}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.mealsPerDay === option
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Veg/Non Veg Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Veg/Non Veg?</h3>
                                    <p className="text-sm text-slate-400 mb-1">Select 1 out of 2 options</p>
                                    <p className="text-xs text-slate-400 mb-6">For eggs, please select 'Veg + Non Veg'</p>
                                    <div className="flex gap-4">
                                        {['Veg food only', 'Veg + Non Veg'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, vegNonVeg: option })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all",
                                                    formData.vegNonVeg === option
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pets Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home ?</h3>
                                    <p className="text-sm text-slate-400 mb-2">Select 1 out of 3 options</p>
                                    <p className="text-xs text-slate-400 mb-6">This would help us search for a pet friendly worker (if needed)</p>
                                    <div className="flex gap-4">
                                        {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                            <button
                                                key={pet}
                                                onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                className={cn(
                                                    "px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2",
                                                    formData.hasPets === pet
                                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                                        : "border-slate-100 text-slate-400"
                                                )}
                                            >
                                                {pet}
                                                {formData.hasPets === pet && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Inclusions */}
                                <div className="bg-slate-50 border-2 border-slate-100 rounded-[20px] p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Inclusions</h3>
                                    <p className="text-sm text-slate-500 font-bold">Note: Cook will cook 1-2 dish per meal</p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                                    <div>
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">
                                            Monthly Salary <span className="text-orange-400 font-bold">~₹{(() => {
                                                let base = selectedService?.basePrice || 12000;
                                                if (formData.mealsPerDay?.includes('3 meals')) base += 3000;
                                                if (formData.vegNonVeg === 'Veg + Non Veg') base += 2000;
                                                return base;
                                            })()}.00</span> approx.
                                        </p>
                                        <p className="text-[10px] text-slate-400">*estimate varies with workload, shifts, timings and location</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-[13px] text-slate-500 font-medium mb-1">Daily Working Hours <span className="text-orange-400 font-bold">~{selectedService?.title?.split(' ')[0] || "1"}:00</span> approx.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCookingModal(false)}
                                    className="w-full md:w-auto px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Brooming Modal */}
            {showBroomingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBroomingModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setShowBroomingModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <span className="text-2xl">×</span>
                        </button>
                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Brooming, Mopping</h2>
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Select house size <span className="text-xs text-slate-400 font-normal">(Please describe the area of ONLY 1 floor)</span></h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 6 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, houseSize: option })}
                                                className={cn("px-6 py-2.5 rounded-xl border-2 font-bold transition-all", formData.houseSize === option ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">How many such floors?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 5 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['1 floor only', '2 floors', '3 floors', '4 floors', '5 floors'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, noOfFloors: option })}
                                                className={cn("px-6 py-2.5 rounded-xl border-2 font-bold transition-all", formData.noOfFloors === option ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Do you have pets at home ?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 3 options. This would help us search for a pet friendly worker (if needed)</p>
                                    <div className="flex gap-4">
                                        {['No', 'Dog(s)', 'Cat(s)'].map(pet => (
                                            <button
                                                key={pet}
                                                onClick={() => setFormData({ ...formData, hasPets: pet })}
                                                className={cn("px-10 py-2.5 rounded-xl border-2 font-bold transition-all flex items-center gap-2", formData.hasPets === pet ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {pet}
                                                {formData.hasPets === pet && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 flex justify-end gap-6 border-t pt-8">
                                <button
                                    onClick={() => setShowBroomingModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dusting Modal */}
            {showDustingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDustingModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setShowDustingModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <span className="text-2xl">×</span>
                        </button>
                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Dusting</h2>
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">For how long?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 4 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['30 mins', '1 hour', '1.5 hrs', '2 hours'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, dustingDuration: option })}
                                                className={cn("px-6 py-2.5 rounded-xl border-2 font-bold transition-all", formData.dustingDuration === option ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 flex justify-end gap-6 border-t pt-8">
                                <button
                                    onClick={() => setShowDustingModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bathroom Modal */}
            {showBathroomModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBathroomModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setShowBathroomModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <span className="text-2xl">×</span>
                        </button>
                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Bathroom cleaning</h2>
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">For how many bathrooms? <span className="text-xs text-slate-400 font-normal">(Pots will NOT be cleaned by Broomees)</span></h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 3 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['1-2 bathrooms', '3-4 bathrooms', '5-6 bathrooms'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, bathroomCleaning: option })}
                                                className={cn("px-6 py-2.5 rounded-xl border-2 font-bold transition-all", formData.bathroomCleaning === option ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50 border-2 border-slate-100 rounded-[20px] p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Inclusions</h3>
                                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                                        <li>Floor, slab and basin cleaning only</li>
                                        <li>Pots will NOT be cleaned by Broomees. Cleaning chemicals, agents etc have to be provided by client</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-16 flex justify-end gap-6 border-t pt-8">
                                <button
                                    onClick={() => setShowBathroomModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dishwashing Modal */}
            {showDishwashingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDishwashingModal(false)} />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setShowDishwashingModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <span className="text-2xl">×</span>
                        </button>
                        <div className="p-10">
                            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">Dish-washing</h2>
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">How many people are there at home?</h3>
                                    <p className="text-sm text-slate-400 mb-6">Select 1 out of 7 options</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['1 person only', '2 people', '3 people', '4 people', '5 people', '6 people', '7+ people'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setFormData({ ...formData, noOfPeople: option })}
                                                className={cn("px-6 py-2.5 rounded-xl border-2 font-bold transition-all", formData.noOfPeople === option ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-slate-100 text-slate-400")}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 flex justify-end gap-6 border-t pt-8">
                                <button
                                    onClick={() => setShowDishwashingModal(false)}
                                    className="px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Home, Briefcase, Tag, Check, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SUGGESTED_NAMES = [
    "Home 1",
    "Home 2",
    "Office 1",
    "Office 2",
    "Parents' House",
    "Other"
];

export default function NewAddressPage() {
    const { user, addAddress } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTarget = searchParams.get("redirect");

    const [label, setLabel] = useState("Home");
    const [addressName, setAddressName] = useState("Home 1");
    const [houseNo, setHouseNo] = useState("");
    const [landmark, setLandmark] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto calculate unique default name suggestion when user changes category
    const handleSelectSuggestion = (name) => {
        setAddressName(name);
        if (name.startsWith("Home")) setLabel("Home");
        else if (name.startsWith("Office")) setLabel("Work");
        else setLabel("Other");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullAddress.trim()) {
            toast.error("Please enter the complete address");
            return;
        }

        if (!addressName.trim()) {
            toast.error("Please provide an address name (e.g. Home 1)");
            return;
        }

        setIsSubmitting(true);

        let finalAddressString = fullAddress.trim();
        if (houseNo.trim()) {
            finalAddressString = `${houseNo.trim()}, ${finalAddressString}`;
        }
        if (landmark.trim()) {
            finalAddressString = `${finalAddressString} (Near ${landmark.trim()})`;
        }

        const res = await addAddress({
            label,
            tag: addressName.trim(),
            houseNo: houseNo.trim(),
            landmark: landmark.trim(),
            fullAddress: finalAddressString,
            isDefault
        });

        if (res.success) {
            toast.success(`Address '${addressName}' saved to your profile!`);
            if (redirectTarget) {
                router.push(redirectTarget);
            } else {
                router.push("/dashboard/addresses");
            }
        } else {
            toast.error(res.message || "Failed to save address");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            {/* Header / Back Link */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                {redirectTarget && (
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Returning to {redirectTarget === '/safeit' ? 'SafeIt Instant Help' : 'Booking'} after saving
                    </span>
                )}
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin size={26} className="text-blue-600" />
                        <span>Add New Saved Address</span>
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
                        Save this address to your account for fast 1-click booking on Safely Hands.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Suggestions Chips */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                            Address Name / Tag (Required & Unique per User)
                        </label>
                        <p className="text-xs text-slate-400 mb-3">
                            Choose a suggested name or type a unique label (e.g. <strong>Home 1</strong>, <strong>Home 2</strong>, <strong>Office 1</strong>):
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {SUGGESTED_NAMES.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(name)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                                        addressName === name
                                            ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                    )}
                                >
                                    <Sparkles size={12} className={addressName === name ? "text-yellow-300" : "text-slate-400"} />
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>

                        <input
                            type="text"
                            required
                            placeholder="e.g. Home 1, Home 2, Parents' House..."
                            value={addressName}
                            onChange={(e) => setAddressName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* Category Label */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                            Category Type
                        </label>
                        <div className="flex gap-3">
                            {[
                                { id: "Home", label: "Home", icon: Home, color: "emerald" },
                                { id: "Work", label: "Work / Office", icon: Briefcase, color: "blue" },
                                { id: "Other", label: "Other", icon: Tag, color: "purple" }
                            ].map((item) => {
                                const Icon = item.icon;
                                const isSelected = label === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setLabel(item.id)}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer",
                                            isSelected
                                                ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 font-extrabold"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        <Icon size={16} className={isSelected ? "text-blue-600" : "text-slate-400"} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* House No */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                            Flat / House / Building / Floor No.
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Flat 302, Block B, Green Heights"
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* Landmark */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                            Nearby Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Opposite City Hospital, Behind Petrol Pump"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* Full Address */}
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                            Complete Area & Street Address *
                        </label>
                        <textarea
                            required
                            rows={3}
                            placeholder="e.g. Sector 62, Main Boulevard, Moradabad, UP - 244001"
                            value={fullAddress}
                            onChange={(e) => setFullAddress(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                        />
                    </div>

                    {/* Default Checkbox */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="makePrimaryDefault"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                        />
                        <label htmlFor="makePrimaryDefault" className="text-xs font-bold text-slate-800 cursor-pointer">
                            Set as primary default address for instant 1-click bookings
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Save Address & Continue</span>
                                <Check size={18} strokeWidth={2.5} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

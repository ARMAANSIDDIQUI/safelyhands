"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Plus, Home, Briefcase, Tag, Check, Star, Edit3, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SavedAddressDropdown({
    selectedAddress,
    onSelectAddress,
    redirectUrl = "/safeit"
}) {
    const { user } = useAuth();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [hoveredAddrId, setHoveredAddrId] = useState(null);
    const [isTemporaryMode, setIsTemporaryMode] = useState(false);
    const [tempAddressText, setTempAddressText] = useState("");

    const dropdownRef = useRef(null);
    const addresses = user?.addresses || [];

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setHoveredAddrId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Find currently selected address object
    const currentSelectedObj = addresses.find(a => a.fullAddress === selectedAddress);

    const getIcon = (label) => {
        switch (label) {
            case "Work":
                return <Briefcase size={16} className="text-blue-600 shrink-0" />;
            case "Home":
                return <Home size={16} className="text-emerald-600 shrink-0" />;
            default:
                return <Tag size={16} className="text-purple-600 shrink-0" />;
        }
    };

    const handleSelect = (fullAddr) => {
        setIsTemporaryMode(false);
        onSelectAddress(fullAddr);
        setIsOpen(false);
    };

    const handleToggleTemporary = (e) => {
        const checked = e.target.checked;
        setIsTemporaryMode(checked);
        if (checked) {
            onSelectAddress(tempAddressText);
        } else if (currentSelectedObj) {
            onSelectAddress(currentSelectedObj.fullAddress);
        }
    };

    const handleTempTextChange = (e) => {
        const val = e.target.value;
        setTempAddressText(val);
        onSelectAddress(val);
    };

    return (
        <div className="space-y-3" ref={dropdownRef}>
            <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MapPin size={16} className="text-blue-600" />
                    <span>Select Service Delivery Location</span>
                </label>

                <button
                    type="button"
                    onClick={() => router.push(`/dashboard/addresses/new?redirect=${encodeURIComponent(redirectUrl)}`)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-xl border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={13} />
                    <span>+ Add New Address</span>
                </button>
            </div>

            {/* Custom Dropdown Trigger */}
            {!isTemporaryMode && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-full p-4 rounded-2xl border text-left bg-white transition-all shadow-xs flex items-center justify-between gap-3 cursor-pointer",
                            isOpen
                                ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {currentSelectedObj ? (
                                getIcon(currentSelectedObj.label)
                            ) : (
                                <MapPin size={18} className="text-slate-400 shrink-0" />
                            )}

                            <div className="truncate">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-sm text-slate-900 truncate">
                                        {currentSelectedObj?.tag || currentSelectedObj?.label || "Choose Saved Address..."}
                                    </span>
                                    {currentSelectedObj?.isDefault && (
                                        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                                    {selectedAddress || "Click to select address from your saved profile book..."}
                                </p>
                            </div>
                        </div>

                        <ChevronDown size={18} className={cn("text-slate-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180 text-blue-600")} />
                    </button>

                    {/* Open Floating Dropdown Popover */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto">
                            {addresses.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-slate-500 font-medium mb-3">No saved addresses found in your profile.</p>
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/dashboard/addresses/new?redirect=${encodeURIComponent(redirectUrl)}`)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Plus size={14} />
                                        <span>Add First Address Now</span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        Your Saved Addresses (Hover to view full details)
                                    </div>

                                    {addresses.map((addr) => {
                                        const isSelected = selectedAddress === addr.fullAddress;
                                        const isHovered = hoveredAddrId === addr._id;

                                        return (
                                            <div
                                                key={addr._id}
                                                onMouseEnter={() => setHoveredAddrId(addr._id)}
                                                onMouseLeave={() => setHoveredAddrId(null)}
                                                onClick={() => handleSelect(addr.fullAddress)}
                                                className={cn(
                                                    "p-3 rounded-xl transition-all cursor-pointer relative flex items-center justify-between gap-3",
                                                    isSelected
                                                        ? "bg-blue-50/90 text-blue-900 font-bold border border-blue-200"
                                                        : "hover:bg-blue-50/60 text-slate-800"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    {getIcon(addr.label)}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-extrabold text-xs tracking-tight">
                                                                {addr.tag || addr.label}
                                                            </span>
                                                            {addr.isDefault && (
                                                                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-black">DEFAULT</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                                                            {addr.fullAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                {isSelected && <Check size={16} className="text-blue-600 shrink-0" />}

                                                {/* HOVER DETAILS POPUP CARD */}
                                                {isHovered && (
                                                    <div className="absolute left-0 right-0 -bottom-16 bg-slate-900 text-white p-3 rounded-xl text-xs z-50 shadow-xl border border-slate-700 pointer-events-none animate-in fade-in duration-100">
                                                        <div className="font-bold text-sky-400 mb-0.5">{addr.tag || addr.label} • Full Address Details</div>
                                                        <div className="text-slate-200 font-medium leading-snug">{addr.fullAddress}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Dropdown Bottom Action Link */}
                                    <div className="pt-2 border-t border-slate-100 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/dashboard/addresses/new?redirect=${encodeURIComponent(redirectUrl)}`)}
                                            className="w-full py-2 px-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <Plus size={14} />
                                            <span>+ Add Another Address to Profile</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Checkbox Toggle for Temporary Address (No Saving) */}
            <div className="pt-1 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="tempAddressToggle"
                        checked={isTemporaryMode}
                        onChange={handleToggleTemporary}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                    />
                    <label htmlFor="tempAddressToggle" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
                        <span>Type temporary address for this single booking (Don't save to profile)</span>
                    </label>
                </div>

                {isTemporaryMode && (
                    <textarea
                        rows={3}
                        value={tempAddressText}
                        onChange={handleTempTextChange}
                        placeholder="Type temporary one-off house no, street, landmark..."
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition-colors animate-in fade-in duration-150"
                    />
                )}
            </div>
        </div>
    );
}

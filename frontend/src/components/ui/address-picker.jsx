"use client";

import React, { useState } from "react";
import { MapPin, Plus, Home, Briefcase, Tag, Check, Trash2, Star, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AddressPicker({ selectedAddress, onSelectAddress, allowManagement = true }) {
    const { user, addAddress, deleteAddress, setDefaultAddress } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newAddressForm, setNewAddressForm] = useState({
        label: "Home",
        houseNo: "",
        landmark: "",
        fullAddress: "",
        isDefault: false
    });

    const addresses = user?.addresses || [];

    // Helper for icons based on label
    const getLabelIcon = (label) => {
        switch (label) {
            case "Work":
                return <Briefcase size={16} className="text-blue-600 shrink-0" />;
            case "Home":
                return <Home size={16} className="text-emerald-600 shrink-0" />;
            default:
                return <Tag size={16} className="text-purple-600 shrink-0" />;
        }
    };

    const handleCreateAddress = async (e) => {
        e.preventDefault();
        if (!newAddressForm.fullAddress.trim()) {
            toast.error("Please enter full address");
            return;
        }

        setIsSubmitting(true);
        // Combine house no & landmark if present
        let finalFullAddress = newAddressForm.fullAddress.trim();
        if (newAddressForm.houseNo.trim()) {
            finalFullAddress = `${newAddressForm.houseNo.trim()}, ${finalFullAddress}`;
        }
        if (newAddressForm.landmark.trim()) {
            finalFullAddress = `${finalFullAddress} (Near ${newAddressForm.landmark.trim()})`;
        }

        const res = await addAddress({
            label: newAddressForm.label,
            houseNo: newAddressForm.houseNo,
            landmark: newAddressForm.landmark,
            fullAddress: finalFullAddress,
            isDefault: newAddressForm.isDefault
        });

        if (res.success) {
            toast.success("New address saved to profile!");
            if (onSelectAddress) {
                onSelectAddress(finalFullAddress);
            }
            setShowAddModal(false);
            setNewAddressForm({
                label: "Home",
                houseNo: "",
                landmark: "",
                fullAddress: "",
                isDefault: false
            });
        } else {
            toast.error(res.message || "Failed to save address");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (addrId, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this address?")) return;
        const res = await deleteAddress(addrId);
        if (res.success) {
            toast.success("Address removed");
        } else {
            toast.error(res.message || "Failed to delete address");
        }
    };

    const handleSetDefault = async (addrId, fullAddr, e) => {
        e.stopPropagation();
        const res = await setDefaultAddress(addrId);
        if (res.success) {
            toast.success("Set as default address!");
            if (onSelectAddress) {
                onSelectAddress(fullAddr);
            }
        } else {
            toast.error(res.message || "Failed to set default address");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header & Quick Selector Pills */}
            <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin size={16} className="text-blue-600" />
                    <span>Saved Delivery Addresses</span>
                </label>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                    <Plus size={14} />
                    <span>+ Add New Address</span>
                </button>
            </div>

            {/* Saved Address Cards Grid */}
            {addresses.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-4 rounded-2xl text-center text-xs text-slate-500 font-medium">
                    No saved addresses in profile yet. Click <strong>+ Add New Address</strong> to save one for quick 1-click booking!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => {
                        const isSelected = selectedAddress === addr.fullAddress;
                        return (
                            <div
                                key={addr._id}
                                onClick={() => onSelectAddress && onSelectAddress(addr.fullAddress)}
                                className={cn(
                                    "p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-2",
                                    isSelected
                                        ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                                        : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
                                )}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            {getLabelIcon(addr.label)}
                                            <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{addr.label}</span>
                                            {addr.tag && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{addr.tag}</span>}
                                        </div>

                                        {addr.isDefault && (
                                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Star size={10} className="fill-current" /> Default
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed mt-1">
                                        {addr.fullAddress}
                                    </p>
                                </div>

                                {allowManagement && (
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] font-bold">
                                        {!addr.isDefault ? (
                                            <button
                                                type="button"
                                                onClick={(e) => handleSetDefault(addr._id, addr.fullAddress, e)}
                                                className="text-slate-500 hover:text-blue-600 hover:underline"
                                            >
                                                Make Default
                                            </button>
                                        ) : (
                                            <span className="text-emerald-600 font-bold">Primary Location</span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(addr._id, e)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                                            title="Delete Address"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ADD ADDRESS MODAL (SWIGGY/ZOMATO STYLE) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                <MapPin size={22} className="text-blue-600" />
                                <span>Save New Address</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Add address details to your profile address book</p>
                        </div>

                        <form onSubmit={handleCreateAddress} className="space-y-4">
                            {/* Label Selector */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Save As</label>
                                <div className="flex gap-2">
                                    {["Home", "Work", "Other"].map((lbl) => (
                                        <button
                                            key={lbl}
                                            type="button"
                                            onClick={() => setNewAddressForm({ ...newAddressForm, label: lbl })}
                                            className={cn(
                                                "flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                                                newAddressForm.label === lbl
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                            )}
                                        >
                                            {lbl === "Home" && <Home size={14} />}
                                            {lbl === "Work" && <Briefcase size={14} />}
                                            {lbl === "Other" && <Tag size={14} />}
                                            <span>{lbl}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* House / Flat No */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">House / Flat / Building No.</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Flat 402, Sunshine Heights"
                                    value={newAddressForm.houseNo}
                                    onChange={(e) => setNewAddressForm({ ...newAddressForm, houseNo: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Near Apollo Pharmacy, Opposite City Mall"
                                    value={newAddressForm.landmark}
                                    onChange={(e) => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                                />
                            </div>

                            {/* Complete Address */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Area / Street / Complete Address *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="e.g. Sector 62, Main Road, Moradabad, Uttar Pradesh"
                                    value={newAddressForm.fullAddress}
                                    onChange={(e) => setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                                />
                            </div>

                            {/* Default Checkbox */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="isDefaultAddr"
                                    checked={newAddressForm.isDefault}
                                    onChange={(e) => setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                                />
                                <label htmlFor="isDefaultAddr" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                    Set as primary default address
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Save Address to Profile</span>
                                        <Check size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

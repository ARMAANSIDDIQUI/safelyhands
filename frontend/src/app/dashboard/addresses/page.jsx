"use client";

import React, { useState } from "react";
import { MapPin, Plus, Home, Briefcase, Tag, Star, Trash2, Edit3, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardAddressesPage() {
    const { user, deleteAddress, setDefaultAddress, updateUserProfile } = useAuth();
    const router = useRouter();

    const [editingAddress, setEditingAddress] = useState(null);
    const [editForm, setEditForm] = useState({
        tag: "",
        label: "Home",
        houseNo: "",
        landmark: "",
        fullAddress: "",
        isDefault: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addresses = user?.addresses || [];

    const getIcon = (label) => {
        switch (label) {
            case "Work":
                return <Briefcase size={18} className="text-blue-600 shrink-0" />;
            case "Home":
                return <Home size={18} className="text-emerald-600 shrink-0" />;
            default:
                return <Tag size={18} className="text-purple-600 shrink-0" />;
        }
    };

    const handleStartEdit = (addr) => {
        setEditingAddress(addr);
        setEditForm({
            tag: addr.tag || addr.label || "Home 1",
            label: addr.label || "Home",
            houseNo: addr.houseNo || "",
            landmark: addr.landmark || "",
            fullAddress: addr.fullAddress || "",
            isDefault: addr.isDefault || false
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editForm.fullAddress.trim()) {
            toast.error("Address cannot be empty");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = user?.token || localStorage.getItem("safelyhands_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/addresses/${editingAddress._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update address");

            toast.success("Address updated successfully!");
            setEditingAddress(null);
            window.location.reload();
        } catch (err) {
            toast.error(err.message || "Failed to update address");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (addrId) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        const res = await deleteAddress(addrId);
        if (res.success) {
            toast.success("Address removed");
        } else {
            toast.error(res.message || "Failed to delete address");
        }
    };

    const handleMakeDefault = async (addrId) => {
        const res = await setDefaultAddress(addrId);
        if (res.success) {
            toast.success("Primary default address updated!");
        } else {
            toast.error(res.message || "Failed to set default address");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
                        <MapPin className="h-7 w-7 text-sky-200" />
                        <span>Saved Address Book</span>
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-xl font-medium">
                        Manage your saved Home 1, Home 2, Office, and family locations with unique name tags for 1-click booking.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => router.push("/dashboard/addresses/new")}
                    className="px-5 py-3 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                    <Plus size={18} className="text-blue-600" />
                    <span>+ Add New Address</span>
                </button>
            </div>

            {/* Address Cards Grid */}
            {addresses.length === 0 ? (
                <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-xs">
                    <MapPin size={40} className="mx-auto text-slate-300" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">No saved addresses yet</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Add addresses like <strong>Home 1</strong>, <strong>Home 2</strong>, or <strong>Office</strong> to easily select them during booking!
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/addresses/new")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Add Your First Address</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {getIcon(addr.label)}
                                        <span className="font-extrabold text-base text-slate-900">
                                            {addr.tag || addr.label}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                            {addr.label}
                                        </span>
                                    </div>

                                    {addr.isDefault ? (
                                        <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <Star size={12} className="fill-current" /> Primary Default
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleMakeDefault(addr._id)}
                                            className="text-xs font-bold text-slate-400 hover:text-blue-600 hover:underline transition-colors"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                    {addr.fullAddress}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <button
                                    type="button"
                                    onClick={() => handleStartEdit(addr)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Edit3 size={14} />
                                    <span>Edit Details</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr._id)}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EDIT ADDRESS MODAL */}
            {editingAddress && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
                        <button
                            type="button"
                            onClick={() => setEditingAddress(null)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                            <Edit3 size={20} className="text-blue-600" />
                            <span>Edit Address</span>
                        </h3>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Unique Address Name Tag</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.tag}
                                    onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Complete Address *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editForm.fullAddress}
                                    onChange={(e) => setEditForm({ ...editForm, fullAddress: e.target.value })}
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Address</span>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

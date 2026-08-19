"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Zap, Clock, MapPin, User, CheckCircle2, AlertCircle, Phone, ArrowRight, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    pending_dispatch: { label: "Pending Dispatch", color: "bg-amber-100 text-amber-900 border-amber-300", step: 1 },
    worker_assigned: { label: "Worker Assigned", color: "bg-blue-100 text-blue-900 border-blue-300", step: 2 },
    dispatched: { label: "En Route (~15 Mins)", color: "bg-purple-100 text-purple-900 border-purple-300", step: 3 },
    arrived: { label: "Worker Arrived", color: "bg-teal-100 text-teal-900 border-teal-300", step: 4 },
    in_progress: { label: "In Progress", color: "bg-sky-100 text-sky-900 border-sky-300", step: 5 },
    completed: { label: "Completed", color: "bg-green-100 text-green-900 border-green-300", step: 6 },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-900 border-red-300", step: 0 },
};

export default function UserBroomITDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBroomitBookings = async () => {
        if (!user?.token) return;
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broomit/my-bookings`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (err) {
            console.error("Failed to fetch BroomIT bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBroomitBookings();
    }, [user]);

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-6 md:p-8 rounded-3xl shadow-lg">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <Zap size={14} className="fill-amber-400" />
                        <span>15-Min On-Demand Tracker</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">
                        My BroomIT Bookings
                    </h1>
                    <p className="text-slate-800 text-xs md:text-sm font-semibold mt-1">
                        Track live dispatch, assigned helpers, and arrival status for your instant requests.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchMyBroomitBookings}
                        className="p-3 bg-white/80 hover:bg-white text-slate-900 rounded-2xl shadow-sm transition-all"
                        title="Refresh Bookings"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <Link
                        href="/broomit"
                        className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2"
                    >
                        <span>Book Instant Help</span>
                        <Zap size={16} className="text-amber-400 fill-amber-400" />
                    </Link>
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-100" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No BroomIT Bookings Yet</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        Need instant help with brooming, mopping, dusting, or dish washing? Get a worker dispatched in 15 minutes!
                    </p>
                    <Link
                        href="/broomit"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-bold text-sm shadow-md transition-all"
                    >
                        Book Help in 15 Mins ⚡
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => {
                        const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending_dispatch;

                        return (
                            <div
                                key={booking._id}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all space-y-6"
                            >
                                {/* Top Bar */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                    <div>
                                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Booking ID</span>
                                        <h3 className="text-lg font-extrabold text-slate-900">#{booking.bookingNumber}</h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            Requested on: {new Date(booking.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="self-start sm:self-auto flex items-center gap-2">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider flex items-center gap-1.5 shadow-sm",
                                            statusInfo.color
                                        )}>
                                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Live Progress Tracker Bar */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
                                        <span>Dispatch Progress</span>
                                        <span className="text-amber-600 flex items-center gap-1">
                                            <Clock size={14} />
                                            ~ETA 15 Mins Arrival
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                            { step: 1, label: "Request Placed" },
                                            { step: 2, label: "Worker Assigned" },
                                            { step: 3, label: "En Route (~15m)" },
                                            { step: 6, label: "Job Completed" }
                                        ].map((s, idx) => {
                                            const isDone = statusInfo.step >= s.step;
                                            return (
                                                <div key={idx} className="space-y-1">
                                                    <div className={cn(
                                                        "h-2 rounded-full transition-all",
                                                        isDone ? "bg-amber-400" : "bg-slate-200"
                                                    )} />
                                                    <p className="text-[10px] font-semibold text-slate-500 truncate">{s.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Main Grid Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Tasks & Hours */}
                                    <div className="space-y-3">
                                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Tasks & Duration</span>
                                        <div className="space-y-1.5">
                                            <p className="text-sm font-bold text-slate-800">Duration: <span className="text-amber-600">{booking.hours} Hours</span></p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {booking.tasks.map((task, i) => (
                                                    <span key={i} className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                                                        {task}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location & Address */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Delivery Location</span>
                                        <div className="flex items-start gap-2 text-slate-700 text-xs font-medium">
                                            <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-slate-900">{booking.region}</p>
                                                <p className="text-slate-500 line-clamp-2">{booking.address}</p>
                                                <p className="mt-1 text-slate-700 font-semibold">Phone: +91 {booking.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assigned Worker Info Card */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Assigned Helper</span>
                                        {booking.assignedWorker ? (
                                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-200 flex-shrink-0">
                                                    <Image
                                                        src={booking.assignedWorker.profilePicture || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"}
                                                        alt={booking.assignedWorker.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-xs text-slate-900 truncate">{booking.assignedWorker.name}</h4>
                                                    <p className="text-[11px] text-slate-500">Verified Partner</p>
                                                </div>
                                                <a
                                                    href={`tel:${booking.assignedWorker.phone}`}
                                                    className="p-2 bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-500 transition-colors"
                                                    title="Call Worker"
                                                >
                                                    <Phone size={14} />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-50 border border-dashed border-amber-300 p-3 rounded-2xl text-xs text-amber-800 font-semibold flex items-center gap-2">
                                                <Clock size={16} className="animate-spin text-amber-600" />
                                                <span>Matching nearest helper (~15m ETA)...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing Footer */}
                                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                                    <div className="flex items-center gap-4">
                                        <span>Service Fee: <strong>₹{booking.pricingBreakdown?.serviceFee}</strong></span>
                                        <span>Platform Fee: <strong>₹{booking.pricingBreakdown?.platformFee}</strong></span>
                                        <span>GST: <strong>₹{booking.pricingBreakdown?.gst}</strong></span>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-slate-400 font-semibold mr-2">Total Amount Paid:</span>
                                        <strong className="text-lg font-black text-slate-900">₹{booking.pricingBreakdown?.amountToBePaid}</strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

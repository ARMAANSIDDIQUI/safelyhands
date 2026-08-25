"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Zap, Clock, MapPin, User, CheckCircle2, AlertCircle, Phone, Search, RefreshCw, ChevronDown, Check, X, ShieldAlert, DollarSign } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    pending_dispatch: { label: "Pending Dispatch", color: "bg-blue-100 text-blue-900 border-blue-300" },
    worker_assigned: { label: "Worker Assigned", color: "bg-sky-100 text-sky-900 border-sky-300" },
    dispatched: { label: "En Route (~15m)", color: "bg-indigo-100 text-indigo-900 border-indigo-300" },
    arrived: { label: "Worker Arrived", color: "bg-teal-100 text-teal-900 border-teal-300" },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-900 border-blue-300" },
    completed: { label: "Completed", color: "bg-green-100 text-green-900 border-green-300" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-900 border-red-300" },
};

export default function AdminSafeITManagement() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchAdminData = async () => {
        if (!user?.token) return;
        try {
            setLoading(true);

            // Fetch SafeIt / BroomIT bookings
            let bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safeit/admin/bookings`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!bookingsRes.ok) {
                bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broomit/admin/bookings`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }

            // Fetch Workers list for assignment dropdown
            const workersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (bookingsRes.ok) setBookings(await bookingsRes.json());
            if (workersRes.ok) setWorkers(await workersRes.json());
        } catch (err) {
            console.error("Failed to load admin SafeIt data:", err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [user]);

    // Handle Worker Assignment
    const handleAssignWorker = async (bookingId, workerId) => {
        try {
            setUpdatingId(bookingId);
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safeit/admin/bookings/${bookingId}/assign-worker`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ workerId })
            });

            if (!res.ok) {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broomit/admin/bookings/${bookingId}/assign-worker`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ workerId })
                });
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to assign worker");

            toast.success(workerId ? "Worker assigned & dispatched!" : "Worker unassigned");
            fetchAdminData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // Handle Status Change
    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            setUpdatingId(bookingId);
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/safeit/admin/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broomit/admin/bookings/${bookingId}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update status");

            toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label}`);
            fetchAdminData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // Filtered bookings
    const filteredBookings = bookings.filter(b => {
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const query = searchQuery.toLowerCase();
        const matchesQuery = !searchQuery ||
            b.bookingNumber?.toLowerCase().includes(query) ||
            b.phone?.includes(query) ||
            b.address?.toLowerCase().includes(query) ||
            b.user?.name?.toLowerCase().includes(query);

        return matchesStatus && matchesQuery;
    });

    // Overview Stats
    const totalCount = bookings.length;
    const pendingDispatchCount = bookings.filter(b => b.status === 'pending_dispatch').length;
    const activeCount = bookings.filter(b => ['worker_assigned', 'dispatched', 'arrived', 'in_progress'].includes(b.status)).length;
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.pricingBreakdown?.amountToBePaid || 0), 0);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
            {/* Header Banner - Blue Theme */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                        <Zap size={14} className="fill-slate-950" />
                        <span>Admin Dispatch Panel</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        SafeIt 15-Min Instant Queue
                    </h1>
                    <p className="text-blue-200 text-xs md:text-sm font-medium mt-1">
                        Dispatch verified partners, monitor 15-min arrivals, and manage on-demand requests.
                    </p>
                </div>

                <button
                    onClick={fetchAdminData}
                    className="self-start md:self-auto px-5 py-2.5 bg-sky-400 hover:bg-sky-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    <span>Refresh Queue</span>
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Total Requests</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-xs">
                    <span className="text-xs font-extrabold uppercase text-blue-800 tracking-wider">Pending Dispatch</span>
                    <p className="text-2xl font-black text-blue-900 mt-1">{pendingDispatchCount}</p>
                </div>

                <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200 shadow-xs">
                    <span className="text-xs font-extrabold uppercase text-sky-800 tracking-wider">Active Dispatches</span>
                    <p className="text-2xl font-black text-sky-900 mt-1">{activeCount}</p>
                </div>

                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
                    <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">Total Revenue</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">₹{totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID, Phone, Address..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {['all', 'pending_dispatch', 'dispatched', 'in_progress', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize",
                                statusFilter === status
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Queue */}
            {loading ? (
                <div className="h-64 bg-white rounded-3xl animate-pulse shadow-xs border border-slate-200" />
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
                    <p className="text-slate-500 font-semibold">No 15-min instant requests matching your filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                                    <th className="p-4">Booking Info</th>
                                    <th className="p-4">Customer & Location</th>
                                    <th className="p-4">Tasks & Hours</th>
                                    <th className="p-4">Assigned Worker</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredBookings.map((b) => {
                                    const statusInfo = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending_dispatch;

                                    return (
                                        <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Booking Info */}
                                            <td className="p-4 align-top">
                                                <span className="font-mono font-bold text-slate-900 block">#{b.bookingNumber}</span>
                                                <span className="text-[11px] text-slate-400 block font-medium">
                                                    {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                                                    {b.bookingType}
                                                </span>
                                            </td>

                                            {/* Customer & Location */}
                                            <td className="p-4 align-top max-w-xs">
                                                <p className="font-bold text-slate-900">{b.user?.name || "Customer"}</p>
                                                <p className="text-xs text-blue-700 font-semibold flex items-center gap-1"><Phone size={12} className="shrink-0" /> +91 {b.phone}</p>
                                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5"><strong className="text-slate-700">{b.region}:</strong> {b.address}</p>
                                            </td>

                                            {/* Tasks & Hours */}
                                            <td className="p-4 align-top">
                                                <span className="text-xs font-bold text-slate-800 block mb-1">{b.hours} Hours Session</span>
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {b.tasks.map((t, i) => (
                                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Assigned Worker Selector */}
                                            <td className="p-4 align-top min-w-[200px]">
                                                <select
                                                    value={b.assignedWorker?._id || ""}
                                                    disabled={updatingId === b._id}
                                                    onChange={(e) => handleAssignWorker(b._id, e.target.value)}
                                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="">-- Unassigned --</option>
                                                    {workers.map((w) => (
                                                        <option key={w._id} value={w._id}>
                                                            {w.name} ({w.city || 'Available'})
                                                        </option>
                                                    ))}
                                                </select>
                                                {b.assignedWorker && (
                                                    <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1"><Phone size={12} className="shrink-0" /> {b.assignedWorker.phone}</p>
                                                )}
                                            </td>

                                            {/* Amount */}
                                            <td className="p-4 align-top font-bold text-slate-900">
                                                ₹{b.pricingBreakdown?.amountToBePaid}
                                                {b.paymentProofUrl && (
                                                    <a
                                                        href={b.paymentProofUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block text-[10px] text-blue-600 underline font-bold mt-1"
                                                    >
                                                        View Proof ↗
                                                    </a>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-4 align-top">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider inline-block",
                                                    statusInfo.color
                                                )}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 align-top text-right space-y-1">
                                                <div className="flex flex-col gap-1 items-end">
                                                    {b.status === 'pending_dispatch' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(b._id, 'dispatched')}
                                                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                                                        >
                                                            <span>Dispatch ~15m</span>
                                                            <Zap size={14} className="fill-current text-white shrink-0" />
                                                        </button>
                                                    )}

                                                    {b.status === 'dispatched' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(b._id, 'arrived')}
                                                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-all"
                                                        >
                                                            Mark Arrived
                                                        </button>
                                                    )}

                                                    {['arrived', 'dispatched', 'worker_assigned'].includes(b.status) && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(b._id, 'in_progress')}
                                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all"
                                                        >
                                                            Start Session
                                                        </button>
                                                    )}

                                                    {b.status === 'in_progress' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(b._id, 'completed')}
                                                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                                                        >
                                                            <span>Complete Job</span>
                                                            <Check size={14} strokeWidth={2.5} className="shrink-0" />
                                                        </button>
                                                    )}

                                                    {b.status !== 'completed' && b.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                                                            className="px-3 py-1 text-red-600 hover:bg-red-50 font-bold text-xs rounded-lg transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

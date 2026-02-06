"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Eye, Loader2, Calendar, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminBookings() {
    const { user, loading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data);
            }
            setIsLoading(false);
        } catch (err) {
            toast.error("Failed to fetch bookings");
            setIsLoading(false);
        }
    };

    const fetchWorkers = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers`);
            const data = await res.json();
            setWorkers(data);
        } catch (err) {
            toast.error("Failed to fetch workers");
        }
    };

    useEffect(() => {
        if (!loading && user?.token) {
            fetchBookings();
            fetchWorkers();
        }
    }, [user, loading]);

    const handleAssignWorker = async (bookingId) => {
        const workerId = selectedWorker[bookingId];
        if (!workerId) {
            toast.error("Please select a worker first");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/assign`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ workerId })
            });

            if (res.ok) {
                toast.success("Worker assigned & booking approved!");
                fetchBookings();
            } else {
                throw new Error("Failed to assign");
            }
        } catch (error) {
            toast.error("Assignment failed");
        }
    };

    const handleStatusUpdate = async (bookingId, status, paymentStatus) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ status, paymentStatus })
            });

            if (res.ok) {
                toast.success(`Booking marked as ${status}`);
                fetchBookings();
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Bookings Management</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter === status ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700">Booking ID</th>
                                <th className="p-4 font-semibold text-slate-700">Service & Date</th>
                                <th className="p-4 font-semibold text-slate-700">Customer</th>
                                <th className="p-4 font-semibold text-slate-700">Status</th>
                                <th className="p-4 font-semibold text-slate-700">Assigned Worker</th>
                                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No bookings found</td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-slate-500">#{booking._id.slice(-6)}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900 capitalize">{booking.serviceType.replace('-', ' ')}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                <Calendar size={12} />
                                                {formatDate(booking.date)} at {booking.time}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">{booking.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-slate-500">{booking.city}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                        booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-amber-100 text-amber-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {booking.worker ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{booking.worker.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end items-center">
                                                {/* Assignment UI */}
                                                {booking.status === 'pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            className="p-2 border rounded-md text-xs w-32 focus:ring-1 focus:ring-blue-500 outline-none"
                                                            onChange={(e) => setSelectedWorker({ ...selectedWorker, [booking._id]: e.target.value })}
                                                            value={selectedWorker[booking._id] || ""}
                                                        >
                                                            <option value="">Assign Worker</option>
                                                            {workers.map(w => (
                                                                <option key={w._id} value={w._id}>{w.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignWorker(booking._id)}
                                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-100"
                                                            title="Approve & Assign"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Reject Button */}
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'rejected', 'unpaid')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}

                                                {/* Mark Completed */}
                                                {booking.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'completed', 'paid')}
                                                        className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-bold border border-green-100"
                                                    >
                                                        Mark Done
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

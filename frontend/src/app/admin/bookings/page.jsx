"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Eye, Loader2, Calendar, MapPin, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminBookings() {
    const { user, loading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({
        serviceType: "",
        frequency: "",
        date: "",
        address: "",
        notes: ""
    });

    const fetchBookings = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
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
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setWorkers(data);
            }
        } catch (err) {
            toast.error("Failed to fetch workers");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this booking?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${user?.token}` }
            });

            if (res.ok) {
                toast.success("Booking deleted permanently");
                fetchBookings();
            } else {
                toast.error("Failed to delete booking");
            }
        } catch (error) {
            toast.error("Error deleting booking");
        }
    };

    const handleOpenEdit = (booking) => {
        setEditingBooking(booking);
        setEditFormData({
            serviceType: booking.serviceType,
            frequency: booking.frequency,
            date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : "",
            address: booking.address,
            notes: booking.notes || ""
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${editingBooking._id}/edit`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                toast.success("Booking updated!");
                setIsEditDialogOpen(false);
                fetchBookings();
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Failed to update booking");
        }
    };

    useEffect(() => {
        if (!loading) {
            if (user) {
                fetchBookings();
                fetchWorkers();
            } else {
                setIsLoading(false);
            }
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

    const handleAttendanceUpdate = async (bookingId, attendanceStatus) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/attendance`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ attendanceStatus })
            });

            if (res.ok) {
                toast.success(`Attendance marked as ${attendanceStatus}`);
                fetchBookings();
            } else {
                throw new Error("Failed to update attendance");
            }
        } catch (error) {
            toast.error("Failed to update attendance");
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
                                <th className="p-4 font-semibold text-slate-700">Payment</th>
                                <th className="p-4 font-semibold text-slate-700">Assigned Worker</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">Attendance</th>
                                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-slate-500">No bookings found</td>
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
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                                    ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {booking.paymentStatus || 'unpaid'}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, booking.status, 'paid')}
                                                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${booking.paymentStatus === 'paid' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                                    >
                                                        Paid
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, booking.status, 'unpaid')}
                                                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${booking.paymentStatus === 'unpaid' || !booking.paymentStatus ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-400 hover:border-red-500 hover:text-red-500'}`}
                                                    >
                                                        Unpaid
                                                    </button>
                                                </div>
                                            </div>
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
                                        <td className="p-4">
                                            {booking.assignedWorker || booking.worker ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                                                        ${booking.attendanceStatus === 'present' ? 'bg-emerald-100 text-emerald-700' :
                                                            booking.attendanceStatus === 'absent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {booking.attendanceStatus?.replace('_', ' ') || 'not marked'}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleAttendanceUpdate(booking._id, 'present')}
                                                            className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${booking.attendanceStatus === 'present' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                                        >
                                                            P
                                                        </button>
                                                        <button
                                                            onClick={() => handleAttendanceUpdate(booking._id, 'absent')}
                                                            className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${booking.attendanceStatus === 'absent' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 hover:border-rose-500 hover:text-rose-500'}`}
                                                        >
                                                            A
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center text-xs text-slate-400">-</div>
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
                                                        onClick={() => handleStatusUpdate(booking._id, 'completed', booking.paymentStatus)}
                                                        className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-bold border border-green-100"
                                                    >
                                                        Mark Done
                                                    </button>
                                                )}
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleOpenEdit(booking)}
                                                    className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-100"
                                                    title="Edit Details"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(booking._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Booking Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Booking (Admin)</DialogTitle>
                        <DialogDescription>
                            Override booking details for #{editingBooking?._id?.slice(-6)}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="serviceType">Service Type</Label>
                            <Select
                                value={editFormData.serviceType}
                                onValueChange={(v) => setEditFormData({ ...editFormData, serviceType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cleaning">Cleaning</SelectItem>
                                    <SelectItem value="cooking">Cooking</SelectItem>
                                    <SelectItem value="babysitting">Babysitting</SelectItem>
                                    <SelectItem value="elderly-care">Elderly Care</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select
                                value={editFormData.frequency}
                                onValueChange={(v) => setEditFormData({ ...editFormData, frequency: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one-time">One Time</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="alternate-days">Alternate Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Service Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={editFormData.date}
                                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={editFormData.address}
                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Internal)</Label>
                            <Textarea
                                id="notes"
                                value={editFormData.notes}
                                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                placeholder="Add notes for this booking"
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Update Booking</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

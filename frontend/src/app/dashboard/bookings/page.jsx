"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Loader2, FileText, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getToken } from "@/lib/auth";

import { Skeleton } from "@/components/ui/skeleton";

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
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
            if (!token) {
                setBookings([]);
                setLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/mybookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to fetch bookings');

            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
        else setLoading(false);
    }, [user]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setBookings(prev => prev.filter(b => b._id !== id));
                toast.success("Booking cancelled successfully");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to cancel");
            }
        } catch (error) {
            toast.error("Error cancelling booking");
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
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${editingBooking._id}/edit`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

    const handleAttendanceUpdate = async (bookingId, attendanceStatus) => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/attendance`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ attendanceStatus })
            });

            if (res.ok) {
                toast.success(`Attendance marked as ${attendanceStatus}`);
                fetchBookings();
            } else {
                toast.error("Failed to update attendance");
            }
        } catch (error) {
            toast.error("Error updating attendance");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>

                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-3 w-64 mt-1" />
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-9 w-28" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
                    <p className="text-muted-foreground">Manage your service history and status.</p>
                </div>
                <Button asChild>
                    <Link href="/broomit">Book New</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Book your first service with Safely Hands today!</p>
                        <Link href="/broomit" className="text-primary-600 font-medium hover:underline">
                            Book Now
                        </Link>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <Card key={booking._id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg capitalize">{booking.serviceType} Service</h3>
                                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Frequency: <span className="font-medium text-foreground">{booking.frequency}</span> •
                                        Date: {booking.date ? format(new Date(booking.date), "PPP") : "N/A"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-md">
                                        Address: {booking.address}
                                    </p>

                                    {booking.assignedWorker && (
                                        <div className="flex items-center gap-3 mt-4 p-2 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance:</div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="xs"
                                                    variant={booking.attendanceStatus === 'present' ? 'default' : 'outline'}
                                                    className={`h-7 px-3 text-[10px] ${booking.attendanceStatus === 'present' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-slate-500'}`}
                                                    onClick={() => handleAttendanceUpdate(booking._id, 'present')}
                                                >
                                                    Present
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant={booking.attendanceStatus === 'absent' ? 'destructive' : 'outline'}
                                                    className="h-7 px-3 text-[10px]"
                                                    onClick={() => handleAttendanceUpdate(booking._id, 'absent')}
                                                >
                                                    Absent
                                                </Button>
                                            </div>
                                            {booking.attendanceStatus !== 'not_marked' && (
                                                <span className={`text-[10px] font-bold uppercase ${booking.attendanceStatus === 'present' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    ✓ {booking.attendanceStatus}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2 text-right">
                                    <div className="text-sm font-medium">
                                        Payment: <span className={
                                            booking.paymentStatus === 'paid' ? 'text-green-600' :
                                                booking.paymentStatus === 'pending_approval' ? 'text-yellow-600' : 'text-red-600'
                                        }>
                                            {booking.paymentStatus.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2 mt-2 md:mt-0">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/dashboard/bookings/${booking._id}`}>
                                                <Eye className="mr-2 h-3 w-3" /> Details
                                            </Link>
                                        </Button>

                                        {booking.status === 'pending' && (
                                            <>
                                                <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(booking)}>
                                                    <Pencil className="mr-2 h-3 w-3" /> Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(booking._id)}>
                                                    <Trash2 className="mr-2 h-3 w-3" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Booking Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                        <DialogDescription>
                            Make changes to your booking here. Click save when you're done.
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
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={editFormData.notes}
                                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                placeholder="Any special instructions?"
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

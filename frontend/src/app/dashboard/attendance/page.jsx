"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, isWithinInterval, addDays, getDay } from "date-fns";
import { Calendar as CalendarIcon, Check, X, ClipboardList, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AttendancePage() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [validDates, setValidDates] = useState([]);
    const [history, setHistory] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date());

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (selectedBooking) {
            fetchBookingDetails(selectedBooking._id);
        }
    }, [selectedBooking]);

    const fetchBookings = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/my-bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                setBookings(data);
                if (data.length > 0) {
                    setSelectedBooking(data[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingDetails = async (bookingId) => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/valid-dates/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                // Parse valid dates string to Date objects
                setValidDates(data.validDates.map(d => new Date(d)));
                setHistory(data.markedDates);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    const handleMarkAttendance = async (status) => {
        if (!selectedBooking) return;

        try {
            setMarking(true);
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    booking: selectedBooking._id,
                    status,
                    date: new Date()
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`Marked as ${status}`);
                // Refresh data
                fetchBookings();
                fetchBookingDetails(selectedBooking._id);
            } else {
                toast.error(data.message || "Failed to mark attendance");
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
            toast.error("Failed to mark attendance");
        } finally {
            setMarking(false);
        }
    };

    // Custom modifier for calendar to disable invalid dates
    const isDateDisabled = (date) => {
        if (!selectedBooking?.isActive) return true;

        // Check if date is in validDates array
        const isValid = validDates.some(validDate =>
            isSameDay(new Date(validDate), date)
        );

        return !isValid;
    };

    // Get attendance status for a specific date
    const getDateStatus = (date) => {
        const record = history.find(h => isSameDay(new Date(h.date), date));
        return record ? record.status : null;
    };

    if (loading) {
        return <AttendanceSkeleton />;
    }

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
                <p className="text-muted-foreground max-w-sm">
                    You don't have any approved bookings to mark attendance for.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
                    <p className="text-muted-foreground">Mark daily attendance for your workers</p>
                </div>

                <Select
                    value={selectedBooking?._id}
                    onValueChange={(val) => setSelectedBooking(bookings.find(b => b._id === val))}
                >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select booking" />
                    </SelectTrigger>
                    <SelectContent>
                        {bookings.map(booking => (
                            <SelectItem key={booking._id} value={booking._id}>
                                {booking.serviceType} - {booking.assignedWorker?.name || "Unassigned"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Today's Attendance</span>
                            <Badge variant={selectedBooking?.isActive ? "outline" : "secondary"}>
                                {selectedBooking?.isActive ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Clock className="w-3 h-3" /> Active Service
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <X className="w-3 h-3" /> Service Ended
                                    </span>
                                )}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            {format(new Date(), "EEEE, MMMM do, yyyy")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!selectedBooking?.isActive ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-xl bg-slate-50">
                                <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
                                <h4 className="font-semibold text-slate-900">Service Completed</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    Attendance marking is closed for this service.
                                </p>
                            </div>
                        ) : selectedBooking?.canMarkToday ? (
                            selectedBooking.todayStatus ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-xl bg-slate-50">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedBooking.todayStatus === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {selectedBooking.todayStatus === 'present' ? <Check size={24} /> : <X size={24} />}
                                    </div>
                                    <h4 className="font-semibold text-lg">
                                        Marked as {selectedBooking.todayStatus === 'present' ? 'Present' : 'Absent'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Attendance for today has been recorded.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Is <strong>{selectedBooking.assignedWorker?.name}</strong> present today?
                                    </p>
                                    <div className="flex gap-4">
                                        <Button
                                            size="lg"
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleMarkAttendance('present')}
                                            disabled={marking}
                                        >
                                            <Check className="mr-2 w-4 h-4" /> Present
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleMarkAttendance('absent')}
                                            disabled={marking}
                                        >
                                            <X className="mr-2 w-4 h-4" /> Absent
                                        </Button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-xl bg-slate-50">
                                <CalendarIcon className="w-10 h-10 text-slate-300 mb-2" />
                                <h4 className="font-semibold text-slate-900">No Attendance Required</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    Today is not a scheduled service day.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-slate-500">Frequency</span>
                            <span className="font-medium">{selectedBooking?.frequency}</span>
                        </div>
                        {selectedBooking?.frequency === 'Weekly' && (
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm text-slate-500">Days</span>
                                <span className="font-medium">
                                    {selectedBooking?.weeklyDays?.map(d =>
                                        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]
                                    ).join(', ')}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-slate-500">Start Date</span>
                            <span className="font-medium">
                                {selectedBooking?.startDate && format(new Date(selectedBooking.startDate), 'MMM d, yyyy')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-slate-500">End Date</span>
                            <span className="font-medium">
                                {selectedBooking?.endDate && format(new Date(selectedBooking.endDate), 'MMM d, yyyy')}
                            </span>
                        </div>

                        <div className="pt-2 grid grid-cols-2 gap-2">
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{selectedBooking?.presentDays || 0}</div>
                                <div className="text-xs text-green-700 font-medium">Present</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-red-600">{selectedBooking?.absentDays || 0}</div>
                                <div className="text-xs text-red-700 font-medium">Absent</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar View */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>View past attendance records</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    <Calendar
                        mode="single"
                        selected={calendarDate}
                        onSelect={setCalendarDate}
                        disabled={isDateDisabled}
                        modifiers={{
                            present: (date) => getDateStatus(date) === 'present',
                            absent: (date) => getDateStatus(date) === 'absent',
                        }}
                        modifiersStyles={{
                            present: { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' },
                            absent: { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' },
                        }}
                        className="rounded-md border shadow-sm"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function AttendanceSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-[280px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-[300px] md:col-span-2 rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
            </div>
            <Skeleton className="h-[400px] rounded-xl" />
        </div>
    );
}

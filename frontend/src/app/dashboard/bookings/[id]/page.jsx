"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    Loader2,
    MapPin,
    User,
    Star,
    CalendarCheck,
    Receipt,
    CheckCircle,
    XCircle,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";

export default function BookingDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Attendance State
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    // Review State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const fetchBooking = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Booking not found");
            const data = await res.json();
            setBooking(data);
        } catch (error) {
            toast.error("Failed to load booking details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && id) {
            fetchBooking();
        }
    }, [user, id, router]);

    const getDailyAttendanceStatus = (booking) => {
        const dateToCheck = attendanceDate || new Date().toISOString().split('T')[0];
        const logDateStr = new Date(dateToCheck).toLocaleDateString();
        const log = booking.attendanceLogs?.find(l => new Date(l.date).toLocaleDateString() === logDateStr);
        return log?.status || 'not_marked';
    };

    const handleMarkAttendance = async (status) => {
        if (!booking?.assignedWorker) return;
        setAttendanceLoading(true);
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/attendance`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    attendanceStatus: status,
                    date: attendanceDate
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(`Marked as ${status}`);
            fetchBooking();
        } catch (error) {
            toast.error(error.message || "Failed to mark attendance");
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!booking?.assignedWorker) return;
        setReviewSubmitting(true);
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookingId: booking._id,
                    rating: reviewRating,
                    comment: reviewComment
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Review submitted successfully!");
            // Optionally refresh booking to show updated review status
        } catch (error) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    if (!booking) return <div>Booking not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <Badge>{booking.status}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="capitalize">{booking.serviceType} Service</CardTitle>
                            <CardDescription>Order ID: {booking._id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CalendarCheck className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Schedule</p>
                                    <p className="text-sm text-gray-500">{booking.frequency}</p>
                                    <p className="text-sm text-gray-500">
                                        Starts: {booking.date ? format(new Date(booking.date), "PPP") : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-sm text-gray-500">{booking.address}</p>
                                </div>
                            </div>
                            {booking.notes && (
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Notes</p>
                                        <p className="text-sm text-gray-500">{booking.notes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="attendance" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
                            <TabsTrigger value="history">Bill History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="attendance" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daily Attendance</CardTitle>
                                    <CardDescription>Mark your worker's presence for the day.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {booking.assignedWorker ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="date"
                                                    className="border p-2 rounded-md"
                                                    value={attendanceDate}
                                                    onChange={(e) => setAttendanceDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                {(() => {
                                                    const status = getDailyAttendanceStatus(booking);
                                                    return (
                                                        <>
                                                            <Button
                                                                className={`w-full ${status === 'present' ? 'bg-green-700 shadow-inner' : 'bg-green-600 hover:bg-green-700'}`}
                                                                onClick={() => handleMarkAttendance('present')}
                                                                disabled={attendanceLoading}
                                                            >
                                                                {attendanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="mr-2 w-4 h-4" />}
                                                                {status === 'present' ? 'Present ✓' : 'Present'}
                                                            </Button>
                                                            <Button
                                                                className={`w-full ${status === 'absent' ? 'bg-red-700 shadow-inner' : ''}`}
                                                                variant="destructive"
                                                                onClick={() => handleMarkAttendance('absent')}
                                                                disabled={attendanceLoading}
                                                            >
                                                                {attendanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="mr-2 w-4 h-4" />}
                                                                {status === 'absent' ? 'Absent ✗' : 'Absent'}
                                                            </Button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No worker assigned yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Billing History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-gray-500">
                                        No invoices generated yet.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar / Worker Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Worker</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.assignedWorker ? (
                                <div className="text-center space-y-4">
                                    <Avatar className="w-24 h-24 mx-auto">
                                        <AvatarImage src={booking.assignedWorker.imageUrl} />
                                        <AvatarFallback>{booking.assignedWorker.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-lg">{booking.assignedWorker.name}</h3>
                                        <p className="text-sm text-gray-500">{booking.assignedWorker.profession}</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                                        <Star className="fill-current w-4 h-4" />
                                        <span className="font-medium text-black">{booking.assignedWorker.rating}</span>
                                        <span className="text-gray-400 text-xs">({booking.assignedWorker.numReviews || 0} reviews)</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500 italic">
                                    Pending Assignment
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {booking.status === 'completed' && booking.assignedWorker && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Rate Service</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-8 h-8 cursor-pointer transition-colors ${star <= reviewRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                                }`}
                                            onClick={() => setReviewRating(star)}
                                        />
                                    ))}
                                </div>
                                <Textarea
                                    placeholder="Share your experience..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />
                                <Button
                                    className="w-full"
                                    onClick={handleSubmitReview}
                                    disabled={reviewSubmitting}
                                >
                                    {reviewSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Review
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

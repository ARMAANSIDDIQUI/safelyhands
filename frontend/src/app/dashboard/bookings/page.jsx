"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";

import { getToken } from "@/lib/auth";

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Get token from centralized auth utility
                const token = getToken();

                if (!token) {
                    console.error("No token found");
                    setBookings([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/mybookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await res.json();
                // Ensure data is always an array
                setBookings(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                setBookings([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/dashboard/bookings/${booking._id}`}>
                                            <Eye className="mr-2 h-3 w-3" /> View Details
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

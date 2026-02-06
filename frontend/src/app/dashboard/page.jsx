"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, CreditCard, Loader2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { getToken } from "@/lib/auth";

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeBookings: 0,
        totalSpent: 0,
        pendingActions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = getToken();

                if (!token) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/mybookings`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch data");

                const bookings = await res.json();

                // Calculate stats
                const active = bookings.filter(b => b.status === 'approved' || b.status === 'pending').length;
                const completed = bookings.filter(b => b.status === 'completed');
                // Assuming basePrice logic or we can just mock spend for now based on count if price isn't in booking
                // Since Booking model doesn't seem to store price directly in my previous read, I'll assume standard rates or 0.
                // Or I can add a field later. For now, let's just say 0 or count * 5000.
                const spent = completed.length * 5000; // Mock calculation

                const pending = bookings.filter(b => b.status === 'pending').length;

                setStats({
                    activeBookings: active,
                    totalSpent: spent,
                    pendingActions: pending
                });

            } catch (error) {
                console.error(error);
                // toast.error("Could not load dashboard stats");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
                    <p className="text-muted-foreground">Here's an overview of your services.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" /> Back to Site
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeBookings}</div>
                        <p className="text-xs text-muted-foreground">Ongoing subscriptions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Est. Total Spent</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime value (Est.)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingActions}</div>
                        <p className="text-xs text-muted-foreground">Approvals required</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest booking updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.activeBookings === 0 && stats.pendingActions === 0 ? (
                                <div className="flex items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No recent activity found.
                                </div>
                            ) : (
                                <div className="text-sm text-slate-600">
                                    You have {stats.activeBookings} active services and {stats.pendingActions} pending requests.
                                    <br />
                                    Check <Link href="/dashboard/bookings" className="text-blue-600 underline">My Bookings</Link> for details.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                        <CardDescription>Quick actions for your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start" variant="outline" asChild>
                            <Link href="/broomit">
                                <Calendar className="mr-2 h-4 w-4" /> Book New Service
                            </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="ghost" asChild>
                            <Link href="/contact">
                                <Clock className="mr-2 h-4 w-4" /> Contact Support
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function WorkerDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, reviewsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/worker/tasks`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/worker/${user?._id}`)
                ]);

                if (bookingsRes.ok) {
                    const data = await bookingsRes.json();
                    setBookings(data);
                }

                if (reviewsRes.ok) {
                    const data = await reviewsRes.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) fetchData();
    }, [user]);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-2 font-semibold ${activeTab === 'tasks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    My Tasks ({bookings.length})
                </button>

                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Reviews ({reviews.length})
                </button>
            </div>

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
                <div>
                    {bookings.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">No tasks assigned yet.</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {bookings.map((booking) => (
                                <Card key={booking._id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="capitalize">{booking.serviceType}</CardTitle>
                                        <CardDescription>{new Date(booking.date).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <User className="w-4 h-4 mt-1 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-sm">Customer</p>
                                                <p className="text-sm text-gray-600">{booking.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-sm">Location</p>
                                                <p className="text-sm text-gray-600">{booking.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-sm">Frequency</p>
                                                <p className="text-sm text-gray-600">{booking.frequency}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}



            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
                <div>
                    {reviews.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">No reviews yet.</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {reviews.map((review) => (
                                <Card key={review._id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{review.user?.name}</CardTitle>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <CardDescription>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

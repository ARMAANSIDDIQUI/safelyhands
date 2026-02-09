"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ChatWidget from '@/components/sections/chat-widget';
import { getToken } from '@/lib/auth';

function BookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        serviceType: searchParams.get('service') || '',
        address: '',
        city: '',
        pincode: '',
        date: '',
        time: '',
        frequency: 'One-time',
        weeklyDays: [],
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                toast.error('Please login to book a service');
                router.push('/login');
            } else if (!user.phone) {
                toast.warning('Please complete your profile (Phone Number) before booking.');
                router.push('/dashboard/profile');
            }
        }
    }, [user, authLoading, router]);

    // Sync service type from URL if it changes
    useEffect(() => {
        const service = searchParams.get('service');
        if (service) {
            setFormData(prev => ({ ...prev, serviceType: service }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Get token from centralized auth utility
            const token = getToken();

            if (!token) {
                toast.error('Please login to book a service');
                router.push('/login');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Booking request submitted successfully!');
                router.push('/dashboard/bookings');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Failed to submit booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 border border-white/60">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Book Your Service
                    </h1>
                    <p className="text-slate-600 mb-8">
                        {searchParams.get('title') || 'Fill in the details below'}
                    </p>

                    <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Service Type
                            </label>
                            <select
                                id="booking-service-type"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize bg-white"
                            >
                                <option value="">Select Service Type</option>
                                <option value="cooks">Cooks & Chefs</option>
                                <option value="babysitter">Babysitter</option>
                                <option value="domestic-help">Domestic Help</option>
                                <option value="elderly-care">Elderly Care</option>
                                <option value="all-rounder">All Rounder</option>
                                <option value="24-hour-live-in">24 Hour Live-in</option>
                                <option value="japa-maid">Japa Maid</option>
                                <option value="driver">Driver</option>
                                <option value="quick-book">Quick Assist</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} /> Address
                            </label>
                            <textarea
                                id="booking-address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your full address"
                            />
                        </div>

                        {/* City & Pincode */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div id="booking-date-time" className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Start Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} /> Preferred Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Frequency
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="One-time">One Time</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Live-in">Live-in</option>
                            </select>

                            {/* Weekly Days Selector */}
                            {formData.frequency === 'Weekly' && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Select Days
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    const currentDays = formData.weeklyDays || [];
                                                    const newDays = currentDays.includes(index)
                                                        ? currentDays.filter(d => d !== index)
                                                        : [...currentDays, index];
                                                    setFormData({ ...formData, weeklyDays: newDays });
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${(formData.weeklyDays || []).includes(index)
                                                    ? 'bg-blue-600 text-white shadow-md scale-105'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {day.charAt(0)}
                                            </button>
                                        ))}
                                    </div>
                                    {(!formData.weeklyDays || formData.weeklyDays.length === 0) && (
                                        <p className="text-xs text-red-500 mt-1">Please select at least one day</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any special requirements or instructions"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            id="booking-submit-btn"
                            type="submit"
                            disabled={submitting}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Booking Request'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function BookingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 border border-white/60">
                    {/* Header Skeleton */}
                    <div className="h-10 bg-slate-200 rounded-lg w-3/4 mb-4 animate-pulse" />
                    <div className="h-6 bg-slate-100 rounded-lg w-1/2 mb-8 animate-pulse" />

                    <div className="space-y-6">
                        {/* Service Type */}
                        <div>
                            <div className="h-5 bg-slate-200 rounded w-1/4 mb-2 animate-pulse" />
                            <div className="h-12 bg-slate-100 rounded-xl w-full animate-pulse" />
                        </div>

                        {/* Address */}
                        <div>
                            <div className="h-5 bg-slate-200 rounded w-1/4 mb-2 animate-pulse" />
                            <div className="h-24 bg-slate-100 rounded-xl w-full animate-pulse" />
                        </div>

                        {/* City & Pincode */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="h-5 bg-slate-200 rounded w-1/4 mb-2 animate-pulse" />
                                <div className="h-12 bg-slate-100 rounded-xl w-full animate-pulse" />
                            </div>
                            <div>
                                <div className="h-5 bg-slate-200 rounded w-1/4 mb-2 animate-pulse" />
                                <div className="h-12 bg-slate-100 rounded-xl w-full animate-pulse" />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="h-5 bg-slate-200 rounded w-1/3 mb-2 animate-pulse" />
                                <div className="h-12 bg-slate-100 rounded-xl w-full animate-pulse" />
                            </div>
                            <div>
                                <div className="h-5 bg-slate-200 rounded w-1/3 mb-2 animate-pulse" />
                                <div className="h-12 bg-slate-100 rounded-xl w-full animate-pulse" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="h-14 bg-slate-200 rounded-xl w-full mt-8 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <Suspense fallback={<BookingSkeleton />}>
                <BookingContent />
            </Suspense>
            <Footer />
            <ChatWidget />
        </main>
    );
}

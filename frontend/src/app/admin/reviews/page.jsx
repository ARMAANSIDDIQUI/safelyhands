"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, MessageSquare, CheckCircle, XCircle, User, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { format } from "date-fns";

export default function AdminReviews() {
    const { user, loading: authLoading } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ id: null, status: null });

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/admin`, {
                headers: { "Authorization": `Bearer ${user?.token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setReviews(data);
        } catch (err) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user?.token) {
            fetchReviews();
        }
    }, [user, authLoading]);

    const handleApprovalToggle = async (id, status) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/approval`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ isApproved: status })
            });

            if (res.ok) {
                toast.success(status ? "Review approved" : "Review declined");
                fetchReviews();
            } else {
                toast.error("Failed to update review status");
            }
        } catch (err) {
            toast.error("Error updating review");
        } finally {
            setActionLoading(false);
            setIsConfirmOpen(false);
        }
    };

    const openConfirm = (id, status) => {
        setConfirmAction({ id, status });
        setIsConfirmOpen(true);
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Review Moderation</h1>
                    <p className="text-slate-500">Approve or decline customer reviews before they go public.</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-10" />
                    <h3 className="text-xl font-semibold text-slate-900">No Reviews to Moderate</h3>
                    <p className="max-w-xs mx-auto">When users leave ratings and reviews for workers, they will appear here for your approval.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <Card key={review._id} className="overflow-hidden border-slate-200 hover:border-blue-200 transition-colors shadow-sm">
                            <CardHeader className="pb-3 bg-slate-50/50">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{review.user?.name || "Unknown User"}</CardTitle>
                                            <CardDescription className="text-xs flex items-center gap-1">
                                                <User size={12} /> {review.user?.email || "No email"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={review.isApproved ? "default" : "secondary"} className={review.isApproved ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}>
                                        {review.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="py-5 space-y-4">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Briefcase size={14} className="text-blue-500" />
                                        <span className="font-medium text-slate-700">{review.worker?.name || "Deleted Worker"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-lg">{i < review.rating ? "★" : "☆"}</span>
                                    ))}
                                    <span className="ml-2 font-bold text-slate-900">{review.rating}.0</span>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-700 relative">
                                    <MessageSquare className="absolute -top-2 -left-2 text-slate-200" size={20} />
                                    "{review.comment}"
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 border-t bg-white pt-4">
                                {review.isApproved ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => openConfirm(review._id, false)}
                                        disabled={actionLoading}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Revoke Approval
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50"
                                            onClick={() => openConfirm(review._id, false)}
                                            disabled={actionLoading}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Decline
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => openConfirm(review._id, true)}
                                            disabled={actionLoading}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Review
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={() => handleApprovalToggle(confirmAction.id, confirmAction.status)}
                title={confirmAction.status ? "Approve Review?" : "Decline Review?"}
                description={confirmAction.status
                    ? "This review will become public and influence the worker's average rating."
                    : "This review will be hidden from the public site."}
                confirmText={confirmAction.status ? "Approve" : "Decline"}
                loading={actionLoading}
            />
        </div>
    );
}

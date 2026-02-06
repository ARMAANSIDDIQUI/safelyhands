"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, UserCheck, UserPlus, Loader2, Mail, Briefcase, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserManagement() {
    const { user } = useAuth();
    const [adminLoading, setAdminLoading] = useState(false);
    const [workerLoading, setWorkerLoading] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");

    const [workerForm, setWorkerForm] = useState({
        name: "",
        profession: "",
        email: ""
    });
    const [generatedId, setGeneratedId] = useState(null);

    const handlePromoteAdmin = async (e) => {
        e.preventDefault();
        if (!adminEmail) return;

        setAdminLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/promote-admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ email: adminEmail })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setAdminEmail("");
            } else {
                toast.error(data.message || "Failed to promote user");
            }
        } catch (error) {
            toast.error("Error promoting user");
        } finally {
            setAdminLoading(false);
        }
    };

    const handleCreateWorkerId = async (e) => {
        e.preventDefault();
        setWorkerLoading(true);
        setGeneratedId(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers/create-id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify(workerForm)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Worker ID Generated!");
                setGeneratedId(data.workerId);
                setWorkerForm({ name: "", profession: "", email: "" });
            } else {
                toast.error(data.message || "Failed to create worker ID");
            }
        } catch (error) {
            toast.error("Error generating worker ID");
        } finally {
            setWorkerLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Team Management</h1>
                <p className="text-slate-500 mt-2">Control administrative access and generate worker identifiers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Admin Promotion Card */}
                <Card className="border-blue-100 shadow-sm">
                    <CardHeader className="bg-blue-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Promote to Admin</CardTitle>
                                <CardDescription>Grant full management access to a user.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handlePromoteAdmin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">User Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        placeholder="user@example.com"
                                        className="pl-10"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={adminLoading}>
                                {adminLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Promote User
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Worker ID Creation Card */}
                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="bg-emerald-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Generate Worker ID</CardTitle>
                                <CardDescription>Register a help professional and get their ID.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreateWorkerId} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Rahul Sharma"
                                    value={workerForm.name}
                                    onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profession">Profession</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="profession"
                                        placeholder="e.g. Cook, Driver"
                                        className="pl-10"
                                        value={workerForm.profession}
                                        onChange={(e) => setWorkerForm({ ...workerForm, profession: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workerEmail">Email (Optional)</Label>
                                <Input
                                    id="workerEmail"
                                    type="email"
                                    placeholder="worker@example.com"
                                    value={workerForm.email}
                                    onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 italic">If email exists, user role will be updated to "worker".</p>
                            </div>

                            {generatedId ? (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center gap-2 font-bold text-xl">
                                        <IdCard size={24} />
                                        {generatedId}
                                    </div>
                                    <p className="text-xs">Share this ID with the worker for attendance tracking.</p>
                                </div>
                            ) : (
                                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={workerLoading}>
                                    {workerLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                    Generate Worker ID
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-amber-100 bg-amber-50/30">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="p-2 bg-amber-100 rounded-full h-fit text-amber-600">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900">Safety & Security</h4>
                            <p className="text-sm text-slate-600 mt-1">
                                Administrative privileges allow full data deletion and modification. Only promote trusted team members.
                                Worker IDs are essential for linking attendance logs in external verification systems.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

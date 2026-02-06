"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { User, Mail, Phone, Shield, Home, Lock, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "sonner";
import { getToken, saveSession } from "@/lib/auth";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { user, logout, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loadingResult, setLoadingResult] = useState(false);

    const handleSave = async () => {
        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Update local state and context
                // Assuming saveSession handles pure object update or we manually update user
                // Referencing AuthContext.js logic: saveSession(data, token)
                const { saveSession } = require("@/lib/auth");
                saveSession(data, token);

                // Force reload or just update context if exposed?
                // valid approach: window.location.reload() to be safe or just trigger re-fetch?
                // The context updates on mount, but let's try to update if we can access setUser 
                // However, useAuth exposes setUser, so we can use it.
                // We need to import saveSession at top or use the one from lib.

                toast.success("Profile updated successfully!");
                setIsEditing(false);
                setTimeout(() => window.location.reload(), 1000); // Simple reload to ensure all state is fresh
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoadingResult(true);

        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoadingResult(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-6">
                    <div className="col-span-2 md:col-span-1 border rounded-lg p-6 space-y-4">
                        <Skeleton className="h-7 w-48 mb-4" />
                        <div className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 border rounded-lg p-6 space-y-4">
                        <Skeleton className="h-7 w-48 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full rounded-lg" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
                    <p className="text-muted-foreground">Manage your account and security</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" /> Back to Site
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="profile">Profile Details</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="col-span-2 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="flex gap-2">
                                        <User className="h-5 w-5 text-muted-foreground mt-2" />
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="flex gap-2">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="flex gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    {isEditing ? (
                                        <>
                                            <Button onClick={handleSave} className="flex-1">
                                                Save Changes
                                            </Button>
                                            <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => setIsEditing(true)} className="w-full">
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Your account details and role</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium">Account Role</p>
                                        <p className="text-lg font-bold capitalize">{user?.role || "Customer"}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium mb-2">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        <p className="text-sm">Active</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button onClick={logout} variant="destructive" className="w-full">
                                        Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Management</CardTitle>
                            <CardDescription>
                                {user?.isGoogleUser
                                    ? "Set a password to login with email in addition to Google"
                                    : "Change your account password"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                {!user?.isGoogleUser && (
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                className="pl-9"
                                                placeholder="Enter current password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            className="pl-9"
                                            placeholder="Enter new password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            className="pl-9"
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={loadingResult}>
                                    {loadingResult ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
